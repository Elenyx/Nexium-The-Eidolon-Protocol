import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, ContainerBuilder } from 'discord.js';
import { UserService } from '../services/userService.js';

export default {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View or create your Nexium RPG profile')
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View your current profile')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create your Nexium RPG profile')
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;
    const username = interaction.user.displayName || interaction.user.username;

    try {
      if (subcommand === 'create') {
        const existingUser = await UserService.getUser(userId);
        if (existingUser) {
          await interaction.editReply({
            content: '⚠️ You already have a profile! Use `/profile view` to see it.'
          });
          return;
        }

        const newUser = await UserService.createUser(userId, username);
        const components = [
          new ContainerBuilder()
            .setAccentColor(4894683)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(`${newUser.title}: ${newUser.username}`),
            )
            .addSeparatorComponents(
              new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
            )
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(`Location: ${newUser.location}\nLevel: ${newUser.level} (${newUser.experience} XP)\nSync Points: ${newUser.sync_points}`),
            ),
          new ContainerBuilder()
            .setAccentColor(14467618)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(`💰 Economy\n${newUser.nexium} NEX | ${newUser.cred} CRD`),
            ),
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
          new ContainerBuilder()
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent("Use `/eidolon list` to see your collected Eidolons!\n🎉 Welcome to Nexium RPG! 🎉\n\nYou are now a Weaver in Neo-Avalon. Your journey into the Eidolon Protocol begins!\n\nUse `/encounter` to start your first combat, or `/attune` to collect your first Eidolon!"),
            ),
        ];

        await interaction.editReply({
          components,
          flags: MessageFlags.IsComponentsV2
        });

      } else if (subcommand === 'view') {
        const user = await UserService.getUser(userId);
        if (!user) {
          await interaction.editReply({
            content: '❌ Profile not found. Use `/profile create` to start your journey!'
          });
          return;
        }

        await UserService.updateUser(userId, { last_active: new Date() });
        const components = [
          new ContainerBuilder()
            .setAccentColor(4894683)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(`${user.title}: ${user.username}`),
            )
            .addSeparatorComponents(
              new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
            )
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(`Location: ${user.location}\nLevel: ${user.level} (${user.experience} XP)\nSync Points: ${user.sync_points}`),
            ),
          new ContainerBuilder()
            .setAccentColor(14467618)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(`💰 Economy\n${user.nexium} NEX | ${user.cred} CRD`),
            ),
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
          new ContainerBuilder()
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent("Use `/eidolon list` to see your collected Eidolons!\n🎉 Welcome to Nexium RPG! 🎉\n\nYou are now a Weaver in Neo-Avalon. Your journey into the Eidolon Protocol begins!\n\nUse `/encounter` to start your first combat, or `/attune` to collect your first Eidolon!"),
            ),
        ];

        await interaction.editReply({
          components,
          flags: MessageFlags.IsComponentsV2
        });
      }

    } catch (error) {
      console.error('Error in profile command:', error);
      await interaction.editReply({
        content: '❌ An error occurred while accessing your profile. Please try again.'
      });
    }
  }
};

