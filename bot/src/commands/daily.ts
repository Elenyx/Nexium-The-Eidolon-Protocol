import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { UserService } from '../services/userService.js';
import { ComponentBuilder } from '../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily rewards and bonuses'),

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

      // Check if user has already claimed today
      const now = new Date();
      const today = now.toDateString();
      const lastDaily = user.last_active ? user.last_active.toDateString() : null;

      if (lastDaily === today) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const timeLeft = Math.ceil((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60));

        await interaction.reply({
          content: `⏰ You've already claimed your daily rewards today!\n\nCome back in **${timeLeft} hours** for your next daily bonus.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      // Calculate daily rewards based on level
      const baseNEX = 100;
      const baseCRD = 50;
      const levelBonus = user.level * 10;
      
      const totalNEX = baseNEX + levelBonus;
      const totalCRD = baseCRD + Math.floor(levelBonus / 2);

      // Check for streak bonuses (simplified version)
      const streakBonus = Math.random() < 0.1; // 10% chance for bonus
      const bonusMultiplier = streakBonus ? 1.5 : 1;

      const finalNEX = Math.floor(totalNEX * bonusMultiplier);
      const finalCRD = Math.floor(totalCRD * bonusMultiplier);

      // Award the rewards
      await UserService.addCurrency(userId, finalNEX, finalCRD);

      // Create response with action buttons
      const linkButtons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setLabel('Discord TOS')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/terms'),
          new ButtonBuilder()
            .setLabel('Privacy Policy')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/privacy'),
          new ButtonBuilder()
            .setLabel('Nexium RPG')
            .setStyle(ButtonStyle.Link)
            .setURL('https://nexium-rpg.win')
        );

      const components = [
        {
          type: 10, // TextDisplay
          content: `# 🎁 Daily Rewards Claimed!\n\n**Rewards Earned:**\n💰 **${finalNEX}** NEX\n💳 **${finalCRD}** CRD\n\n${streakBonus ? '✨ **STREAK BONUS!** Your dedication has been rewarded with 50% extra!\n\n' : ''}*Come back tomorrow for more rewards! Higher level = better dailies!*`
        }
      ];

      await interaction.reply({
        components: [
          ...components,
          {
            type: 10,
            content: `\n[Visit Discord TOS](https://discord.com/terms) | [Privacy Policy](https://discord.com/privacy) | [Nexium RPG](https://nexium-rpg.win)`
          }
        ],
        flags: MessageFlags.IsComponentsV2
      });

    } catch (error) {
      console.error('Error in daily command:', error);
      await interaction.reply({
        content: '❌ An error occurred while claiming daily rewards. Please try again.',
        flags: MessageFlags.Ephemeral
      });
    }
  }
};