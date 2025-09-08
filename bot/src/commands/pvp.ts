import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { UserService } from '../services/userService.js';
import { EidolonService } from '../services/eidolonService.js';

// Store active PvP challenges
const pvpChallenges = new Map<string, { challengerId: string; targetId: string; status: string; timestamp: number }>();
const activeDuels = new Map<string, any>();

export default {
  data: new SlashCommandBuilder()
    .setName('pvp')
    .setDescription('Challenge other Weavers in PvP combat')
    .addSubcommand(subcommand =>
      subcommand
        .setName('challenge')
        .setDescription('Challenge another player to a duel')
        .addUserOption(option =>
          option
            .setName('opponent')
            .setDescription('The player you want to challenge')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('accept')
        .setDescription('Accept a pending duel challenge')
        .addUserOption(option =>
          option
            .setName('challenger')
            .setDescription('The player who challenged you')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('decline')
        .setDescription('Decline a pending duel challenge')
        .addUserOption(option =>
          option
            .setName('challenger')
            .setDescription('The player who challenged you')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Check your current PvP status and challenges')
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

      if (subcommand === 'challenge') {
        const opponent = interaction.options.getUser('opponent', true);
        
        if (opponent.id === userId) {
          await interaction.reply({
            content: '❌ You cannot challenge yourself to a duel!',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        if (opponent.bot) {
          await interaction.reply({
            content: '❌ You cannot challenge bots to PvP duels!',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Check if opponent has a profile
        const opponentUser = await UserService.getUser(opponent.id);
        if (!opponentUser) {
          await interaction.reply({
            content: `❌ ${opponent.displayName} doesn't have a Nexium RPG profile yet!\n\nThey need to use \`/profile create\` first.`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Check for existing challenges
        const existingChallenge = Array.from(pvpChallenges.values()).find(
          c => (c.challengerId === userId && c.targetId === opponent.id) ||
               (c.challengerId === opponent.id && c.targetId === userId)
        );

        if (existingChallenge) {
          await interaction.reply({
            content: '⚔️ There\'s already an active challenge between you and this player!',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Create challenge
        const challengeId = `${userId}-${opponent.id}-${Date.now()}`;
        pvpChallenges.set(challengeId, {
          challengerId: userId,
          targetId: opponent.id,
          status: 'pending',
          timestamp: Date.now()
        });

        // Clean up old challenges (5 minutes)
        setTimeout(() => {
          if (pvpChallenges.has(challengeId)) {
            pvpChallenges.delete(challengeId);
          }
        }, 5 * 60 * 1000);

        const actionButtons = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`pvp_accept_${userId}`)
              .setLabel('⚔️ Accept Duel')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(`pvp_decline_${userId}`)
              .setLabel('🛡️ Decline')
              .setStyle(ButtonStyle.Danger)
          );

        await interaction.reply({
          content: `⚔️ **PvP Challenge Issued!**\n\n${interaction.user.displayName} has challenged ${opponent.displayName} to a Weaver's Duel!\n\n**Stakes:**\n• Winner gains 100 NEX and 2 Sync Points\n• Loser pays 50 NEX\n• Both gain combat experience\n\n*Challenge expires in 5 minutes.*`,
          components: [actionButtons]
        });

      } else if (subcommand === 'accept') {
        const challenger = interaction.options.getUser('challenger', true);
        
        const challenge = Array.from(pvpChallenges.entries()).find(
          ([_, c]) => c.challengerId === challenger.id && c.targetId === userId && c.status === 'pending'
        );

        if (!challenge) {
          await interaction.reply({
            content: `❌ No pending challenge found from ${challenger.displayName}.`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Accept the challenge and start duel
        const [challengeId, challengeData] = challenge;
        pvpChallenges.delete(challengeId);

        // Get both players' Eidolons
        const challengerEidolons = await EidolonService.getUserEidolons(challenger.id);
        const targetEidolons = await EidolonService.getUserEidolons(userId);

        if (challengerEidolons.length === 0 || targetEidolons.length === 0) {
          await interaction.reply({
            content: '❌ Both players need at least one Eidolon to participate in PvP duels!',
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Start the duel
        const duelId = `duel_${challenger.id}_${userId}_${Date.now()}`;
        activeDuels.set(duelId, {
          challenger: { id: challenger.id, hp: 100, eidolons: challengerEidolons },
          target: { id: userId, hp: 100, eidolons: targetEidolons },
          turn: challenger.id,
          round: 1
        });

        const duelButtons = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`duel_attack_${duelId}`)
              .setLabel('⚡ Attack')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId(`duel_defend_${duelId}`)
              .setLabel('🛡️ Defend')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(`duel_skill_${duelId}`)
              .setLabel('✨ Use Skill')
              .setStyle(ButtonStyle.Success)
          );

        await interaction.reply({
          components: [
            {
              type: 10,
              content: `# ⚔️ Weaver's Duel Begins!\n\n${challenger.displayName} **VS** ${interaction.user.displayName}\n\n**Round 1**\n${challenger.displayName}: 100 HP\n${interaction.user.displayName}: 100 HP\n\n**${challenger.displayName}'s Turn**\n\n*The duel mechanics are being implemented. Stay tuned for full PvP combat!*`
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });

      } else if (subcommand === 'decline') {
        const challenger = interaction.options.getUser('challenger', true);
        
        const challengeEntry = Array.from(pvpChallenges.entries()).find(
          ([_, c]) => c.challengerId === challenger.id && c.targetId === userId && c.status === 'pending'
        );

        if (!challengeEntry) {
          await interaction.reply({
            content: `❌ No pending challenge found from ${challenger.displayName}.`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        // Remove the challenge
        pvpChallenges.delete(challengeEntry[0]);

        await interaction.reply({
          content: `🛡️ ${interaction.user.displayName} has declined the duel challenge from ${challenger.displayName}.\n\n*The challenge has been cancelled.*`
        });

      } else if (subcommand === 'status') {
        const pendingChallenges = Array.from(pvpChallenges.values()).filter(
          c => c.challengerId === userId || c.targetId === userId
        );

        const activeDuel = Array.from(activeDuels.values()).find(
          d => d.challenger.id === userId || d.target.id === userId
        );

        let statusText = `# ⚔️ ${interaction.user.displayName}'s PvP Status\n\n`;

        if (activeDuel) {
          statusText += '🔥 **Active Duel In Progress**\n';
          statusText += `${activeDuel.challenger.id === userId ? 'You' : 'Opponent'}: ${activeDuel.challenger.hp} HP\n`;
          statusText += `${activeDuel.target.id === userId ? 'You' : 'Opponent'}: ${activeDuel.target.hp} HP\n\n`;
        }

        if (pendingChallenges.length > 0) {
          statusText += '📋 **Pending Challenges:**\n';
          pendingChallenges.forEach(challenge => {
            if (challenge.challengerId === userId) {
              statusText += `• You challenged <@${challenge.targetId}>\n`;
            } else {
              statusText += `• <@${challenge.challengerId}> challenged you\n`;
            }
          });
          statusText += '\n';
        }

        if (!activeDuel && pendingChallenges.length === 0) {
          statusText += '📊 **No active PvP activity**\n\n*Use `/pvp challenge @user` to start a duel!*';
        }

        await interaction.reply({
          components: [
            {
              type: 10,
              content: statusText
            }
          ],
          flags: MessageFlags.IsComponentsV2
        });
      }

    } catch (error) {
      console.error('Error in PvP command:', error);
      await interaction.reply({
        content: '❌ An error occurred in the PvP system. Please try again.',
        flags: MessageFlags.Ephemeral
      });
    }
  }
};

export { pvpChallenges, activeDuels };