import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  discordId: varchar("discord_id").notNull().unique(),
  username: text("username").notNull(),
  avatar: text("avatar"),
  discriminator: varchar("discriminator", { length: 4 }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const characters = pgTable("characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  rarity: varchar("rarity", { length: 20 }).notNull(), // common, rare, epic, legendary
  power: integer("power").notNull().default(0),
  level: integer("level").notNull().default(1),
  experience: integer("experience").notNull().default(0),
  image: text("image"),
  abilities: jsonb("abilities").$type<string[]>().default([]),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const battles = pgTable("battles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  winnerId: varchar("winner_id").references(() => users.id),
  loserId: varchar("loser_id").references(() => users.id),
  battleType: varchar("battle_type", { length: 20 }).notNull(), // pvp, pve, dungeon
  expGained: integer("exp_gained").default(0),
  goldGained: integer("gold_gained").default(0),
  itemsGained: jsonb("items_gained").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const guilds = pgTable("guilds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  memberCount: integer("member_count").default(0),
  territories: integer("territories").default(0),
  totalPower: integer("total_power").default(0),
  leaderId: varchar("leader_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const guildMembers = pgTable("guild_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  guildId: varchar("guild_id").references(() => guilds.id),
  role: varchar("role", { length: 20 }).default("member"), // member, officer, leader
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const forumCategories = pgTable("forum_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  postCount: integer("post_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumPosts = pgTable("forum_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").references(() => users.id),
  categoryId: varchar("category_id").references(() => forumCategories.id),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  replyCount: integer("reply_count").default(0),
  lastReplyAt: timestamp("last_reply_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumReplies = pgTable("forum_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  authorId: varchar("author_id").references(() => users.id),
  postId: varchar("post_id").references(() => forumPosts.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const playerStats = pgTable("player_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).unique(),
  totalPower: integer("total_power").default(0),
  pvpWins: integer("pvp_wins").default(0),
  pvpLosses: integer("pvp_losses").default(0),
  pvpRating: integer("pvp_rating").default(1000),
  dungeonsCleared: integer("dungeons_cleared").default(0),
  gold: integer("gold").default(0),
  reputation: integer("reputation").default(0),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  characters: many(characters),
  battlesWon: many(battles, { relationName: "winner" }),
  battlesLost: many(battles, { relationName: "loser" }),
  guildMemberships: many(guildMembers),
  forumPosts: many(forumPosts),
  forumReplies: many(forumReplies),
  stats: one(playerStats),
}));

export const charactersRelations = relations(characters, ({ one }) => ({
  owner: one(users, {
    fields: [characters.userId],
    references: [users.id],
  }),
}));

export const battlesRelations = relations(battles, ({ one }) => ({
  winner: one(users, {
    fields: [battles.winnerId],
    references: [users.id],
    relationName: "winner",
  }),
  loser: one(users, {
    fields: [battles.loserId],
    references: [users.id],
    relationName: "loser",
  }),
}));

export const guildsRelations = relations(guilds, ({ one, many }) => ({
  leader: one(users, {
    fields: [guilds.leaderId],
    references: [users.id],
  }),
  members: many(guildMembers),
}));

export const guildMembersRelations = relations(guildMembers, ({ one }) => ({
  user: one(users, {
    fields: [guildMembers.userId],
    references: [users.id],
  }),
  guild: one(guilds, {
    fields: [guildMembers.guildId],
    references: [guilds.id],
  }),
}));

export const forumCategoriesRelations = relations(forumCategories, ({ many }) => ({
  posts: many(forumPosts),
}));

export const forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
  author: one(users, {
    fields: [forumPosts.authorId],
    references: [users.id],
  }),
  category: one(forumCategories, {
    fields: [forumPosts.categoryId],
    references: [forumCategories.id],
  }),
  replies: many(forumReplies),
}));

export const forumRepliesRelations = relations(forumReplies, ({ one }) => ({
  author: one(users, {
    fields: [forumReplies.authorId],
    references: [users.id],
  }),
  post: one(forumPosts, {
    fields: [forumReplies.postId],
    references: [forumPosts.id],
  }),
}));

export const playerStatsRelations = relations(playerStats, ({ one }) => ({
  user: one(users, {
    fields: [playerStats.userId],
    references: [users.id],
  }),
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
}).extend({
  abilities: z.array(z.string()).optional().default([]),
});

export const insertBattleSchema = createInsertSchema(battles).omit({
  id: true,
  createdAt: true,
}).extend({
  itemsGained: z.array(z.string()).optional().default([]),
});

export const insertGuildSchema = createInsertSchema(guilds).omit({
  id: true,
  createdAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  replyCount: true,
  lastReplyAt: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Battle = typeof battles.$inferSelect;
export type InsertBattle = z.infer<typeof insertBattleSchema>;
export type Guild = typeof guilds.$inferSelect;
export type InsertGuild = z.infer<typeof insertGuildSchema>;
export type GuildMember = typeof guildMembers.$inferSelect;
export type ForumCategory = typeof forumCategories.$inferSelect;
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type PlayerStats = typeof playerStats.$inferSelect;
