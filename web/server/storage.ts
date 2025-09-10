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
    if (!res.rows[0]) return undefined;
    
    const botUser = res.rows[0];
    return {
      id: botUser.id.toString(),
      discordId: botUser.id.toString(),
      username: botUser.username,
      avatar: botUser.avatar,
      discriminator: botUser.discriminator,
      accessToken: botUser.access_token,
      refreshToken: botUser.refresh_token,
      createdAt: botUser.created_at
    };
  }

  async getUserByDiscordId(discordId: string): Promise<User | undefined> {
    const res = await query('SELECT * FROM users WHERE id = $1', [discordId]);
    if (!res.rows[0]) return undefined;
    
    const botUser = res.rows[0];
    return {
      id: botUser.id.toString(),
      discordId: botUser.id.toString(),
      username: botUser.username,
      avatar: botUser.avatar,
      discriminator: botUser.discriminator,
      accessToken: botUser.access_token,
      refreshToken: botUser.refresh_token,
      createdAt: botUser.created_at
    };
  }

  async createUser(userData: InsertUser): Promise<User> {
    // Create user directly in bot's users table using Discord ID as primary key
    const result = await query(`
      INSERT INTO users (id, username, avatar, discriminator, access_token, refresh_token, nexium, cred, level, experience, created_at, last_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `, [
      userData.discordId, // Use Discord ID as primary key
      userData.username,
      userData.avatar || null,
      userData.discriminator || null,
      userData.accessToken || null,
      userData.refreshToken || null,
      100, // Default NEX
      50,  // Default CRD
      1,   // Default level
      0    // Default experience
    ]);
    
    // Convert to the expected User format for web app
    const botUser = result.rows[0];
    return {
      id: botUser.id.toString(), // Convert bigint to string for web app
      discordId: botUser.id.toString(),
      username: botUser.username,
      avatar: botUser.avatar,
      discriminator: botUser.discriminator,
      accessToken: botUser.access_token,
      refreshToken: botUser.refresh_token,
      createdAt: botUser.created_at
    };
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const updateFields = [];
    const values: any[] = [id];
    let paramIndex = 2;

    if (updateData.username) {
      updateFields.push(`username = $${paramIndex++}`);
      values.push(updateData.username);
    }
    if (updateData.avatar !== undefined) {
      updateFields.push(`avatar = $${paramIndex++}`);
      values.push(updateData.avatar);
    }
    if (updateData.discriminator !== undefined) {
      updateFields.push(`discriminator = $${paramIndex++}`);
      values.push(updateData.discriminator);
    }
    if (updateData.accessToken !== undefined) {
      updateFields.push(`access_token = $${paramIndex++}`);
      values.push(updateData.accessToken);
    }
    if (updateData.refreshToken !== undefined) {
      updateFields.push(`refresh_token = $${paramIndex++}`);
      values.push(updateData.refreshToken);
    }

    if (updateFields.length === 0) {
      return this.getUser(id);
    }

    updateFields.push(`last_active = NOW()`);

    const res = await query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $1 RETURNING *`,
      values
    );
    
    if (!res.rows[0]) return undefined;
    
    const botUser = res.rows[0];
    return {
      id: botUser.id.toString(),
      discordId: botUser.id.toString(),
      username: botUser.username,
      avatar: botUser.avatar,
      discriminator: botUser.discriminator,
      accessToken: botUser.access_token,
      refreshToken: botUser.refresh_token,
      createdAt: botUser.created_at
    };
  }

  // Characters operations (mapped to user_eidolons in bot schema)
  async getCharactersByUserId(userId: string): Promise<Character[]> {
    // Use Discord ID directly (since userId in web app is the Discord ID)
    const discordId = userId;

    const res = await query(`
      SELECT 
        ue.id,
        e.name,
        e.rarity,
        (ue.level * 100 + ue.sync_ratio * 10) as power, -- Calculate power from level and sync
        ue.level,
        ue.experience,
        null as image, -- No image field in bot schema yet
        ARRAY['TODO'] as abilities, -- Placeholder for abilities
        $1 as "userId", -- Return web app user ID for consistency
        ue.acquired_at as "createdAt"
      FROM user_eidolons ue 
      JOIN eidolons e ON ue.eidolon_id = e.id 
      WHERE ue.user_id = $2
      ORDER BY ue.acquired_at DESC
    `, [userId, discordId]);
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
    // Use Discord ID directly (since userId in web app is the Discord ID)
    const discordId = userId;

    // Get user data from bot's users table using Discord ID
    const botUserRes = await query('SELECT nexium, cred, level, experience, sync_points FROM users WHERE id = $1', [discordId]);
    const botUserData = botUserRes.rows[0];
    
    if (!botUserData) {
      return undefined;
    }

    // Get player stats (PvP, battles, etc.) - create if doesn't exist
    let statsRes = await query('SELECT * FROM player_stats WHERE user_id = $1', [discordId]);
    let statsData = statsRes.rows[0];

    // If no player_stats record exists, create one
    if (!statsData) {
      await query(`
        INSERT INTO player_stats (user_id, total_power, pvp_wins, pvp_losses, pvp_rating, dungeons_cleared, gold, reputation)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [discordId, 0, 0, 0, 1000, 0, 0, 0]);
      
      // Fetch the newly created record
      statsRes = await query('SELECT * FROM player_stats WHERE user_id = $1', [discordId]);
      statsData = statsRes.rows[0];
    }

    // Combine data from both tables
    const combinedStats = {
      id: statsData?.id || randomUUID(),
      userId: userId, // Return the web app user ID for consistency
      totalPower: statsData?.total_power || 0,
      pvpWins: statsData?.pvp_wins || 0,
      pvpLosses: statsData?.pvp_losses || 0,
      pvpRating: statsData?.pvp_rating || 1000,
      dungeonsCleared: statsData?.dungeons_cleared || 0,
      nexium: botUserData.nexium || 100, // From bot's users table
      cred: botUserData.cred || 50,       // From bot's users table
      gold: statsData?.gold || 0,        // Keep for backward compatibility
      reputation: statsData?.reputation || 0
    };

    return toCamelCase(combinedStats);
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
