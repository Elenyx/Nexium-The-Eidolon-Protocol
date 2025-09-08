import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { UserService } from '../services/userService';
import pool from '../database/connection';

// Store active dungeon runs
const activeDungeons = new Map<string, { dungeonId: number; stage: number; hp: number; maxHp: number }>();

export default {
  data: new SlashCommandBuilder()
    .setName('dungeon')
    .setDescription('Enter Nexus Vaults for challenging PvE encounters')
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('View available Nexus Vaults')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('enter')
        .setDescription('Enter a Nexus Vault')
        .addIntegerOption(option =>
          option
            .setName('id')
            .setDescription('The ID of the vault to enter')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('progress')
        .setDescription('Check your current dungeon progress')
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

      if (subcommand === 'list') {
        const dungeons = [
          { id: 1, name: 'The Glitched Cathedral', difficulty: 3, minLevel: 1, description: 'A corrupted sacred space where data prayers echo endlessly' },
          { id: 2, name: 'Rust-Scale Bazaar', difficulty: 5, minLevel: 3, description: 'An abandoned marketplace haunted by phantom merchants' },
          { id: 3, name: 'The Fractured Spire', difficulty: 7, minLevel: 5, description: 'A tower that exists in multiple dimensions simultaneously' },
          { id: 4, name: 'Memory Bank Vaults', difficulty: 10, minLevel: 8, description: 'Where the city\'s forgotten memories are stored and protected' }
        ];

        let dungeonList = '# 🏛️ Available Nexus Vaults\n\n';
        dungeons.forEach(dungeon => {
          const accessible = user.level >= dungeon.minLevel;
          const statusEmoji = accessible ? '✅' : '🔒';
          const difficultyStars = '⭐'.repeat(Math.min(dungeon.difficulty, 5));
          
          dungeonList += `${statusEmoji} **${dungeon.name}** ${difficultyStars}\n`;
          dungeonList += `   Level ${dungeon.minLevel}+ | Difficulty ${dungeon.difficulty}\n`;
          dungeonList += `   *${dungeon.description}*\n\n`;
        });

        dungeonList += '*Use `/dungeon enter [id]` to begin your expedition!*';

        await interaction.reply({
          components: [
            {
              type: 10,
              content: dungeonList
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });

      } else if (subcommand === 'enter') {
        const dungeonId = interaction.options.getInteger('id', true);
        
        // Check if user is already in a dungeon
        if (activeDungeons.has(userId)) {
          await interaction.reply({
            content: '⚠️ You\'re already exploring a Nexus Vault! Use `/dungeon progress` to continue or wait for it to reset.',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Validate dungeon ID and level requirements
        const dungeonData = await this.getDungeonData(dungeonId);
        if (!dungeonData) {
          await interaction.reply({
            content: '❌ Invalid Nexus Vault ID. Use `/dungeon list` to see available vaults.',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        if (user.level < dungeonData.minLevel) {
          await interaction.reply({
            content: `❌ You need to be Level ${dungeonData.minLevel} or higher to enter **${dungeonData.name}**.\n\nCurrent Level: ${user.level}`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Initialize dungeon run
        const maxHp = 100 + (dungeonData.difficulty * 50);
        activeDungeons.set(userId, {
          dungeonId,
          stage: 1,
          hp: maxHp,
          maxHp
        });

        const actionButtons = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('dungeon_scan')
              .setLabel('🔍 Scan Environment')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('dungeon_advance')
              .setLabel('⚡ Press Forward')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId('dungeon_retreat')
              .setLabel('🚪 Retreat')
              .setStyle(ButtonStyle.Danger)
          );

        await interaction.reply({
          components: [
            {
              type: 10,
              content: `# ⚔️ Entering ${dungeonData.name}\n\n${interaction.user.displayName} steps into the mysterious vault...\n\n**Stage 1** | HP: ${maxHp}/${maxHp}\n\n*The air crackles with unstable energy. Ancient data fragments float through the corridors.*\n\n*Choose your approach using the buttons or continue with other commands.*`
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });

      } else if (subcommand === 'progress') {
        const dungeonRun = activeDungeons.get(userId);
        if (!dungeonRun) {
          await interaction.reply({
            content: '📍 You\'re not currently in a Nexus Vault.\n\nUse `/dungeon list` to see available expeditions!',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        const dungeonData = await this.getDungeonData(dungeonRun.dungeonId);
        const hpPercentage = (dungeonRun.hp / dungeonRun.maxHp * 100).toFixed(1);
        
        await interaction.reply({
          components: [
            {
              type: 10,
              content: `# 🏛️ Dungeon Progress\n\n**Vault:** ${dungeonData?.name}\n**Stage:** ${dungeonRun.stage}/5\n**Health:** ${dungeonRun.hp}/${dungeonRun.maxHp} (${hpPercentage}%)\n\n*Continue your expedition or retreat to safety.*`
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });
      }

    } catch (error) {
      console.error('Error in dungeon command:', error);
      await interaction.reply({
        content: '❌ An error occurred in the Nexus Vault. Please try again.',
        flags: MessageFlags.Ephemeral
      });
    }
  },

  async getDungeonData(dungeonId: number) {
    const dungeons: Record<number, any> = {
      1: { name: 'The Glitched Cathedral', difficulty: 3, minLevel: 1 },
      2: { name: 'Rust-Scale Bazaar', difficulty: 5, minLevel: 3 },
      3: { name: 'The Fractured Spire', difficulty: 7, minLevel: 5 },
      4: { name: 'Memory Bank Vaults', difficulty: 10, minLevel: 8 }
    };
    
    return dungeons[dungeonId] || null;
  }
};

export { activeDungeons };
