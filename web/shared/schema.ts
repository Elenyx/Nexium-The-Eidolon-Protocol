import { z } from "zod";

// Type definitions for database tables

export interface User {
  id: string;
  discordId: string;
  username: string;
  avatar: string | null;
  discriminator: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  createdAt: Date;
}

export interface Character {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  power: number;
  level: number;
  experience: number;
  image: string | null;
  abilities: string[];
  userId: string | null;
  createdAt: Date;
}

export interface Battle {
  id: string;
  winnerId: string | null;
  loserId: string | null;
  battleType: "pvp" | "pve" | "dungeon";
  expGained: number;
  goldGained: number;
  itemsGained: string[];
  createdAt: Date;
}

export interface Guild {
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
  territories: number;
  totalPower: number;
  leaderId: string | null;
  createdAt: Date;
}

export interface GuildMember {
  id: string;
  userId: string | null;
  guildId: string | null;
  role: "member" | "officer" | "leader";
  joinedAt: Date;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  postCount: number;
  createdAt: Date;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string | null;
  categoryId: string | null;
  isPinned: boolean;
  isLocked: boolean;
  replyCount: number;
  lastReplyAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumReply {
  id: string;
  content: string;
  authorId: string | null;
  postId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerStats {
  id: string;
  userId: string | null;
  totalPower: number;
  pvpWins: number;
  pvpLosses: number;
  pvpRating: number;
  dungeonsCleared: number;
  gold: number;
  reputation: number;
}

// Zod schemas for validation

export const insertUserSchema = z.object({
  discordId: z.string(),
  username: z.string(),
  avatar: z.string().nullable().optional(),
  discriminator: z.string().nullable().optional(), // Can be null for newer Discord accounts
  accessToken: z.string().nullable().optional(),
  refreshToken: z.string().nullable().optional(),
});

export const insertCharacterSchema = z.object({
  name: z.string(),
  rarity: z.enum(["common", "rare", "epic", "legendary"]),
  power: z.number().int().default(0),
  level: z.number().int().default(1),
  experience: z.number().int().default(0),
  image: z.string().optional(),
  abilities: z.array(z.string()).default([]),
  userId: z.string().optional(),
});

export const insertBattleSchema = z.object({
  winnerId: z.string().optional(),
  loserId: z.string().optional(),
  battleType: z.enum(["pvp", "pve", "dungeon"]),
  expGained: z.number().int().default(0),
  goldGained: z.number().int().default(0),
  itemsGained: z.array(z.string()).default([]),
});

export const insertGuildSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  leaderId: z.string().optional(),
});

export const insertForumPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  categoryId: z.string(),
  isPinned: z.boolean().default(false),
  isLocked: z.boolean().default(false),
});

export const insertForumReplySchema = z.object({
  content: z.string(),
  authorId: z.string(),
  postId: z.string(),
});

// Types inferred from Zod schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type InsertBattle = z.infer<typeof insertBattleSchema>;
export type InsertGuild = z.infer<typeof insertGuildSchema>;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
