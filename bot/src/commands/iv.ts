import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { UserService } from '../services/userService.js';
import pool from '../database/connection.js';

export default {
  data: new SlashCommandBuilder()
    .setName('iv')
    .setDescription('View your inventory and items')
    .addStringOption(option =>
      option
        .setName('category')
        .setDescription('Filter items by category')
        .addChoices(
          { name: 'All Items', value: 'all' },
          { name: 'Tuners', value: 'tuner' },
          { name: 'Materials', value: 'material' },
          { name: 'Equipment', value: 'equipment' },
          { name: 'Consumables', value: 'consumable' }
        )
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.user.id;
    const category = interaction.options.getString('category') || 'all';

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

      // Get user's inventory
      let query = `
        SELECT ui.quantity, ui.quality, i.name, i.type, i.subtype, i.rarity, i.description, i.base_value
        FROM user_items ui
        JOIN items i ON ui.item_id = i.id
        WHERE ui.user_id = $1
      `;
      const params = [userId];

      if (category !== 'all') {
        query += ' AND i.type = $2';
        params.push(category);
      }

      query += ' ORDER BY i.type, i.rarity DESC, i.name';

      const result = await pool.query(query, params);
      const items = result.rows;

      if (items.length === 0) {
        const categoryText = category === 'all' ? '' : ` in the ${category} category`;
        await interaction.reply({
          content: `📦 Your inventory is empty${categoryText}!\n\n*Earn items by winning encounters, completing daily rewards, and participating in events!*`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      // Group items by type
      const itemsByType: Record<string, any[]> = {};
      items.forEach(item => {
        if (!itemsByType[item.type]) {
          itemsByType[item.type] = [];
        }
        itemsByType[item.type].push(item);
      });

      // Format inventory display
      let inventoryText = `# 📦 ${interaction.user.displayName}'s Inventory\n\n`;
      
      // Add currency display
      inventoryText += `💰 **Currencies:**\n🪙 ${user.nexium.toLocaleString()} NEX | 💳 ${user.cred.toLocaleString()} CRD\n\n`;

      const typeEmojis: Record<string, string> = {
        'tuner': '📡',
        'material': '🔮',
        'equipment': '⚔️',
        'consumable': '🧪'
      };

      const rarityEmojis: Record<string, string> = {
        'Flawless': '💎',
        'Optimized': '⭐',
        'Stable': '🔹',
        'Unstable': '⚪'
      };

      for (const [type, typeItems] of Object.entries(itemsByType)) {
        const emoji = typeEmojis[type] || '📦';
        inventoryText += `${emoji} **${type.toUpperCase()}S**\n`;
        
        typeItems.forEach(item => {
          const rarityEmoji = rarityEmojis[item.rarity] || '⚫';
          const qualityText = item.quality && item.quality !== 'Stable' ? ` (${item.quality})` : '';
          inventoryText += `${rarityEmoji} **${item.name}**${qualityText} x${item.quantity}\n`;
          if (item.description && item.description.length < 60) {
            inventoryText += `   *${item.description}*\n`;
          }
        });
        inventoryText += '\n';
      }

      // Calculate total value
      const totalValue = items.reduce((sum, item) => sum + (item.base_value * item.quantity), 0);
      inventoryText += `💰 **Total Inventory Value:** ${totalValue.toLocaleString()} CRD\n\n*Use items in combat and crafting to maximize their potential!*`;

      const components = [
        {
          type: 10, // TextDisplay
          content: inventoryText
        }
      ];

      await interaction.reply({
        components,
        flags: MessageFlags.IsComponentsV2
      });

    } catch (error) {
      console.error('Error in inventory command:', error);
      await interaction.reply({
        content: '❌ An error occurred while loading your inventory. Please try again.',
        flags: MessageFlags.Ephemeral
      });
    }
  }
};

