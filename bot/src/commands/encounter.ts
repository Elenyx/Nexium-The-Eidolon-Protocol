import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { UserService } from '../services/userService.js';
import { CombatService } from '../services/combatService.js';
import { ComponentBuilder } from '../utils/embeds.js';

// Store active encounters per user
const activeEncounters = new Map<string, number>();

export default {
  data: new SlashCommandBuilder()
    .setName('encounter')
    .setDescription('Start a random encounter in Neo-Avalon'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const userId = interaction.user.id;

    try {
      // Check if user exists
      const user = await UserService.getUser(userId);
      if (!user) {
        await interaction.editReply({
          content: '❌ You need a profile first! Use `/profile create` to start your journey.'
        });
        return;
      }

      // Get a random encounter based on user level
      const encounter = await CombatService.getRandomEncounter(user.level + 2);
      activeEncounters.set(userId, encounter.id);

      const components = ComponentBuilder.createEncounterComponents(encounter);

      await interaction.editReply({
        components: [
          {
            type: 10, // TextDisplay
            content: `${interaction.user.displayName} encounters a wild anomaly!`
          },
          ...components
        ],
        flags: MessageFlags.IsComponentsV2
      });

    } catch (error) {
      console.error('Error in encounter command:', error);
      await interaction.editReply({
        content: '❌ An error occurred while generating an encounter. Please try again.'
      });
    }
  }
};

export { activeEncounters };

