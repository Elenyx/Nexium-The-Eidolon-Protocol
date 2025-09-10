import pool from '../database/connection.js';
import { Battle } from '../types/index.js';

export class BattleService {
  static async createBattle(battle: Omit<Battle, 'id' | 'created_at'>): Promise<Battle> {
    const query = `
      INSERT INTO battles (winner_id, loser_id, battle_type, exp_gained, gold_gained, items_gained)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      battle.winner_id,
      battle.loser_id,
      battle.battle_type,
      battle.exp_gained,
      battle.gold_gained,
      JSON.stringify(battle.items_gained)
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getBattlesByUserId(userId: string): Promise<Battle[]> {
    const query = 'SELECT * FROM battles WHERE winner_id = $1 OR loser_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async getRecentBattles(limit: number = 10): Promise<Battle[]> {
    const query = 'SELECT * FROM battles ORDER BY created_at DESC LIMIT $1';
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  static async getUserBattleStats(userId: string): Promise<{ wins: number; losses: number; total: number }> {
    const query = `
      SELECT
        COUNT(CASE WHEN winner_id = $1 THEN 1 END) as wins,
        COUNT(CASE WHEN loser_id = $1 THEN 1 END) as losses,
        COUNT(*) as total
      FROM battles
      WHERE winner_id = $1 OR loser_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}
