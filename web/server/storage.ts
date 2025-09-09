import {
  users,
  characters,
  battles,
  guilds,
  guildMembers,
  forumCategories,
  forumPosts,
  forumReplies,
  playerStats,
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
} from "../shared/types/schema";
import { db } from "./db";
import { eq, desc, count, and } from "drizzle-orm";

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
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByDiscordId(discordId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.discordId, discordId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getCharactersByUserId(userId: string): Promise<Character[]> {
    return await db.select().from(characters).where(eq(characters.userId, userId));
  }

  async createCharacter(character: InsertCharacter): Promise<Character> {
    const [newCharacter] = await db
      .insert(characters)
      .values(character)
      .returning();
    return newCharacter;
  }

  async getBattlesByUserId(userId: string): Promise<Battle[]> {
    return await db
      .select()
      .from(battles)
      .where(
        and(
          eq(battles.winnerId, userId)
        )
      )
      .orderBy(desc(battles.createdAt));
  }

  async createBattle(battle: InsertBattle): Promise<Battle> {
    const [newBattle] = await db
      .insert(battles)
      .values(battle)
      .returning();
    return newBattle;
  }

  async getRecentBattles(limit: number = 10): Promise<Battle[]> {
    return await db
      .select()
      .from(battles)
      .orderBy(desc(battles.createdAt))
      .limit(limit);
  }

  async getGuilds(): Promise<Guild[]> {
    return await db
      .select()
      .from(guilds)
      .orderBy(desc(guilds.totalPower));
  }

  async getGuildById(id: string): Promise<Guild | undefined> {
    const [guild] = await db.select().from(guilds).where(eq(guilds.id, id));
    return guild || undefined;
  }

  async createGuild(guild: InsertGuild): Promise<Guild> {
    const [newGuild] = await db
      .insert(guilds)
      .values(guild)
      .returning();
    return newGuild;
  }

  async getForumCategories(): Promise<ForumCategory[]> {
    return await db
      .select()
      .from(forumCategories)
      .orderBy(forumCategories.name);
  }

  async getForumPostsByCategory(categoryId: string): Promise<ForumPost[]> {
    return await db
      .select()
      .from(forumPosts)
      .where(eq(forumPosts.categoryId, categoryId))
      .orderBy(desc(forumPosts.createdAt));
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [newPost] = await db
      .insert(forumPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async getForumPost(id: string): Promise<ForumPost | undefined> {
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, id));
    return post || undefined;
  }

  async getForumRepliesByPost(postId: string): Promise<ForumReply[]> {
    return await db
      .select()
      .from(forumReplies)
      .where(eq(forumReplies.postId, postId))
      .orderBy(forumReplies.createdAt);
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const [newReply] = await db
      .insert(forumReplies)
      .values(reply)
      .returning();
    return newReply;
  }

  async getPlayerStats(userId: string): Promise<PlayerStats | undefined> {
    const [stats] = await db.select().from(playerStats).where(eq(playerStats.userId, userId));
    return stats || undefined;
  }

  async getLeaderboard(type: 'pvp' | 'guild', limit: number = 10): Promise<any[]> {
    if (type === 'pvp') {
      return await db
        .select({
          userId: playerStats.userId,
          username: users.username,
          avatar: users.avatar,
          pvpRating: playerStats.pvpRating,
          pvpWins: playerStats.pvpWins,
          pvpLosses: playerStats.pvpLosses,
        })
        .from(playerStats)
        .innerJoin(users, eq(playerStats.userId, users.id))
        .orderBy(desc(playerStats.pvpRating))
        .limit(limit);
    } else {
      return await db
        .select()
        .from(guilds)
        .orderBy(desc(guilds.totalPower))
        .limit(limit);
    }
  }

  async getDashboardStats(): Promise<{
    totalPlayers: number;
    activeBattles: number;
    charactersCollected: number;
    territoriesClaimed: number;
  }> {
    const [totalPlayersResult] = await db.select({ count: count() }).from(users);
    const [activeBattlesResult] = await db.select({ count: count() }).from(battles);
    const [charactersResult] = await db.select({ count: count() }).from(characters);
    const territoriesResult = await db.select({ total: guilds.territories }).from(guilds);

    const totalTerritories = territoriesResult.reduce((sum: number, guild: { total: number | null }) => sum + (guild.total || 0), 0);

    return {
      totalPlayers: totalPlayersResult.count,
      activeBattles: activeBattlesResult.count,
      charactersCollected: charactersResult.count,
      territoriesClaimed: totalTerritories,
    };
  }
}

export const storage = new DatabaseStorage();
