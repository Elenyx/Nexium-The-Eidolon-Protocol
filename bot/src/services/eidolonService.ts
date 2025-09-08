import pool from '../database/connection.js';
import { Eidolon, UserEidolon } from '../types/index.js';

export class EidolonService {
  static async getAllEidolons(): Promise<Eidolon[]> {
    const query = 'SELECT * FROM eidolons ORDER BY rarity DESC, name';
    const result = await pool.query(query);
    return result.rows;
  }

  static async getRandomEidolon(rarityWeights?: Record<string, number>): Promise<Eidolon> {
    const weights = rarityWeights || {
      'SSR': 1,
      'SR': 5,
      'R': 15,
      'UC': 35,
      'C': 44
    };

    // Generate weighted random selection
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    const random = Math.random() * totalWeight;
    
    let currentWeight = 0;
    let selectedRarity = 'C';
    
    for (const [rarity, weight] of Object.entries(weights)) {
      currentWeight += weight;
      if (random <= currentWeight) {
        selectedRarity = rarity;
        break;
      }
    }

    const query = 'SELECT * FROM eidolons WHERE rarity = $1 ORDER BY RANDOM() LIMIT 1';
    const result = await pool.query(query, [selectedRarity]);
    return result.rows[0];
  }

  static async attuneEidolon(userId: string, eidolonId: number): Promise<UserEidolon> {
    const query = `
      INSERT INTO user_eidolons (user_id, eidolon_id) 
      VALUES ($1, $2) 
      RETURNING *
    `;
    
    const result = await pool.query(query, [userId, eidolonId]);
    return result.rows[0];
  }

  static async getUserEidolons(userId: string): Promise<UserEidolon[]> {
    const query = `
      SELECT ue.*, e.name, e.rarity, e.element, e.description, e.lore,
             e.base_attack, e.base_defense, e.base_speed, e.skill_name, e.skill_description
      FROM user_eidolons ue
      JOIN eidolons e ON ue.eidolon_id = e.id
      WHERE ue.user_id = $1
      ORDER BY e.rarity DESC, ue.acquired_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows.map(row => ({
      ...row,
      eidolon: {
        id: row.eidolon_id,
        name: row.name,
        rarity: row.rarity,
        element: row.element,
        description: row.description,
        lore: row.lore,
        base_attack: row.base_attack,
        base_defense: row.base_defense,
        base_speed: row.base_speed,
        skill_name: row.skill_name,
        skill_description: row.skill_description,
        created_at: row.created_at
      }
    }));
  }

  static async interactWithEidolon(userEidolonId: number): Promise<UserEidolon> {
    const syncGain = Math.random() * 5 + 1; // 1-6 sync ratio gain
    
    const query = `
      UPDATE user_eidolons 
      SET sync_ratio = LEAST(sync_ratio + $2, 100), 
          last_interacted = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    
    const result = await pool.query(query, [userEidolonId, syncGain]);
    return result.rows[0];
  }
}

