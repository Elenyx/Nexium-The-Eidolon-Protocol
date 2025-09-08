import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { UserService } from '../services/userService.js';
import { EidolonService } from '../services/eidolonService.js';
import { ComponentBuilder } from '../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('eidolon')
    .setDescription('Manage your Eidolon collection')
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('View your collected Eidolons')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View details of a specific Eidolon')
        .addIntegerOption(option =>
          option
            .setName('id')
            .setDescription('The ID of your Eidolon to view')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('interact')
        .setDescription('Interact with an Eidolon to increase sync ratio')
        .addIntegerOption(option =>
          option
            .setName('id')
            .setDescription('The ID of your Eidolon to interact with')
            .setRequired(true)
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

      if (subcommand === 'list') {
        const userEidolons = await EidolonService.getUserEidolons(userId);
        
        if (userEidolons.length === 0) {
          await interaction.reply({
            content: '📭 You haven\'t attuned with any Eidolons yet! Use `/attune` to collect your first one.',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Create a summary list
        const eidolonList = userEidolons.map((ue, index) => 
          `**${index + 1}.** ${ue.eidolon?.name} (${ue.eidolon?.rarity}) - Level ${ue.level} | Sync ${ue.sync_ratio.toFixed(1)}%`
        ).join('\n');

        await interaction.reply({
          components: [
            {
              type: 10, // TextDisplay
              content: `# ${interaction.user.displayName}'s Eidolon Collection\n\n${eidolonList}\n\n*Use \`/eidolon view [id]\` to see details of a specific Eidolon!*`
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });

      } else if (subcommand === 'view') {
        const eidolonId = interaction.options.getInteger('id', true);
        const userEidolons = await EidolonService.getUserEidolons(userId);
        
        if (eidolonId < 1 || eidolonId > userEidolons.length) {
          await interaction.reply({
            content: '❌ Invalid Eidolon ID. Use `/eidolon list` to see your collection.',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        const userEidolon = userEidolons[eidolonId - 1];
        const components = ComponentBuilder.createEidolonComponents(userEidolon.eidolon!, userEidolon);

        await interaction.reply({
          components,
          flags: MessageFlags.IsComponentsV2
        });

      } else if (subcommand === 'interact') {
        const eidolonId = interaction.options.getInteger('id', true);
        const userEidolons = await EidolonService.getUserEidolons(userId);
        
        if (eidolonId < 1 || eidolonId > userEidolons.length) {
          await interaction.reply({
            content: '❌ Invalid Eidolon ID. Use `/eidolon list` to see your collection.',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        const userEidolon = userEidolons[eidolonId - 1];
        const updatedEidolon = await EidolonService.interactWithEidolon(userEidolon.id);
        
        const syncGain = updatedEidolon.sync_ratio - userEidolon.sync_ratio;

        await interaction.reply({
          components: [
            {
              type: 10, // TextDisplay
              content: `💫 **Interaction Complete!**\n\nYou spent time with **${userEidolon.eidolon?.name}**\n\n🔗 **Sync Ratio:** ${userEidolon.sync_ratio.toFixed(1)}% → **${updatedEidolon.sync_ratio.toFixed(1)}%** (+${syncGain.toFixed(1)}%)\n\n*As your bond strengthens, more of their story unfolds...*`
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });
      }

    } catch (error) {
      console.error('Error in eidolon command:', error);
      await interaction.reply({
        content: '❌ An error occurred while managing your Eidolons. Please try again.',
        flags: MessageFlags.Ephemeral
      });
    }
  }
};

