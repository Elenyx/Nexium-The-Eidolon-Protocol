import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { UserService } from '../services/userService.js';
import pool from '../database/connection.js';

// Global storm state
let currentStorm: any = null;
const stormContributions = new Map<string, number>();

export default {
  data: new SlashCommandBuilder()
    .setName('storm')
    .setDescription('Participate in Nexium Storm events')
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Check current storm status and your contribution')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('calm')
        .setDescription('Contribute resources to calm the storm')
        .addStringOption(option =>
          option
            .setName('action')
            .setDescription('Choose your approach to calming the storm')
            .addChoices(
              { name: 'Stabilize Energy Grid', value: 'stabilize' },
              { name: 'Purge Data Corruption', value: 'purge' },
              { name: 'Reinforce Reality Matrix', value: 'reinforce' },
              { name: 'Harmonize Frequencies', value: 'harmonize' }
            )
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('trigger')
        .setDescription('[ADMIN] Manually trigger a Nexium Storm for testing')
        .addStringOption(option =>
          option
            .setName('type')
            .setDescription('Type of storm to trigger')
            .addChoices(
              { name: 'Data Cascade', value: 'data_cascade' },
              { name: 'Memory Overflow', value: 'memory_overflow' },
              { name: 'Reality Fracture', value: 'reality_fracture' },
              { name: 'Spectral Surge', value: 'spectral_surge' }
            )
            .setRequired(false)
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

      // Create world_events table if not exists
      await this.createWorldEventsTable();

      if (subcommand === 'status') {
        if (!currentStorm) {
          // Check database for active storms
          const activeStorm = await pool.query('SELECT * FROM world_events WHERE active = true ORDER BY start_time DESC LIMIT 1');
          if (activeStorm.rows.length > 0) {
            currentStorm = activeStorm.rows[0];
          }
        }

        if (!currentStorm) {
          await interaction.reply({
            components: [
              {
                type: 10,
                content: `# ☀️ Neo-Avalon Status: STABLE\n\n**Current Conditions:** All systems nominal\n**Storm Activity:** None detected\n**Reality Stability:** 100%\n\n*The city rests peacefully, but Nexium Storms can emerge at any moment. Stay vigilant, Weaver.*\n\n*Nexium Storms are server-wide events that require cooperation from all Weavers to resolve. When one occurs, use \`/storm calm\` to contribute!*`
              }
            ],
            flags: MessageFlags.IsComponentsV2
          });
          return;
        }

        const userContribution = stormContributions.get(userId) || 0;
        const totalContributions = Array.from(stormContributions.values()).reduce((sum, val) => sum + val, 0);
        const stormProgress = Math.min(100, (totalContributions / 1000) * 100); // 1000 total needed

        const stormEmojis: Record<string, string> = {
          'data_cascade': '⚡',
          'memory_overflow': '💾',
          'reality_fracture': '🌀',
          'spectral_surge': '👻'
        };

        const stormNames: Record<string, string> = {
          'data_cascade': 'Data Cascade Storm',
          'memory_overflow': 'Memory Overflow Event',
          'reality_fracture': 'Reality Fracture Crisis',
          'spectral_surge': 'Spectral Surge Phenomenon'
        };

        const stormEmoji = stormEmojis[currentStorm.type] || '🌩️';
        const stormName = stormNames[currentStorm.type] || currentStorm.name;

        await interaction.reply({
          components: [
            {
              type: 10,
              content: `# ${stormEmoji} NEXIUM STORM ACTIVE\n\n**Event:** ${stormName}\n**Duration:** ${Math.floor((Date.now() - new Date(currentStorm.start_time).getTime()) / (1000 * 60))} minutes\n**Resolution Progress:** ${stormProgress.toFixed(1)}%\n\n**Your Contribution:** ${userContribution} stability points\n**Total Server Effort:** ${totalContributions}/1000\n\n${currentStorm.description}\n\n*The storm rages across Neo-Avalon! Use \`/storm calm [action]\` to help restore stability. Every Weaver's contribution matters!*`
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });

      } else if (subcommand === 'calm') {
        if (!currentStorm) {
          await interaction.reply({
            content: '☀️ There are no active Nexium Storms to calm right now!\n\nThe city is stable, but stay ready for future events.',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        const action = interaction.options.getString('action', true);
        
        // Check cooldown (5 minutes per user)
        const lastContribution = stormContributions.get(`${userId}_time`) || 0;
        const cooldown = 5 * 60 * 1000; // 5 minutes

        if (Date.now() - lastContribution < cooldown) {
          const remaining = Math.ceil((cooldown - (Date.now() - lastContribution)) / 60000);
          await interaction.reply({
            content: `⏰ You must wait **${remaining} minutes** before contributing again.\n\n*Use this time to strategize your next approach!*`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Calculate contribution effectiveness
        const baseContribution = 10;
        const levelBonus = Math.floor(user.level / 2);
        const actionBonus = this.getActionEffectiveness(action, currentStorm.type);
        
        const totalContribution = baseContribution + levelBonus + actionBonus;
        
        // Update contributions
        const currentContrib = stormContributions.get(userId) || 0;
        stormContributions.set(userId, currentContrib + totalContribution);
        stormContributions.set(`${userId}_time`, Date.now());

        // Calculate rewards
        const nexiumReward = totalContribution * 5;
        const experienceReward = totalContribution * 3;

        // Give rewards
        await UserService.addCurrency(userId, nexiumReward, 0);
        await pool.query('UPDATE users SET experience = experience + $1 WHERE id = $2', [experienceReward, userId]);

        // Check if storm should end
        const totalContributions = Array.from(stormContributions.values())
          .filter((_, index) => !Array.from(stormContributions.keys())[index].includes('_time'))
          .reduce((sum, val) => sum + val, 0);

        let responseText = `# ⚡ Storm Calming Action\n\n**${interaction.user.displayName}** uses: **${this.getActionName(action)}**\n\n**Effectiveness:** ${totalContribution} stability points\n**Rewards:** ${nexiumReward} NEX, ${experienceReward} XP\n\n`;

        if (totalContributions >= 1000) {
          // End the storm
          currentStorm = null;
          stormContributions.clear();
          await pool.query('UPDATE world_events SET active = false, end_time = NOW() WHERE active = true');

          responseText += `🌟 **STORM SUCCESSFULLY CALMED!** 🌟\n\nThe combined efforts of all Weavers have restored stability to Neo-Avalon!\n\n*Server-wide bonus: +20% rewards for 1 hour!*`;
        } else {
          const remaining = 1000 - totalContributions;
          const progress = (totalContributions / 1000 * 100).toFixed(1);
          
          responseText += `**Server Progress:** ${progress}%\n**Remaining:** ${remaining} stability points needed\n\n*The storm continues to rage. Keep contributing to save Neo-Avalon!*`;
        }

        await interaction.reply({
          components: [
            {
              type: 10,
              content: responseText
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });

      } else if (subcommand === 'trigger') {
        // Admin command to trigger storms (in real implementation, you'd check permissions)
        const stormType = interaction.options.getString('type') || 'data_cascade';
        
        if (currentStorm) {
          await interaction.reply({
            content: '⚠️ A storm is already active! Wait for it to end before triggering another.',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        const stormData = this.getStormData(stormType);
        
        // Create storm in database
        const stormResult = await pool.query(
          'INSERT INTO world_events (name, type, description, active, start_time, effects) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [stormData.name, stormType, stormData.description, true, new Date(), JSON.stringify(stormData.effects)]
        );

        currentStorm = stormResult.rows[0];
        stormContributions.clear();

        // Auto-end storm after 2 hours if not resolved
        setTimeout(() => {
          if (currentStorm && currentStorm.id === stormResult.rows[0].id) {
            currentStorm = null;
            stormContributions.clear();
            pool.query('UPDATE world_events SET active = false, end_time = NOW() WHERE id = $1', [stormResult.rows[0].id]);
          }
        }, 2 * 60 * 60 * 1000);

        await interaction.reply({
          content: `🌩️ **NEXIUM STORM TRIGGERED**\n\n**${stormData.name}** is now ravaging Neo-Avalon!\n\nAll Weavers must work together to calm the storm using \`/storm calm\`!`,
        });
      }

    } catch (error) {
      console.error('Error in storm command:', error);
      await interaction.reply({
        content: '❌ An error occurred with the Nexium Storm system. Please try again.',
        flags: MessageFlags.Ephemeral
      });
    }
  },

  getActionEffectiveness(action: string, stormType: string): number {
    const effectiveness: Record<string, Record<string, number>> = {
      'data_cascade': {
        'stabilize': 15,
        'purge': 10,
        'reinforce': 5,
        'harmonize': 3
      },
      'memory_overflow': {
        'purge': 15,
        'stabilize': 8,
        'reinforce': 10,
        'harmonize': 5
      },
      'reality_fracture': {
        'reinforce': 15,
        'harmonize': 10,
        'stabilize': 8,
        'purge': 3
      },
      'spectral_surge': {
        'harmonize': 15,
        'stabilize': 5,
        'purge': 8,
        'reinforce': 10
      }
    };

    return effectiveness[stormType]?.[action] || 5;
  },

  getActionName(action: string): string {
    const names: Record<string, string> = {
      'stabilize': 'Stabilize Energy Grid',
      'purge': 'Purge Data Corruption',
      'reinforce': 'Reinforce Reality Matrix',
      'harmonize': 'Harmonize Frequencies'
    };
    return names[action] || action;
  },

  getStormData(type: string): any {
    const stormTypes: Record<string, any> = {
      'data_cascade': {
        name: 'Data Cascade Storm',
        description: 'A massive overflow of corrupted data streams threatens to crash Neo-Avalon\'s core systems. Reality glitches flicker throughout the city.',
        effects: { encounter_difficulty: 1.5, nex_bonus: 0.8 }
      },
      'memory_overflow': {
        name: 'Memory Overflow Event',
        description: 'The city\'s memory banks are overflowing with spectral impressions. Eidolons become agitated and unpredictable.',
        effects: { sync_gain_penalty: 0.5, eidolon_encounter_rate: 2.0 }
      },
      'reality_fracture': {
        name: 'Reality Fracture Crisis',
        description: 'Cracks in the fabric of reality spread across Neo-Avalon. Space-time becomes unstable, causing dimensional anomalies.',
        effects: { dungeon_difficulty: 2.0, rare_drop_bonus: 1.5 }
      },
      'spectral_surge': {
        name: 'Spectral Surge Phenomenon',
        description: 'A massive wave of spectral energy washes over the city. Eidolons throughout Neo-Avalon respond to the supernatural call.',
        effects: { eidolon_power_boost: 1.3, encounter_frequency: 1.5 }
      }
    };

    return stormTypes[type] || stormTypes['data_cascade'];
  },

  async createWorldEventsTable() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS world_events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) DEFAULT 'storm',
        description TEXT,
        active BOOLEAN DEFAULT FALSE,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        effects JSONB,
        participation_rewards JSONB
      );
    `);
  }
};

export { currentStorm, stormContributions };

