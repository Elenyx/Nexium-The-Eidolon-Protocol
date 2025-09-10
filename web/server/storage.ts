import {
  type User,
  type InsertUser,
  type Character,
  type InsertCharacter,
  type Battle,
  type InsertBattle,
  type Guild,
  type InsertGuild,
  // forum types removed
  type PlayerStats,
} from "@shared/schema";
import { db } from "./db";
import { randomUUID } from "crypto";

// Helper to convert snake_case to camelCase
function toCamelCase(obj: any): any {
  if (!obj) {
    return obj; // Return early if null or undefined
  }
  
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
      (result as any)[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

// Helper to convert camelCase to snake_case for insertion/updates
function toSnakeCase(obj: any): any {
    if (!obj) {
        return obj; // Return early if null or undefined
    }
    
    if (Array.isArray(obj)) {
        return obj.map(v => toSnakeCase(v));
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((result, key) => {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            result[snakeKey] = toSnakeCase(obj[key]);
            return result;
        }, {} as any);
    }
    return obj;
}

// Database query helper that works with both PostgreSQL and SQLite
async function query(sql: string, params: any[] = []): Promise<any> {
  try {
    if (typeof db.prepare === 'function') {
      // SQLite - convert PostgreSQL-style parameters ($1, $2) to SQLite-style (?)
      const sqliteSql = sql.replace(/\$(\d+)/g, '?');
      const stmt = db.prepare(sqliteSql);
      if (sqliteSql.trim().toLowerCase().startsWith('select')) {
        try {
          const rows = stmt.all(params);
          return { rows: rows || [] };
        } catch (err) {
          console.error('SQLite query execution error:', err);
          return { rows: [] };
        }
      } else {
        try {
          const result = stmt.run(params);
          return { rows: result.changes ? [{ id: result.lastInsertRowid }] : [] };
        } catch (err) {
          console.error('SQLite statement execution error:', err);
          return { rows: [] };
        }
      }
    } else {
      // PostgreSQL
      try {
        return await db.query(sql, params);
      } catch (err) {
        console.error('PostgreSQL query execution error:', err);
        return { rows: [] };
      }
    }
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Failed query:', sql);
    console.error('Parameters:', params);
    return { rows: [] }; // Return empty result instead of throwing
  }
}


export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByDiscordId(discordId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Character operations
  getCharactersByUserId(userId: string): Promise<Character[]>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  
  // Battle operations
  getBattlesByUserId(userId: string): Promise<Battle[]>;
  createBattle(battle: InsertBattle): Promise<Battle>;
  getRecentBattles(limit?: number): Promise<Battle[]>;
  
  // Guild operations
  getGuilds(): Promise<Guild[]>;
  getGuildById(id: string): Promise<Guild | undefined>;
  createGuild(guild: InsertGuild): Promise<Guild>;
  
  // (forum operations removed)
  
  // Stats operations
  getPlayerStats(userId: string): Promise<PlayerStats | undefined>;
  getLeaderboard(type: 'pvp' | 'guild', limit?: number): Promise<any[]>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    totalPlayers: number;
    activeBattles: number;
    charactersCollected: number;
    territoriesClaimed: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const res = await query('SELECT * FROM users WHERE id = $1', [id]);
    return toCamelCase(res.rows[0]);
  }

  async getUserByDiscordId(discordId: string): Promise<User | undefined> {
    const res = await query('SELECT * FROM users WHERE discord_id = $1', [discordId]);
    return toCamelCase(res.rows[0]);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Create a user object with id and other fields
    const userWithId = {
      id: randomUUID(),
      ...insertUser
    } as any; // Using any to bypass TypeScript's type checking
    
    const snakeUser = toSnakeCase(userWithId);
    const columns = Object.keys(snakeUser).join(', ');
    const values = Object.values(snakeUser);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    const res = await query(
      `INSERT INTO users (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return toCamelCase(res.rows[0]);
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const snakeUpdateData = toSnakeCase(updateData);
    const setClause = Object.keys(snakeUpdateData).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = Object.values(snakeUpdateData);

    const res = await query(
      `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return toCamelCase(res.rows[0]);
  }

  // Characters operations (mapped to user_eidolons in bot schema)
  async getCharactersByUserId(userId: string): Promise<Character[]> {
    const res = await query(`
      SELECT ue.*, e.name as eidolon_name, e.rarity, e.element 
      FROM user_eidolons ue 
      JOIN eidolons e ON ue.eidolon_id = e.id 
      WHERE ue.user_id = $1
    `, [userId]);
    return toCamelCase(res.rows);
  }

  async createCharacter(character: InsertCharacter): Promise<Character> {
    // Map to user_eidolons table structure
    const eidolonData = {
      user_id: character.userId,
      eidolon_id: 1, // Default to first eidolon - this should be selected by user in real app
      level: character.level || 1,
      experience: character.experience || 0,
      sync_ratio: character.power || 0.0,
      ascension_level: 0
    };
    
    const columns = Object.keys(eidolonData).join(', ');
    const values = Object.values(eidolonData);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const res = await query(
      `INSERT INTO user_eidolons (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return toCamelCase(res.rows[0]);
  }

  async getBattlesByUserId(userId: string): Promise<Battle[]> {
    const res = await query('SELECT * FROM battles WHERE winner_id = $1 OR loser_id = $1 ORDER BY created_at DESC', [userId]);
    return toCamelCase(res.rows);
  }

  async createBattle(battle: InsertBattle): Promise<Battle> {
    const snakeBattle = toSnakeCase(battle);
    const columns = Object.keys(snakeBattle).join(', ');
    const values = Object.values(snakeBattle);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const res = await query(
      `INSERT INTO battles (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return toCamelCase(res.rows[0]);
  }

  async getRecentBattles(limit: number = 10): Promise<Battle[]> {
    const res = await query('SELECT * FROM battles ORDER BY created_at DESC LIMIT $1', [limit]);
    return toCamelCase(res.rows);
  }

  // Guild operations (mapped to syndicates in bot schema)
  async getGuilds(): Promise<Guild[]> {
    const res = await query('SELECT * FROM syndicates ORDER BY resources DESC');
    return toCamelCase(res.rows);
  }

  async getGuildById(id: string): Promise<Guild | undefined> {
    const res = await query('SELECT * FROM syndicates WHERE id = $1', [id]);
    return res.rows.length > 0 ? toCamelCase(res.rows[0]) : undefined;
  }

  async createGuild(guild: InsertGuild): Promise<Guild> {
    // Map to syndicates table structure
    const syndicateData = {
      name: guild.name,
      description: guild.description || '',
      leader_id: guild.leaderId,
      level: 1,
      resources: 0,
      controlled_ward: null
    };
    
    const columns = Object.keys(syndicateData).join(', ');
    const values = Object.values(syndicateData);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const res = await query(
      `INSERT INTO syndicates (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return toCamelCase(res.rows[0]);
  }

  async getPlayerStats(userId: string): Promise<PlayerStats | undefined> {
    const res = await query('SELECT * FROM player_stats WHERE user_id = $1', [userId]);
    return toCamelCase(res.rows[0]);
  }

  async getLeaderboard(type: 'pvp' | 'guild', limit: number = 10): Promise<any[]> {
    if (type === 'pvp') {
      const res = await query(`
        SELECT ps.user_id, u.username, u.avatar, ps.pvp_rating, ps.pvp_wins, ps.pvp_losses
        FROM player_stats ps
        INNER JOIN users u ON ps.user_id = u.id
        ORDER BY ps.pvp_rating DESC
        LIMIT $1
      `, [limit]);
      return toCamelCase(res.rows);
    } else {
      const res = await query('SELECT * FROM syndicates ORDER BY resources DESC LIMIT $1', [limit]);
      return toCamelCase(res.rows);
    }
  }

  async getDashboardStats(): Promise<{
    totalPlayers: number;
    activeBattles: number;
    charactersCollected: number;
    territoriesClaimed: number;
  }> {
    const totalPlayersRes = await query('SELECT COUNT(*) as count FROM users');
    const activeBattlesRes = await query('SELECT COUNT(*) as count FROM battles');
    const charactersCollectedRes = await query('SELECT COUNT(*) as count FROM user_eidolons');
    const territoriesClaimedRes = await query('SELECT SUM(resources) as total FROM syndicates');

    return {
      totalPlayers: parseInt(totalPlayersRes.rows[0].count, 10),
      activeBattles: parseInt(activeBattlesRes.rows[0].count, 10),
      charactersCollected: parseInt(charactersCollectedRes.rows[0].count, 10),
      territoriesClaimed: parseInt(territoriesClaimedRes.rows[0].total, 10) || 0,
    };
  }
}

export const storage = new DatabaseStorage();
