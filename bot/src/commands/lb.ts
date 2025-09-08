import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import pool from '../database/connection.js';

export default {
  data: new SlashCommandBuilder()
    .setName('lb')
    .setDescription('View the leaderboards')
    .addStringOption(option =>
      option
        .setName('type')
        .setDescription('Type of leaderboard to view')
        .addChoices(
          { name: 'Level', value: 'level' },
          { name: 'NEX (Currency)', value: 'nexium' },
          { name: 'CRD (Currency)', value: 'cred' },
          { name: 'Eidolon Count', value: 'eidolons' },
          { name: 'Sync Points', value: 'sync' }
        )
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const leaderboardType = interaction.options.getString('type') || 'level';

    try {
      let query: string;
      let title: string;
      let valuePrefix: string;

      switch (leaderboardType) {
        case 'level':
          query = 'SELECT username, level, experience FROM users ORDER BY level DESC, experience DESC LIMIT 10';
          title = '🏆 Level Leaderboard';
          valuePrefix = 'Level';
          break;
        case 'nexium':
          query = 'SELECT username, nexium FROM users ORDER BY nexium DESC LIMIT 10';
          title = '💰 NEX Leaderboard';
          valuePrefix = '';
          break;
        case 'cred':
          query = 'SELECT username, cred FROM users ORDER BY cred DESC LIMIT 10';
          title = '💳 CRD Leaderboard';
          valuePrefix = '';
          break;
        case 'eidolons':
          query = `
            SELECT u.username, COUNT(ue.id) as eidolon_count
            FROM users u
            LEFT JOIN user_eidolons ue ON u.id = ue.user_id
            GROUP BY u.id, u.username
            ORDER BY eidolon_count DESC, u.username
            LIMIT 10
          `;
          title = '✨ Eidolon Collection Leaderboard';
          valuePrefix = '';
          break;
        case 'sync':
          query = 'SELECT username, sync_points FROM users ORDER BY sync_points DESC LIMIT 10';
          title = '🔗 Sync Points Leaderboard';
          valuePrefix = '';
          break;
        default:
          query = 'SELECT username, level, experience FROM users ORDER BY level DESC, experience DESC LIMIT 10';
          title = '🏆 Level Leaderboard';
          valuePrefix = 'Level';
      }

      const result = await pool.query(query);
      const players = result.rows;

      if (players.length === 0) {
        await interaction.reply({
          content: '📊 No players found on the leaderboard yet!\n\n*Be the first to climb the ranks!*',
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      // Format leaderboard
      const medals = ['🥇', '🥈', '🥉'];
      let leaderboardText = '';

      players.forEach((player, index) => {
        const position = index + 1;
        const medal = index < 3 ? medals[index] : `**${position}.**`;
        
        let value: string;
        switch (leaderboardType) {
          case 'level':
            value = `${valuePrefix} ${player.level} (${player.experience} XP)`;
            break;
          case 'nexium':
            value = `${player.nexium.toLocaleString()} NEX`;
            break;
          case 'cred':
            value = `${player.cred.toLocaleString()} CRD`;
            break;
          case 'eidolons':
            value = `${player.eidolon_count} Eidolons`;
            break;
          case 'sync':
            value = `${player.sync_points} Sync Points`;
            break;
          default:
            value = `${player.level}`;
        }

        leaderboardText += `${medal} **${player.username}** - ${value}\n`;
      });

      // Check user's position if not in top 10
      const userPosition = await this.getUserPosition(interaction.user.id, leaderboardType);
      let userPositionText = '';
      
      if (userPosition && userPosition.position > 10) {
        userPositionText = `\n\n📍 **Your Position:** #${userPosition.position}`;
      }

      const components = [
        {
          type: 10, // TextDisplay
          content: `${title}\n\n${leaderboardText}${userPositionText}\n\n*Rise through the ranks by leveling up, collecting Eidolons, and participating in the Nexium Protocol!*`
        }
      ];

      await interaction.reply({
        components,
        flags: MessageFlags.IsComponentsV2
      });

    } catch (error) {
      console.error('Error in leaderboard command:', error);
      await interaction.reply({
        content: '❌ An error occurred while loading the leaderboard. Please try again.',
        flags: MessageFlags.Ephemeral
      });
    }
  },

  async getUserPosition(userId: string, type: string): Promise<{ position: number; value: any } | null> {
    try {
      let query: string;
      let countQuery: string;

      switch (type) {
        case 'level':
          query = 'SELECT level, experience FROM users WHERE id = $1';
          countQuery = 'SELECT COUNT(*) + 1 as position FROM users WHERE (level > (SELECT level FROM users WHERE id = $1)) OR (level = (SELECT level FROM users WHERE id = $1) AND experience > (SELECT experience FROM users WHERE id = $1))';
          break;
        case 'nexium':
          query = 'SELECT nexium FROM users WHERE id = $1';
          countQuery = 'SELECT COUNT(*) + 1 as position FROM users WHERE nexium > (SELECT nexium FROM users WHERE id = $1)';
          break;
        case 'cred':
          query = 'SELECT cred FROM users WHERE id = $1';
          countQuery = 'SELECT COUNT(*) + 1 as position FROM users WHERE cred > (SELECT cred FROM users WHERE id = $1)';
          break;
        default:
          return null;
      }

      const userResult = await pool.query(query, [userId]);
      if (userResult.rows.length === 0) return null;

      const positionResult = await pool.query(countQuery, [userId]);
      return {
        position: parseInt(positionResult.rows[0].position),
        value: userResult.rows[0]
      };
    } catch (error) {
      console.error('Error getting user position:', error);
      return null;
    }
  }
};