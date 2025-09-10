import pool from '../database/connection.js';
import { User } from '../types/index.js';

export class UserService {
  static async createUser(id: string, username: string): Promise<User> {
    const query = `
      INSERT INTO users (id, username) 
      VALUES ($1, $2) 
      ON CONFLICT (id) DO UPDATE SET 
        username = $2, 
        last_active = CURRENT_TIMESTAMP 
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, username]);
    return result.rows[0];
  }

  static async getUser(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    // Always update last_active to CURRENT_TIMESTAMP
    const filteredUpdates = { ...updates };
    delete filteredUpdates.last_active; // Remove last_active from updates to avoid conflict
    
    const setClause = Object.keys(filteredUpdates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.values(filteredUpdates);
    const query = `
      UPDATE users 
      SET ${setClause}${setClause ? ', ' : ''}last_active = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  }

  static async addCurrency(id: string, nexium: number = 0, cred: number = 0): Promise<User> {
    const query = `
      UPDATE users 
      SET nexium = nexium + $2, cred = cred + $3, last_active = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, nexium, cred]);
    return result.rows[0];
  }

  static async spendCurrency(id: string, nexium: number = 0, cred: number = 0): Promise<boolean> {
    const query = `
      UPDATE users 
      SET nexium = nexium - $2, cred = cred - $3, last_active = CURRENT_TIMESTAMP 
      WHERE id = $1 AND nexium >= $2 AND cred >= $3 
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, nexium, cred]);
    return result.rows.length > 0;
  }

  static async updateDiscordInfo(id: string, discordData: {
    discord_id?: string;
    avatar?: string | null;
    discriminator?: string | null;
    access_token?: string | null;
    refresh_token?: string | null;
  }): Promise<User> {
    const setClause = Object.keys(discordData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = Object.values(discordData);
    const query = `
      UPDATE users
      SET ${setClause}, last_active = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  }

  static async getUserByDiscordId(discordId: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE discord_id = $1';
    const result = await pool.query(query, [discordId]);
    return result.rows[0] || null;
  }
}

