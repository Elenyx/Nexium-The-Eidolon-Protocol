import pool from '../database/connection';
import { User } from '../types/index';

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
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.values(updates);
    const query = `
      UPDATE users 
      SET ${setClause}, last_active = CURRENT_TIMESTAMP 
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
}
