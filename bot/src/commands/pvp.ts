import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { UserService } from '../services/userService.js';
import { EidolonService } from '../services/eidolonService.js';
import { BattleService } from '../services/battleService.js';
import { PlayerStatsService } from '../services/playerStatsService.js';

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
          challenger: { id: challenger.id, name: challenger.displayName, hp: 100, eidolons: challengerEidolons },
          target: { id: userId, name: interaction.user.displayName, hp: 100, eidolons: targetEidolons },
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
              content: `# ⚔️ Weaver's Duel Begins!\n\n${challenger.displayName} **VS** ${interaction.user.displayName}\n\n**Round 1**\n${challenger.displayName}: 100 HP\n${interaction.user.displayName}: 100 HP\n\n**${challenger.displayName}'s Turn**`
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

// Handle duel button interactions
export async function handleDuelAction(interaction: any, customId: string): Promise<void> {
  const parts = customId.split('_');
  const action = parts[1]; // attack, defend, skill
  const duelId = `duel_${parts[2]}_${parts[3]}_${parts[4]}`; // duel_challenger_target_timestamp

  const duel = activeDuels.get(duelId);
  if (!duel) {
    await interaction.reply({
      content: '❌ This duel has expired or no longer exists.',
      ephemeral: true
    });
    return;
  }

  // Check if it's the player's turn
  if (duel.turn !== interaction.user.id) {
    await interaction.reply({
      content: '❌ It\'s not your turn!',
      ephemeral: true
    });
    return;
  }

  // Process the action
  const result = await processDuelAction(duel, action, interaction.user.id);

  // Check if duel is over
  if (result.duelEnded) {
    activeDuels.delete(duelId);
    await handleDuelEnd(interaction, duel, result);
  } else {
    // Continue duel
    duel.round++;
    duel.turn = duel.turn === duel.challenger.id ? duel.target.id : duel.challenger.id;

    const nextPlayerName = duel.turn === duel.challenger.id ? duel.challenger.name : duel.target.name;

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

    await interaction.update({
      content: `# ⚔️ Weaver's Duel - Round ${duel.round}\n\n${duel.challenger.name}: ${duel.challenger.hp} HP\n${duel.target.name}: ${duel.target.hp} HP\n\n${result.message}\n\n**${nextPlayerName}'s Turn**`,
      components: [duelButtons]
    });
  }
}

async function processDuelAction(duel: any, action: string, playerId: string): Promise<{ message: string; duelEnded: boolean }> {
  const isChallenger = playerId === duel.challenger.id;
  const attacker = isChallenger ? duel.challenger : duel.target;
  const defender = isChallenger ? duel.target : duel.challenger;

  let damage = 0;
  let message = '';

  switch (action) {
    case 'attack':
      damage = Math.floor(Math.random() * 20) + 10; // 10-30 damage
      defender.hp -= damage;
      message = `⚡ ${attacker.name} attacks for **${damage} damage!**`;
      break;

    case 'defend':
      damage = Math.floor(Math.random() * 10) + 5; // 5-15 damage (reduced)
      defender.hp -= damage;
      message = `🛡️ ${attacker.name} defends and counterattacks for **${damage} damage!**`;
      break;

    case 'skill':
      // Use the first Eidolon skill
      const eidolon = attacker.eidolons[0];
      if (eidolon) {
        damage = Math.floor(Math.random() * 25) + 15; // 15-40 damage
        defender.hp -= damage;
        message = `✨ ${attacker.name} uses **${eidolon.skill_name}** for **${damage} damage!**`;
      } else {
        damage = Math.floor(Math.random() * 15) + 5;
        defender.hp -= damage;
        message = `⚡ ${attacker.name} uses a basic skill for **${damage} damage!**`;
      }
      break;
  }

  // Ensure HP doesn't go below 0
  defender.hp = Math.max(0, defender.hp);

  const duelEnded = defender.hp <= 0;

  if (duelEnded) {
    message += `\n\n🏆 **${attacker.name} wins the duel!**`;
  }

  return { message, duelEnded };
}

async function handleDuelEnd(interaction: any, duel: any, result: any): Promise<void> {
  const winner = duel.challenger.hp > 0 ? duel.challenger : duel.target;
  const loser = duel.challenger.hp <= 0 ? duel.challenger : duel.target;

  try {
    // Record battle in database
    await BattleService.createBattle({
      winner_id: winner.id,
      loser_id: loser.id,
      battle_type: 'pvp',
      exp_gained: 25,
      gold_gained: 100,
      items_gained: []
    });

    // Update player stats
    await PlayerStatsService.incrementWins(winner.id);
    await PlayerStatsService.incrementLosses(loser.id);

    // Award rewards
    await UserService.addCurrency(winner.id, 100, 0); // 100 NEX
    await UserService.addCurrency(loser.id, -50, 0); // Lose 50 NEX

    // Update experience
    await UserService.updateUser(winner.id, { experience: 25 });
    await UserService.updateUser(loser.id, { experience: 10 });

    const winnerUser = await UserService.getUser(winner.id);
    const loserUser = await UserService.getUser(loser.id);

    await interaction.update({
      content: `# 🏆 Duel Complete!\n\n**Winner:** ${winner.name}\n**Loser:** ${loser.name}\n\n## Rewards\n**${winner.name}:**\n• +100 NEX\n• +25 XP\n• +1 PvP Win\n\n**${loser.name}:**\n• -50 NEX\n• +10 XP\n• +1 PvP Loss\n\n${result.message}`,
      components: []
    });

  } catch (error) {
    console.error('Error recording duel results:', error);
    await interaction.update({
      content: `# 🏆 Duel Complete!\n\n**Winner:** ${winner.name}\n**Loser:** ${loser.name}\n\n${result.message}\n\n*Note: There was an error recording the results.*`,
      components: []
    });
  }
}

