import pool from '../database/connection.js';
import { PlayerStats } from '../types/index.js';

export class PlayerStatsService {
  static async getPlayerStats(userId: string): Promise<PlayerStats | null> {
    const query = 'SELECT * FROM player_stats WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  static async createPlayerStats(userId: string): Promise<PlayerStats> {
    const query = `
      INSERT INTO player_stats (user_id)
      VALUES ($1)
      ON CONFLICT (user_id) DO NOTHING
      RETURNING *
    `;

    const result = await pool.query(query, [userId]);

    // If no row was returned (user already exists), fetch existing stats
    if (result.rows.length === 0) {
      return await this.getPlayerStats(userId) as PlayerStats;
    }

    return result.rows[0];
  }

  static async updatePlayerStats(userId: string, updates: Partial<Omit<PlayerStats, 'id' | 'user_id' | 'created_at'>>): Promise<PlayerStats> {
    // Ensure player stats exist
    let stats = await this.getPlayerStats(userId);
    if (!stats) {
      stats = await this.createPlayerStats(userId);
    }

    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = Object.values(updates);
    const query = `
      UPDATE player_stats
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [userId, ...values]);
    return result.rows[0];
  }

  static async incrementWins(userId: string): Promise<PlayerStats> {
    const query = `
      INSERT INTO player_stats (user_id, pvp_wins)
      VALUES ($1, 1)
      ON CONFLICT (user_id) DO UPDATE SET
        pvp_wins = player_stats.pvp_wins + 1,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  static async incrementLosses(userId: string): Promise<PlayerStats> {
    const query = `
      INSERT INTO player_stats (user_id, pvp_losses)
      VALUES ($1, 1)
      ON CONFLICT (user_id) DO UPDATE SET
        pvp_losses = player_stats.pvp_losses + 1,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  static async updateRating(userId: string, newRating: number): Promise<PlayerStats> {
    const query = `
      INSERT INTO player_stats (user_id, pvp_rating)
      VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE SET
        pvp_rating = $2,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const result = await pool.query(query, [userId, newRating]);
    return result.rows[0];
  }

  static async getLeaderboard(type: 'pvp_rating' | 'total_power' | 'gold', limit: number = 10): Promise<any[]> {
    let orderBy: string;

    switch (type) {
      case 'pvp_rating':
        orderBy = 'ps.pvp_rating DESC';
        break;
      case 'total_power':
        orderBy = 'ps.total_power DESC';
        break;
      case 'gold':
        orderBy = 'ps.gold DESC';
        break;
      default:
        orderBy = 'ps.pvp_rating DESC';
    }

    const query = `
      SELECT ps.*, u.username, u.avatar
      FROM player_stats ps
      INNER JOIN users u ON ps.user_id = u.id
      ORDER BY ${orderBy}
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}
