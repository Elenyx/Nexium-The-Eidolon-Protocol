import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { UserService } from '../services/userService';
import pool from '../database/connection';

export default {
  data: new SlashCommandBuilder()
    .setName('market')
    .setDescription('Player-driven marketplace for trading items')
    .addSubcommand(subcommand =>
      subcommand
        .setName('browse')
        .setDescription('Browse items available for purchase')
        .addStringOption(option =>
          option
            .setName('category')
            .setDescription('Filter by item category')
            .addChoices(
              { name: 'All Items', value: 'all' },
              { name: 'Tuners', value: 'tuner' },
              { name: 'Materials', value: 'material' },
              { name: 'Equipment', value: 'equipment' }
            )
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('sell')
        .setDescription('List an item for sale')
        .addStringOption(option =>
          option
            .setName('item')
            .setDescription('Name of the item to sell')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName('quantity')
            .setDescription('How many to sell')
            .setRequired(true)
            .setMinValue(1)
        )
        .addIntegerOption(option =>
          option
            .setName('price')
            .setDescription('Price per unit in CRD')
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('buy')
        .setDescription('Purchase an item from the market')
        .addIntegerOption(option =>
          option
            .setName('listing_id')
            .setDescription('ID of the market listing')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName('quantity')
            .setDescription('How many to buy (optional, defaults to all)')
            .setRequired(false)
            .setMinValue(1)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('my_listings')
        .setDescription('View your active market listings')
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    try {
      // Check if user exists
      const user = await UserService.getUser(userId);
      if (!user) {
        await interaction.reply({
          content: '❌ You need a profile first! Use `/profile create` to start your journey.',
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      if (subcommand === 'browse') {
        const category = interaction.options.getString('category') || 'all';
        
        let query = `
          SELECT ml.id, ml.quantity, ml.price_per_unit, ml.total_price, ml.quality,
                 u.username as seller, i.name, i.type, i.rarity, i.description
          FROM market_listings ml
          JOIN users u ON ml.seller_id = u.id
          JOIN items i ON ml.item_id = i.id
          WHERE ml.sold = false AND ml.seller_id != $1
        `;
        const params = [userId];

        if (category !== 'all') {
          query += ' AND i.type = $2';
          params.push(category);
        }

        query += ' ORDER BY i.type, ml.price_per_unit ASC LIMIT 20';

        const result = await pool.query(query, params);
        const listings = result.rows;

        if (listings.length === 0) {
          const categoryText = category === 'all' ? '' : ` in ${category}s`;
          await interaction.reply({
            content: `🏪 No items available for purchase${categoryText} right now.\n\n*Check back later or list your own items with \`/market sell\`!*`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        const rarityEmojis: Record<string, string> = {
          'Flawless': '💎',
          'Optimized': '⭐',
          'Stable': '🔹',
          'Unstable': '⚪'
        };

        let marketText = `# 🏪 Nexium Marketplace\n\n`;
        
        // Group by type
        const itemsByType: Record<string, any[]> = {};
        listings.forEach(listing => {
          if (!itemsByType[listing.type]) {
            itemsByType[listing.type] = [];
          }
          itemsByType[listing.type].push(listing);
        });

        for (const [type, typeListings] of Object.entries(itemsByType)) {
          marketText += `**${type.toUpperCase()}S:**\n`;
          
          typeListings.forEach(listing => {
            const rarityEmoji = rarityEmojis[listing.rarity] || '⚫';
            const qualityText = listing.quality && listing.quality !== 'Stable' ? ` (${listing.quality})` : '';
            marketText += `${rarityEmoji} **${listing.name}**${qualityText}\n`;
            marketText += `   ID: ${listing.id} | x${listing.quantity} @ ${listing.price_per_unit.toLocaleString()} CRD each\n`;
            marketText += `   *Seller: ${listing.seller}*\n\n`;
          });
        }

        marketText += '*Use `/market buy [listing_id]` to purchase items!*';

        await interaction.reply({
          components: [
            {
              type: 10,
              content: marketText
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });

      } else if (subcommand === 'sell') {
        const itemName = interaction.options.getString('item', true);
        const quantity = interaction.options.getInteger('quantity', true);
        const price = interaction.options.getInteger('price', true);

        // Find the item in user's inventory
        const inventoryQuery = `
          SELECT ui.id, ui.quantity, ui.quality, i.id as item_id, i.name, i.type, i.rarity, i.base_value
          FROM user_items ui
          JOIN items i ON ui.item_id = i.id
          WHERE ui.user_id = $1 AND LOWER(i.name) LIKE LOWER($2)
        `;

        const inventoryResult = await pool.query(inventoryQuery, [userId, `%${itemName}%`]);
        const userItem = inventoryResult.rows[0];

        if (!userItem) {
          await interaction.reply({
            content: `❌ You don't have "${itemName}" in your inventory.\n\nUse \`/iv\` to check your items!`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        if (userItem.quantity < quantity) {
          await interaction.reply({
            content: `❌ You only have ${userItem.quantity} of "${userItem.name}" but want to sell ${quantity}!`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Reasonable price check (not too extreme)
        if (price > userItem.base_value * 10) {
          await interaction.reply({
            content: `⚠️ Your price (${price.toLocaleString()} CRD) seems too high!\n\nBase value: ${userItem.base_value} CRD\nConsider pricing around ${Math.floor(userItem.base_value * 1.5)}-${userItem.base_value * 3} CRD per unit.`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Create market listing
        const totalPrice = price * quantity;
        const listingQuery = `
          INSERT INTO market_listings (seller_id, item_id, quantity, price_per_unit, total_price, quality, expires_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '7 days')
          RETURNING id
        `;

        const listingResult = await pool.query(listingQuery, [
          userId, userItem.item_id, quantity, price, totalPrice, userItem.quality
        ]);

        // Remove items from user's inventory
        if (userItem.quantity === quantity) {
          await pool.query('DELETE FROM user_items WHERE id = $1', [userItem.id]);
        } else {
          await pool.query('UPDATE user_items SET quantity = quantity - $1 WHERE id = $2', [quantity, userItem.id]);
        }

        const listingId = listingResult.rows[0].id;

        await interaction.reply({
          components: [
            {
              type: 10,
              content: `✅ **Item Listed Successfully!**\n\n**${userItem.name}** x${quantity}\n💰 **Price:** ${price.toLocaleString()} CRD each (${totalPrice.toLocaleString()} total)\n📋 **Listing ID:** ${listingId}\n\n*Your listing will expire in 7 days. Use \`/market my_listings\` to manage your items.*`
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });

      } else if (subcommand === 'buy') {
        const listingId = interaction.options.getInteger('listing_id', true);
        const buyQuantity = interaction.options.getInteger('quantity');

        // Get the listing
        const listingQuery = `
          SELECT ml.*, i.name, i.type, i.rarity, u.username as seller
          FROM market_listings ml
          JOIN items i ON ml.item_id = i.id
          JOIN users u ON ml.seller_id = u.id
          WHERE ml.id = $1 AND ml.sold = false AND ml.expires_at > NOW()
        `;

        const listingResult = await pool.query(listingQuery, [listingId]);
        const listing = listingResult.rows[0];

        if (!listing) {
          await interaction.reply({
            content: '❌ Listing not found or no longer available.',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        if (listing.seller_id === userId) {
          await interaction.reply({
            content: '❌ You cannot buy your own listings!',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        const finalQuantity = buyQuantity || listing.quantity;
        if (finalQuantity > listing.quantity) {
          await interaction.reply({
            content: `❌ Only ${listing.quantity} available, but you want to buy ${finalQuantity}!`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        const totalCost = listing.price_per_unit * finalQuantity;

        // Check if buyer has enough CRD
        if (user.cred < totalCost) {
          await interaction.reply({
            content: `❌ Insufficient funds!\n\nCost: ${totalCost.toLocaleString()} CRD\nYou have: ${user.cred.toLocaleString()} CRD\nNeed: ${(totalCost - user.cred).toLocaleString()} more CRD`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Process the transaction
        await pool.query('BEGIN');

        try {
          // Deduct CRD from buyer
          await pool.query('UPDATE users SET cred = cred - $1 WHERE id = $2', [totalCost, userId]);

          // Add CRD to seller (minus 5% market fee)
          const sellerAmount = Math.floor(totalCost * 0.95);
          await pool.query('UPDATE users SET cred = cred + $1 WHERE id = $2', [sellerAmount, listing.seller_id]);

          // Add item to buyer's inventory
          const existingItem = await pool.query(
            'SELECT id, quantity FROM user_items WHERE user_id = $1 AND item_id = $2 AND quality = $3',
            [userId, listing.item_id, listing.quality]
          );

          if (existingItem.rows.length > 0) {
            await pool.query('UPDATE user_items SET quantity = quantity + $1 WHERE id = $2', 
              [finalQuantity, existingItem.rows[0].id]);
          } else {
            await pool.query(
              'INSERT INTO user_items (user_id, item_id, quantity, quality) VALUES ($1, $2, $3, $4)',
              [userId, listing.item_id, finalQuantity, listing.quality]
            );
          }

          // Update or remove listing
          if (finalQuantity === listing.quantity) {
            await pool.query('UPDATE market_listings SET sold = true WHERE id = $1', [listingId]);
          } else {
            await pool.query('UPDATE market_listings SET quantity = quantity - $1, total_price = price_per_unit * quantity WHERE id = $2', 
              [finalQuantity, listingId]);
          }

          await pool.query('COMMIT');

          const marketFee = totalCost - sellerAmount;

          await interaction.reply({
            components: [
              {
                type: 10,
                content: `✅ **Purchase Successful!**\n\n**${listing.name}** x${finalQuantity}\n💰 **Paid:** ${totalCost.toLocaleString()} CRD\n📦 **Market Fee:** ${marketFee.toLocaleString()} CRD (5%)\n👤 **Seller:** ${listing.seller}\n\n*Items have been added to your inventory!*`
              }
            ],
            flags: MessageFlags.IsComponentsV2
          });

        } catch (error) {
          await pool.query('ROLLBACK');
          throw error;
        }

      } else if (subcommand === 'my_listings') {
        const query = `
          SELECT ml.id, ml.quantity, ml.price_per_unit, ml.total_price, ml.quality, ml.sold, ml.expires_at,
                 i.name, i.type, i.rarity
          FROM market_listings ml
          JOIN items i ON ml.item_id = i.id
          WHERE ml.seller_id = $1 AND ml.expires_at > NOW()
          ORDER BY ml.sold ASC, ml.id DESC
        `;

        const result = await pool.query(query, [userId]);
        const listings = result.rows;

        if (listings.length === 0) {
          await interaction.reply({
            content: '📋 You don\'t have any active market listings.\n\n*Use `/market sell` to list items for sale!*',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        let listingsText = `# 📋 ${interaction.user.displayName}'s Market Listings\n\n`;

        listings.forEach(listing => {
          const statusEmoji = listing.sold ? '✅' : '🔄';
          const expiresDate = new Date(listing.expires_at).toLocaleDateString();
          
          listingsText += `${statusEmoji} **${listing.name}** x${listing.quantity}\n`;
          listingsText += `   ID: ${listing.id} | ${listing.price_per_unit.toLocaleString()} CRD each\n`;
          listingsText += `   Status: ${listing.sold ? 'SOLD' : 'ACTIVE'} | Expires: ${expiresDate}\n\n`;
        });

        listingsText += '*Active listings will automatically expire after 7 days.*';

        await interaction.reply({
          components: [
            {
              type: 10,
              content: listingsText
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });
      }

    } catch (error) {
      console.error('Error in market command:', error);
      await interaction.reply({
        content: '❌ An error occurred in the marketplace. Please try again.',
        flags: MessageFlags.Ephemeral
      });
    }
  }
};
