import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { UserService } from '../services/userService.js';
import { CombatService } from '../services/combatService.js';
import { activeEncounters } from './encounter.js';
import { ComponentBuilder } from '../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('scan')
    .setDescription('Analyze an enemy\'s weakness (sends hint via DM)'),

  async execute(interaction: ChatInputCommandInteraction) {
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

      // Check if user has an active encounter
      const encounterId = activeEncounters.get(userId);
      if (!encounterId) {
        await interaction.reply({
          content: '❌ You don\'t have an active encounter! Use `/encounter` to start one.',
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      // Fetch the full encounter so we can render structured components
  const encounter = await CombatService.fetchEncounterById(encounterId);

      // Log the scan action (will insert into combat_logs)
      await CombatService.scanEnemy(userId, encounterId);

      // Build structured components (Container/TextDisplay) with normalized hint
      const components = ComponentBuilder.createEncounterComponents(encounter, true);

      await interaction.reply({
        components,
        flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
      });

    } catch (error) {
      console.error('Error in scan command:', error);
      await interaction.reply({
        content: '❌ An error occurred while scanning. Please try again.',
        flags: MessageFlags.Ephemeral
      });
    }
  }
};

