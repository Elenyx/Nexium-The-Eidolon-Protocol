import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { UserService } from '../services/userService.js';
import { CombatService } from '../services/combatService.js';
import { activeEncounters } from './encounter.js';

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

      // Get the weakness hint
      const hint = await CombatService.scanEnemy(userId, encounterId);

      // Send hint via DM
      try {
        await interaction.user.send({
          components: [
            {
              type: 10, // TextDisplay
              content: `🔍 **Enemy Analysis Complete**\n\n**Weakness Detected:**\n*${hint}*\n\nReturn to the server and use \`/weave [pattern]\` to exploit this weakness!`
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });

        await interaction.reply({
          content: '🔍 **Scan complete!** Check your DMs for the weakness analysis.',
          flags: MessageFlags.Ephemeral
        });

      } catch (error) {
        // If DM fails, send in channel as ephemeral
        await interaction.reply({
          components: [
            {
              type: 10, // TextDisplay
              content: `🔍 **Enemy Analysis Complete**\n\n**Weakness Detected:**\n*${hint}*\n\nUse \`/weave [pattern]\` to exploit this weakness!`
            }
          ],
          flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
        });
      }

    } catch (error) {
      console.error('Error in scan command:', error);
      await interaction.reply({
        content: '❌ An error occurred while scanning. Please try again.',
        flags: MessageFlags.Ephemeral
      });
    }
  }
};

