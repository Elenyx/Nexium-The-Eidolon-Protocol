import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { UserService } from '../services/userService.js';
import pool from '../database/connection.js';

export default {
  data: new SlashCommandBuilder()
    .setName('syndicate')
    .setDescription('Manage Syndicate (guild) operations and ward control')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a new Syndicate')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Name of your Syndicate')
            .setRequired(true)
            .setMaxLength(50)
        )
        .addStringOption(option =>
          option
            .setName('description')
            .setDescription('Description of your Syndicate')
            .setRequired(false)
            .setMaxLength(200)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('join')
        .setDescription('Join an existing Syndicate')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Name of the Syndicate to join')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('leave')
        .setDescription('Leave your current Syndicate')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('info')
        .setDescription('View Syndicate information')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Syndicate name (defaults to your own)')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('wards')
        .setDescription('View ward control status across Neo-Avalon')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('claim')
        .setDescription('Attempt to claim a ward for your Syndicate')
        .addStringOption(option =>
          option
            .setName('ward')
            .setDescription('Name of the ward to claim')
            .setRequired(true)
            .addChoices(
              { name: 'Digital District', value: 'digital_district' },
              { name: 'Tech Sector', value: 'tech_sector' },
              { name: 'Memory Banks', value: 'memory_banks' },
              { name: 'Data Vaults', value: 'data_vaults' },
              { name: 'Neo-Avalon Central', value: 'central_plaza' }
            )
        )
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

      // Create syndicates table if not exists
      await this.createSyndicateTables();

      if (subcommand === 'create') {
        const syndicateName = interaction.options.getString('name', true);
        const description = interaction.options.getString('description') || 'A new Syndicate in Neo-Avalon';

        // Check if user is already in a syndicate
        const existingMembership = await pool.query(
          'SELECT sm.syndicate_id, s.name FROM syndicate_members sm JOIN syndicates s ON sm.syndicate_id = s.id WHERE sm.user_id = $1',
          [userId]
        );

        if (existingMembership.rows.length > 0) {
          await interaction.reply({
            content: `❌ You're already a member of **${existingMembership.rows[0].name}**!\n\nUse \`/syndicate leave\` first if you want to create a new Syndicate.`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Check if syndicate name already exists
        const existingSyndicate = await pool.query('SELECT id FROM syndicates WHERE LOWER(name) = LOWER($1)', [syndicateName]);
        if (existingSyndicate.rows.length > 0) {
          await interaction.reply({
            content: `❌ A Syndicate named **${syndicateName}** already exists!\n\nChoose a different name.`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Create syndicate
        const syndicateResult = await pool.query(
          'INSERT INTO syndicates (name, description, leader_id) VALUES ($1, $2, $3) RETURNING id',
          [syndicateName, description, userId]
        );

        const syndicateId = syndicateResult.rows[0].id;

        // Add creator as leader
        await pool.query(
          'INSERT INTO syndicate_members (syndicate_id, user_id, rank) VALUES ($1, $2, $3)',
          [syndicateId, userId, 'Leader']
        );

        await interaction.reply({
          components: [
            {
              type: 10,
              content: `🏛️ **Syndicate Created Successfully!**\n\n**${syndicateName}** has been established in Neo-Avalon!\n\n**Leader:** ${interaction.user.displayName}\n**Description:** ${description}\n\n*Your Syndicate can now recruit members and compete for ward control. Share the name with others so they can join with \`/syndicate join ${syndicateName}\`!*`
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });

      } else if (subcommand === 'join') {
        const syndicateName = interaction.options.getString('name', true);

        // Check if user is already in a syndicate
        const existingMembership = await pool.query(
          'SELECT sm.syndicate_id, s.name FROM syndicate_members sm JOIN syndicates s ON sm.syndicate_id = s.id WHERE sm.user_id = $1',
          [userId]
        );

        if (existingMembership.rows.length > 0) {
          await interaction.reply({
            content: `❌ You're already a member of **${existingMembership.rows[0].name}**!\n\nUse \`/syndicate leave\` first if you want to join a different Syndicate.`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Find syndicate
        const syndicate = await pool.query('SELECT id, name, description FROM syndicates WHERE LOWER(name) = LOWER($1)', [syndicateName]);
        if (syndicate.rows.length === 0) {
          await interaction.reply({
            content: `❌ Syndicate **${syndicateName}** not found!\n\nCheck the spelling or ask a member for the exact name.`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        const syndicateData = syndicate.rows[0];

        // Join syndicate
        await pool.query(
          'INSERT INTO syndicate_members (syndicate_id, user_id, rank) VALUES ($1, $2, $3)',
          [syndicateData.id, userId, 'Member']
        );

        await interaction.reply({
          components: [
            {
              type: 10,
              content: `🤝 **Welcome to ${syndicateData.name}!**\n\n${interaction.user.displayName} has joined the Syndicate!\n\n*${syndicateData.description}*\n\n*Contribute to ward control efforts and participate in Syndicate activities to earn contribution points!*`
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });

      } else if (subcommand === 'leave') {
        const membership = await pool.query(
          'SELECT sm.syndicate_id, s.name, sm.rank FROM syndicate_members sm JOIN syndicates s ON sm.syndicate_id = s.id WHERE sm.user_id = $1',
          [userId]
        );

        if (membership.rows.length === 0) {
          await interaction.reply({
            content: '❌ You\'re not a member of any Syndicate.',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        const syndicateData = membership.rows[0];

        if (syndicateData.rank === 'Leader') {
          // Check if there are other members
          const memberCount = await pool.query('SELECT COUNT(*) FROM syndicate_members WHERE syndicate_id = $1', [syndicateData.syndicate_id]);
          
          if (parseInt(memberCount.rows[0].count) > 1) {
            await interaction.reply({
              content: '❌ You cannot leave as Leader while other members remain!\n\nPromote someone else to Leader first, or disband the Syndicate.',
              flags: MessageFlags.Ephemeral
            });
            return;
          } else {
            // Delete the entire syndicate if leader is the only member
            await pool.query('DELETE FROM syndicate_members WHERE syndicate_id = $1', [syndicateData.syndicate_id]);
            await pool.query('DELETE FROM syndicates WHERE id = $1', [syndicateData.syndicate_id]);

            await interaction.reply({
              components: [
                {
                  type: 10,
                  content: `🏛️ **Syndicate Disbanded**\n\n**${syndicateData.name}** has been dissolved.\n\n${interaction.user.displayName} was the last member.`
                }
              ],
              flags: MessageFlags.IsComponentsV2
            });
            return;
          }
        }

        // Remove member
        await pool.query('DELETE FROM syndicate_members WHERE user_id = $1', [userId]);

        await interaction.reply({
          components: [
            {
              type: 10,
              content: `👋 **Left Syndicate**\n\n${interaction.user.displayName} has left **${syndicateData.name}**.\n\n*You can join another Syndicate anytime with \`/syndicate join\`.*`
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });

      } else if (subcommand === 'info') {
        let targetSyndicate = interaction.options.getString('name');
        
        if (!targetSyndicate) {
          // Get user's syndicate
          const membership = await pool.query(
            'SELECT s.name FROM syndicate_members sm JOIN syndicates s ON sm.syndicate_id = s.id WHERE sm.user_id = $1',
            [userId]
          );

          if (membership.rows.length === 0) {
            await interaction.reply({
              content: '❌ You\'re not in a Syndicate and didn\'t specify one to view.\n\nUse `/syndicate join [name]` to join one!',
              flags: MessageFlags.Ephemeral
            });
            return;
          }
          targetSyndicate = membership.rows[0].name;
        }

        // Get syndicate info
        const syndicateQuery = `
          SELECT s.*, u.username as leader_name,
                 (SELECT COUNT(*) FROM syndicate_members WHERE syndicate_id = s.id) as member_count
          FROM syndicates s
          JOIN users u ON s.leader_id = u.id
          WHERE LOWER(s.name) = LOWER($1)
        `;

        const syndicateResult = await pool.query(syndicateQuery, [targetSyndicate]);
        if (syndicateResult.rows.length === 0) {
          await interaction.reply({
            content: `❌ Syndicate **${targetSyndicate}** not found!`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        const syndicate = syndicateResult.rows[0];

        // Get member list
        const membersQuery = `
          SELECT u.username, sm.rank, sm.contribution_points, sm.joined_at
          FROM syndicate_members sm
          JOIN users u ON sm.user_id = u.id
          WHERE sm.syndicate_id = $1
          ORDER BY sm.rank DESC, sm.contribution_points DESC, sm.joined_at ASC
        `;

        const membersResult = await pool.query(membersQuery, [syndicate.id]);
        const members = membersResult.rows;

        let membersList = '';
        members.slice(0, 10).forEach(member => {
          const rankEmoji = member.rank === 'Leader' ? '👑' : member.rank === 'Officer' ? '⚔️' : '🛡️';
          membersList += `${rankEmoji} **${member.username}** (${member.contribution_points} pts)\n`;
        });

        if (members.length > 10) {
          membersList += `*...and ${members.length - 10} more members*\n`;
        }

        const wardText = syndicate.controlled_ward ? `🏛️ **${syndicate.controlled_ward.replace('_', ' ').toUpperCase()}**` : 'None';

        await interaction.reply({
          components: [
            {
              type: 10,
              content: `# 🏛️ ${syndicate.name}\n\n${syndicate.description}\n\n**👑 Leader:** ${syndicate.leader_name}\n**👥 Members:** ${syndicate.member_count}\n**🏛️ Controlled Ward:** ${wardText}\n**📊 Level:** ${syndicate.level}\n**🔋 Resources:** ${syndicate.resources.toLocaleString()}\n\n**ACTIVE MEMBERS:**\n${membersList}\n\n*Syndicates compete for ward control through cooperative PvE leaderboards and resource management.*`
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });

      } else if (subcommand === 'wards') {
        const wardsQuery = `
          SELECT controlled_ward, name, level, resources
          FROM syndicates
          WHERE controlled_ward IS NOT NULL
        `;

        const wardsResult = await pool.query(wardsQuery);
        const controlledWards = wardsResult.rows;

        const allWards = [
          { name: 'Digital District', key: 'digital_district', bonus: '+20% NEX from encounters' },
          { name: 'Tech Sector', key: 'tech_sector', bonus: '+15% Eidolon sync gain' },
          { name: 'Memory Banks', key: 'memory_banks', bonus: '+25% experience from combat' },
          { name: 'Data Vaults', key: 'data_vaults', bonus: 'Rare material drop bonus' },
          { name: 'Neo-Avalon Central', key: 'central_plaza', bonus: '+10% daily reward bonuses' }
        ];

        let wardsText = '# 🏛️ Ward Control Status\n\n';

        allWards.forEach(ward => {
          const controller = controlledWards.find(c => c.controlled_ward === ward.key);
          
          if (controller) {
            wardsText += `🔥 **${ward.name}**\n`;
            wardsText += `   Controlled by: **${controller.name}** (Level ${controller.level})\n`;
            wardsText += `   Resources: ${controller.resources.toLocaleString()}\n`;
            wardsText += `   Bonus: *${ward.bonus}*\n\n`;
          } else {
            wardsText += `⚪ **${ward.name}**\n`;
            wardsText += `   Status: **UNCLAIMED**\n`;
            wardsText += `   Bonus: *${ward.bonus}*\n\n`;
          }
        });

        wardsText += '*Ward control is contested through PvE leaderboard performance and resource investment. Use `/syndicate claim [ward]` to challenge for control!*';

        await interaction.reply({
          components: [
            {
              type: 10,
              content: wardsText
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });

      } else if (subcommand === 'claim') {
        const wardKey = interaction.options.getString('ward', true);
        
        // Check if user is in a syndicate
        const membership = await pool.query(
          'SELECT sm.syndicate_id, s.name, s.resources, s.level FROM syndicate_members sm JOIN syndicates s ON sm.syndicate_id = s.id WHERE sm.user_id = $1',
          [userId]
        );

        if (membership.rows.length === 0) {
          await interaction.reply({
            content: '❌ You must be in a Syndicate to claim wards!\n\nUse `/syndicate join [name]` to join one.',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        const userSyndicate = membership.rows[0];

        // Check if ward is already controlled by user's syndicate
        if (userSyndicate.controlled_ward === wardKey) {
          await interaction.reply({
            content: `✅ Your Syndicate **${userSyndicate.name}** already controls this ward!`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Get current controller if any
        const currentController = await pool.query('SELECT name, level, resources FROM syndicates WHERE controlled_ward = $1', [wardKey]);

        const wardNames: Record<string, string> = {
          'digital_district': 'Digital District',
          'tech_sector': 'Tech Sector',
          'memory_banks': 'Memory Banks',
          'data_vaults': 'Data Vaults',
          'central_plaza': 'Neo-Avalon Central'
        };

        const wardName = wardNames[wardKey];
        const resourceCost = 1000;

        if (userSyndicate.resources < resourceCost) {
          await interaction.reply({
            content: `❌ Insufficient resources to claim **${wardName}**!\n\nRequired: ${resourceCost.toLocaleString()} resources\nYour Syndicate has: ${userSyndicate.resources.toLocaleString()}\n\n*Earn resources through successful encounters and Syndicate activities.*`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        if (currentController.rows.length > 0) {
          const controller = currentController.rows[0];
          // Contested claim - need to outperform current controller
          const challengeThreshold = controller.level * 500 + controller.resources;
          const challengerStrength = userSyndicate.level * 500 + userSyndicate.resources;

          if (challengerStrength <= challengeThreshold) {
            await interaction.reply({
              content: `⚔️ **Challenge Failed!**\n\n**${wardName}** is defended by **${controller.name}**.\n\nTheir strength: ${challengeThreshold.toLocaleString()}\nYour strength: ${challengerStrength.toLocaleString()}\n\n*Build up your Syndicate's level and resources before challenging again!*`,
              flags: MessageFlags.Ephemeral
            });
            return;
          }
        }

        // Claim the ward
        await pool.query('BEGIN');

        try {
          // Remove ward from current controller
          if (currentController.rows.length > 0) {
            await pool.query('UPDATE syndicates SET controlled_ward = NULL WHERE controlled_ward = $1', [wardKey]);
          }

          // Assign ward to challenger
          await pool.query('UPDATE syndicates SET controlled_ward = $1, resources = resources - $2 WHERE id = $3', 
            [wardKey, resourceCost, userSyndicate.syndicate_id]);

          await pool.query('COMMIT');

          const battleText = currentController.rows.length > 0 
            ? `⚔️ **Ward Conquered!**\n\n**${userSyndicate.name}** has seized control of **${wardName}** from **${currentController.rows[0].name}**!`
            : `🏛️ **Ward Claimed!**\n\n**${userSyndicate.name}** has claimed the unclaimed **${wardName}**!`;

          await interaction.reply({
            components: [
              {
                type: 10,
                content: `${battleText}\n\n**Resources Spent:** ${resourceCost.toLocaleString()}\n\nYour Syndicate now enjoys the ward bonuses and prestige of controlling this district of Neo-Avalon!`
              }
            ],
            flags: MessageFlags.IsComponentsV2
          });

        } catch (error) {
          await pool.query('ROLLBACK');
          throw error;
        }
      }

    } catch (error) {
      console.error('Error in syndicate command:', error);
      await interaction.reply({
        content: '❌ An error occurred with the Syndicate system. Please try again.',
        flags: MessageFlags.Ephemeral
      });
    }
  },

  async createSyndicateTables() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS syndicates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        leader_id BIGINT REFERENCES users(id),
        level INTEGER DEFAULT 1,
        resources INTEGER DEFAULT 0,
        controlled_ward VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS syndicate_members (
        id SERIAL PRIMARY KEY,
        syndicate_id INTEGER REFERENCES syndicates(id) ON DELETE CASCADE,
        user_id BIGINT REFERENCES users(id),
        rank VARCHAR(50) DEFAULT 'Member',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        contribution_points INTEGER DEFAULT 0,
        UNIQUE(syndicate_id, user_id)
      );
    `);
  }
};