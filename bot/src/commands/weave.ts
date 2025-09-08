import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { UserService } from '../services/userService';
import { CombatService } from '../services/combatService';
import { ComponentBuilder } from '../utils/embeds';
import { activeEncounters } from './encounter';

export default {
  data: new SlashCommandBuilder()
    .setName('weave')
    .setDescription('Execute a pattern to exploit enemy weakness')
    .addStringOption(option =>
      option
        .setName('pattern')
        .setDescription('The logical pattern to weave (e.g., "NOT Logic", "Memory AND Clear")')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.user.id;
    const pattern = interaction.options.getString('pattern', true);

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

      // Execute the weave
      const result = await CombatService.weavePattern(userId, encounterId, pattern);
      const encounter = { id: encounterId }; // Simplified for components

      const components = ComponentBuilder.createCombatResultComponents(result, encounter);

      await interaction.reply({
        components: [
          {
            type: 10, // TextDisplay
            content: `${interaction.user.displayName} weaves the pattern: **"${pattern}"**`
          },
          ...components
        ],
        flags: MessageFlags.IsComponentsV2
      });

      // If successful, clear the encounter
      if (result.success) {
        activeEncounters.delete(userId);
      }

    } catch (error) {
      console.error('Error in weave command:', error);
      await interaction.reply({
        content: '❌ An error occurred while weaving the pattern. Please try again.',
        flags: MessageFlags.Ephemeral
      });
    }
  }
};
