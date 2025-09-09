import {
  type User,
  type InsertUser,
  type Character,
  type InsertCharacter,
  type Battle,
  type InsertBattle,
  type Guild,
  type InsertGuild,
  type ForumCategory,
  type ForumPost,
  type InsertForumPost,
  type ForumReply,
  type InsertForumReply,
  type PlayerStats,
} from "@shared/schema";
import { db } from "./db";

// Helper to convert snake_case to camelCase
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
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
    if (Array.isArray(obj)) {
        return obj.map(v => toSnakeCase(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            result[snakeKey] = toSnakeCase(obj[key]);
            return result;
        }, {} as any);
    }
    return obj;
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
  
  // Forum operations
  getForumCategories(): Promise<ForumCategory[]>;
  getForumPostsByCategory(categoryId: string): Promise<ForumPost[]>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumPost(id: string): Promise<ForumPost | undefined>;
  getForumRepliesByPost(postId: string): Promise<ForumReply[]>;
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  
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
    const res = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return toCamelCase(res.rows[0]);
  }

  async getUserByDiscordId(discordId: string): Promise<User | undefined> {
    const res = await db.query('SELECT * FROM users WHERE discord_id = $1', [discordId]);
    return toCamelCase(res.rows[0]);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const snakeUser = toSnakeCase(insertUser);
    const columns = Object.keys(snakeUser).join(', ');
    const values = Object.values(snakeUser);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    const res = await db.query(
      `INSERT INTO users (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return toCamelCase(res.rows[0]);
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const snakeUpdateData = toSnakeCase(updateData);
    const setClause = Object.keys(snakeUpdateData).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = Object.values(snakeUpdateData);

    const res = await db.query(
      `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return toCamelCase(res.rows[0]);
  }

  async getCharactersByUserId(userId: string): Promise<Character[]> {
    const res = await db.query('SELECT * FROM characters WHERE user_id = $1', [userId]);
    return toCamelCase(res.rows);
  }

  async createCharacter(character: InsertCharacter): Promise<Character> {
    const snakeCharacter = toSnakeCase(character);
    const columns = Object.keys(snakeCharacter).join(', ');
    const values = Object.values(snakeCharacter);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const res = await db.query(
      `INSERT INTO characters (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return toCamelCase(res.rows[0]);
  }

  async getBattlesByUserId(userId: string): Promise<Battle[]> {
    const res = await db.query('SELECT * FROM battles WHERE winner_id = $1 OR loser_id = $1 ORDER BY created_at DESC', [userId]);
    return toCamelCase(res.rows);
  }

  async createBattle(battle: InsertBattle): Promise<Battle> {
    const snakeBattle = toSnakeCase(battle);
    const columns = Object.keys(snakeBattle).join(', ');
    const values = Object.values(snakeBattle);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const res = await db.query(
      `INSERT INTO battles (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return toCamelCase(res.rows[0]);
  }

  async getRecentBattles(limit: number = 10): Promise<Battle[]> {
    const res = await db.query('SELECT * FROM battles ORDER BY created_at DESC LIMIT $1', [limit]);
    return toCamelCase(res.rows);
  }

  async getGuilds(): Promise<Guild[]> {
    const res = await db.query('SELECT * FROM guilds ORDER BY total_power DESC');
    return toCamelCase(res.rows);
  }

  async getGuildById(id: string): Promise<Guild | undefined> {
    const res = await db.query('SELECT * FROM guilds WHERE id = $1', [id]);
    return toCamelCase(res.rows[0]);
  }

  async createGuild(guild: InsertGuild): Promise<Guild> {
    const snakeGuild = toSnakeCase(guild);
    const columns = Object.keys(snakeGuild).join(', ');
    const values = Object.values(snakeGuild);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const res = await db.query(
      `INSERT INTO guilds (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return toCamelCase(res.rows[0]);
  }

  async getForumCategories(): Promise<ForumCategory[]> {
    const res = await db.query('SELECT * FROM forum_categories ORDER BY name');
    return toCamelCase(res.rows);
  }

  async getForumPostsByCategory(categoryId: string): Promise<ForumPost[]> {
    const res = await db.query('SELECT * FROM forum_posts WHERE category_id = $1 ORDER BY created_at DESC', [categoryId]);
    return toCamelCase(res.rows);
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const snakePost = toSnakeCase(post);
    const columns = Object.keys(snakePost).join(', ');
    const values = Object.values(snakePost);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const res = await db.query(
      `INSERT INTO forum_posts (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return toCamelCase(res.rows[0]);
  }

  async getForumPost(id: string): Promise<ForumPost | undefined> {
    const res = await db.query('SELECT * FROM forum_posts WHERE id = $1', [id]);
    return toCamelCase(res.rows[0]);
  }

  async getForumRepliesByPost(postId: string): Promise<ForumReply[]> {
    const res = await db.query('SELECT * FROM forum_replies WHERE post_id = $1 ORDER BY created_at', [postId]);
    return toCamelCase(res.rows);
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const snakeReply = toSnakeCase(reply);
    const columns = Object.keys(snakeReply).join(', ');
    const values = Object.values(snakeReply);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    const res = await db.query(
      `INSERT INTO forum_replies (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return toCamelCase(res.rows[0]);
  }

  async getPlayerStats(userId: string): Promise<PlayerStats | undefined> {
    const res = await db.query('SELECT * FROM player_stats WHERE user_id = $1', [userId]);
    return toCamelCase(res.rows[0]);
  }

  async getLeaderboard(type: 'pvp' | 'guild', limit: number = 10): Promise<any[]> {
    if (type === 'pvp') {
      const res = await db.query(`
        SELECT ps.user_id, u.username, u.avatar, ps.pvp_rating, ps.pvp_wins, ps.pvp_losses
        FROM player_stats ps
        INNER JOIN users u ON ps.user_id = u.id
        ORDER BY ps.pvp_rating DESC
        LIMIT $1
      `, [limit]);
      return toCamelCase(res.rows);
    } else {
      const res = await db.query('SELECT * FROM guilds ORDER BY total_power DESC LIMIT $1', [limit]);
      return toCamelCase(res.rows);
    }
  }

  async getDashboardStats(): Promise<{
    totalPlayers: number;
    activeBattles: number;
    charactersCollected: number;
    territoriesClaimed: number;
  }> {
    const totalPlayersRes = await db.query('SELECT COUNT(*) as count FROM users');
    const activeBattlesRes = await db.query('SELECT COUNT(*) as count FROM battles');
    const charactersCollectedRes = await db.query('SELECT COUNT(*) as count FROM characters');
    const territoriesClaimedRes = await db.query('SELECT SUM(territories) as total FROM guilds');

    return {
      totalPlayers: parseInt(totalPlayersRes.rows[0].count, 10),
      activeBattles: parseInt(activeBattlesRes.rows[0].count, 10),
      charactersCollected: parseInt(charactersCollectedRes.rows[0].count, 10),
      territoriesClaimed: parseInt(territoriesClaimedRes.rows[0].total, 10) || 0,
    };
  }
}

export const storage = new DatabaseStorage();
