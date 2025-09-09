import { pgTable, bigint, varchar, timestamp, integer, decimal, serial, text, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id", { length: 100 }).primaryKey(),
  discordId: varchar("discord_id", { length: 100 }).notNull(),
  username: varchar("username", { length: 100 }).notNull(),
  discriminator: varchar("discriminator", { length: 10 }),
  avatar: varchar("avatar", { length: 500 }).default(""),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at").defaultNow(),
  lastActive: timestamp("last_active").defaultNow(),
  nexium: integer("nexium").default(100),
  cred: integer("cred").default(50),
  level: integer("level").default(1),
  experience: integer("experience").default(0),
  syncPoints: integer("sync_points").default(0),
  location: varchar("location", { length: 100 }).default("Neo-Avalon Central"),
  title: varchar("title", { length: 200 }).default("Novice Weaver"),
});

// Characters table
export const characters = pgTable("characters", {
  id: varchar("id", { length: 100 }).primaryKey(),
  userId: varchar("user_id", { length: 100 }).references(() => users.id),
  name: varchar("name", { length: 100 }).notNull(),
  level: integer("level").default(1),
  experience: integer("experience").default(0),
  // Add more columns as needed
});

// Battles table
export const battles = pgTable("battles", {
  id: varchar("id", { length: 100 }).primaryKey(),
  userId: varchar("user_id", { length: 100 }).references(() => users.id),
  winnerId: varchar("winner_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  // Add more columns as needed
});

// Guilds table
export const guilds = pgTable("guilds", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  totalPower: integer("total_power").default(0),
  territories: integer("territories").default(0),
  // Add more columns as needed
});

// Guild Members table
export const guildMembers = pgTable("guild_members", {
  id: varchar("id", { length: 100 }).primaryKey(),
  guildId: varchar("guild_id", { length: 100 }).references(() => guilds.id),
  userId: varchar("user_id", { length: 100 }).references(() => users.id),
  // Add more columns as needed
});

// Forum Categories table
export const forumCategories = pgTable("forum_categories", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
});

// Forum Posts table
export const forumPosts = pgTable("forum_posts", {
  id: varchar("id", { length: 100 }).primaryKey(),
  categoryId: varchar("category_id", { length: 100 }).references(() => forumCategories.id),
  userId: varchar("user_id", { length: 100 }).references(() => users.id),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum Replies table
export const forumReplies = pgTable("forum_replies", {
  id: varchar("id", { length: 100 }).primaryKey(),
  postId: varchar("post_id", { length: 100 }).references(() => forumPosts.id),
  userId: varchar("user_id", { length: 100 }).references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Player Stats table
export const playerStats = pgTable("player_stats", {
  id: varchar("id", { length: 100 }).primaryKey(),
  userId: varchar("user_id", { length: 100 }).references(() => users.id),
  pvpRating: integer("pvp_rating").default(0),
  pvpWins: integer("pvp_wins").default(0),
  pvpLosses: integer("pvp_losses").default(0),
  // Add more columns as needed
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Character = typeof characters.$inferSelect;
export type InsertCharacter = typeof characters.$inferInsert;
export type Battle = typeof battles.$inferSelect;
export type InsertBattle = typeof battles.$inferInsert;
export type Guild = typeof guilds.$inferSelect;
export type InsertGuild = typeof guilds.$inferInsert;
export type ForumCategory = typeof forumCategories.$inferSelect;
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = typeof forumPosts.$inferInsert;
export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = typeof forumReplies.$inferInsert;
export type PlayerStats = typeof playerStats.$inferSelect;

// Insert schemas
export const insertForumPostSchema = createInsertSchema(forumPosts);
export const insertForumReplySchema = createInsertSchema(forumReplies);
