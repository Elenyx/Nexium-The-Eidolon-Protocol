import { type User, type InsertUser, type Character, type InsertCharacter, type Battle, type InsertBattle, type Guild, type InsertGuild, type ForumCategory, type ForumPost, type InsertForumPost, type ForumReply, type InsertForumReply, type PlayerStats } from "../../shared/types/schema";
export interface IStorage {
    getUser(id: string): Promise<User | undefined>;
    getUserByDiscordId(discordId: string): Promise<User | undefined>;
    createUser(user: InsertUser): Promise<User>;
    updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
    getCharactersByUserId(userId: string): Promise<Character[]>;
    createCharacter(character: InsertCharacter): Promise<Character>;
    getBattlesByUserId(userId: string): Promise<Battle[]>;
    createBattle(battle: InsertBattle): Promise<Battle>;
    getRecentBattles(limit?: number): Promise<Battle[]>;
    getGuilds(): Promise<Guild[]>;
    getGuildById(id: string): Promise<Guild | undefined>;
    createGuild(guild: InsertGuild): Promise<Guild>;
    getForumCategories(): Promise<ForumCategory[]>;
    getForumPostsByCategory(categoryId: string): Promise<ForumPost[]>;
    createForumPost(post: InsertForumPost): Promise<ForumPost>;
    getForumPost(id: string): Promise<ForumPost | undefined>;
    getForumRepliesByPost(postId: string): Promise<ForumReply[]>;
    createForumReply(reply: InsertForumReply): Promise<ForumReply>;
    getPlayerStats(userId: string): Promise<PlayerStats | undefined>;
    getLeaderboard(type: 'pvp' | 'guild', limit?: number): Promise<any[]>;
    getDashboardStats(): Promise<{
        totalPlayers: number;
        activeBattles: number;
        charactersCollected: number;
        territoriesClaimed: number;
    }>;
}
export declare class DatabaseStorage implements IStorage {
    getUser(id: string): Promise<User | undefined>;
    getUserByDiscordId(discordId: string): Promise<User | undefined>;
    createUser(insertUser: InsertUser): Promise<User>;
    updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined>;
    getCharactersByUserId(userId: string): Promise<Character[]>;
    createCharacter(character: InsertCharacter): Promise<Character>;
    getBattlesByUserId(userId: string): Promise<Battle[]>;
    createBattle(battle: InsertBattle): Promise<Battle>;
    getRecentBattles(limit?: number): Promise<Battle[]>;
    getGuilds(): Promise<Guild[]>;
    getGuildById(id: string): Promise<Guild | undefined>;
    createGuild(guild: InsertGuild): Promise<Guild>;
    getForumCategories(): Promise<ForumCategory[]>;
    getForumPostsByCategory(categoryId: string): Promise<ForumPost[]>;
    createForumPost(post: InsertForumPost): Promise<ForumPost>;
    getForumPost(id: string): Promise<ForumPost | undefined>;
    getForumRepliesByPost(postId: string): Promise<ForumReply[]>;
    createForumReply(reply: InsertForumReply): Promise<ForumReply>;
    getPlayerStats(userId: string): Promise<PlayerStats | undefined>;
    getLeaderboard(type: 'pvp' | 'guild', limit?: number): Promise<any[]>;
    getDashboardStats(): Promise<{
        totalPlayers: number;
        activeBattles: number;
        charactersCollected: number;
        territoriesClaimed: number;
    }>;
}
export declare const storage: DatabaseStorage;
