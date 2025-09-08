import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { UserService } from '../services/userService.js';
import { EidolonService } from '../services/eidolonService.js';
import { ComponentBuilder } from '../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('attune')
    .setDescription('Use a Tuner to attune with a random Eidolon'),

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

      // For demo purposes, give everyone a free attunement every 10 minutes
      // In full version, this would check for Tuner items in inventory
      const now = Date.now();
      const lastAttune = user.last_active ? user.last_active.getTime() : 0;
      const cooldown = 10 * 60 * 1000; // 10 minutes

      if (now - lastAttune < cooldown && user.sync_points > 0) {
        const remaining = Math.ceil((cooldown - (now - lastAttune)) / 60000);
        await interaction.reply({
          content: `⏰ You must wait **${remaining} minutes** before attuning again, or complete more encounters to earn Tuners!`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      // Get random Eidolon
      const eidolon = await EidolonService.getRandomEidolon();
      
      // Attune the Eidolon to the user
      const userEidolon = await EidolonService.attuneEidolon(userId, eidolon.id);
      
      // Update user's last active time
      await UserService.updateUser(userId, { last_active: new Date() });

      const components = ComponentBuilder.createEidolonComponents(eidolon, userEidolon);

      await interaction.reply({
        components: [
          {
            type: 10, // TextDisplay
            content: `✨ **Attunement Successful!** ✨\n${interaction.user.displayName} has formed a bond with a new Eidolon!`
          },
          ...components,
          {
            type: 10, // TextDisplay
            content: '*Use `/eidolon interact` to strengthen your bond and unlock more of their story!*'
          }
        ],
        flags: MessageFlags.IsComponentsV2
      });

    } catch (error) {
      console.error('Error in attune command:', error);
      await interaction.reply({
        content: '❌ An error occurred during attunement. Please try again.',
        flags: MessageFlags.Ephemeral
      });
    }
  }
};

