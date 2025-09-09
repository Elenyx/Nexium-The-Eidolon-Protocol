var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export var users = pgTable("users", {
    id: varchar("id").primaryKey().default(sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    discordId: varchar("discord_id").notNull().unique(),
    username: text("username").notNull(),
    avatar: text("avatar"),
    discriminator: varchar("discriminator", { length: 4 }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    createdAt: timestamp("created_at").defaultNow(),
});
export var characters = pgTable("characters", {
    id: varchar("id").primaryKey().default(sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    name: text("name").notNull(),
    rarity: varchar("rarity", { length: 20 }).notNull(), // common, rare, epic, legendary
    power: integer("power").notNull().default(0),
    level: integer("level").notNull().default(1),
    experience: integer("experience").notNull().default(0),
    image: text("image"),
    abilities: jsonb("abilities").$type().default([]),
    userId: varchar("user_id").references(function () { return users.id; }),
    createdAt: timestamp("created_at").defaultNow(),
});
export var battles = pgTable("battles", {
    id: varchar("id").primaryKey().default(sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    winnerId: varchar("winner_id").references(function () { return users.id; }),
    loserId: varchar("loser_id").references(function () { return users.id; }),
    battleType: varchar("battle_type", { length: 20 }).notNull(), // pvp, pve, dungeon
    expGained: integer("exp_gained").default(0),
    goldGained: integer("gold_gained").default(0),
    itemsGained: jsonb("items_gained").$type().default([]),
    createdAt: timestamp("created_at").defaultNow(),
});
export var guilds = pgTable("guilds", {
    id: varchar("id").primaryKey().default(sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    name: text("name").notNull().unique(),
    description: text("description"),
    memberCount: integer("member_count").default(0),
    territories: integer("territories").default(0),
    totalPower: integer("total_power").default(0),
    leaderId: varchar("leader_id").references(function () { return users.id; }),
    createdAt: timestamp("created_at").defaultNow(),
});
export var guildMembers = pgTable("guild_members", {
    id: varchar("id").primaryKey().default(sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    userId: varchar("user_id").references(function () { return users.id; }),
    guildId: varchar("guild_id").references(function () { return guilds.id; }),
    role: varchar("role", { length: 20 }).default("member"), // member, officer, leader
    joinedAt: timestamp("joined_at").defaultNow(),
});
export var forumCategories = pgTable("forum_categories", {
    id: varchar("id").primaryKey().default(sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    name: text("name").notNull(),
    description: text("description"),
    icon: text("icon"),
    postCount: integer("post_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
});
export var forumPosts = pgTable("forum_posts", {
    id: varchar("id").primaryKey().default(sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    title: text("title").notNull(),
    content: text("content").notNull(),
    authorId: varchar("author_id").references(function () { return users.id; }),
    categoryId: varchar("category_id").references(function () { return forumCategories.id; }),
    isPinned: boolean("is_pinned").default(false),
    isLocked: boolean("is_locked").default(false),
    replyCount: integer("reply_count").default(0),
    lastReplyAt: timestamp("last_reply_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
export var forumReplies = pgTable("forum_replies", {
    id: varchar("id").primaryKey().default(sql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    content: text("content").notNull(),
    authorId: varchar("author_id").references(function () { return users.id; }),
    postId: varchar("post_id").references(function () { return forumPosts.id; }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
export var playerStats = pgTable("player_stats", {
    id: varchar("id").primaryKey().default(sql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    userId: varchar("user_id").references(function () { return users.id; }).unique(),
    totalPower: integer("total_power").default(0),
    pvpWins: integer("pvp_wins").default(0),
    pvpLosses: integer("pvp_losses").default(0),
    pvpRating: integer("pvp_rating").default(1000),
    dungeonsCleared: integer("dungeons_cleared").default(0),
    gold: integer("gold").default(0),
    reputation: integer("reputation").default(0),
});
// Relations
export var usersRelations = relations(users, function (_a) {
    var many = _a.many, one = _a.one;
    return ({
        characters: many(characters),
        battlesWon: many(battles, { relationName: "winner" }),
        battlesLost: many(battles, { relationName: "loser" }),
        guildMemberships: many(guildMembers),
        forumPosts: many(forumPosts),
        forumReplies: many(forumReplies),
        stats: one(playerStats),
    });
});
export var charactersRelations = relations(characters, function (_a) {
    var one = _a.one;
    return ({
        owner: one(users, {
            fields: [characters.userId],
            references: [users.id],
        }),
    });
});
export var battlesRelations = relations(battles, function (_a) {
    var one = _a.one;
    return ({
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
    });
});
export var guildsRelations = relations(guilds, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        leader: one(users, {
            fields: [guilds.leaderId],
            references: [users.id],
        }),
        members: many(guildMembers),
    });
});
export var guildMembersRelations = relations(guildMembers, function (_a) {
    var one = _a.one;
    return ({
        user: one(users, {
            fields: [guildMembers.userId],
            references: [users.id],
        }),
        guild: one(guilds, {
            fields: [guildMembers.guildId],
            references: [guilds.id],
        }),
    });
});
export var forumCategoriesRelations = relations(forumCategories, function (_a) {
    var many = _a.many;
    return ({
        posts: many(forumPosts),
    });
});
export var forumPostsRelations = relations(forumPosts, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        author: one(users, {
            fields: [forumPosts.authorId],
            references: [users.id],
        }),
        category: one(forumCategories, {
            fields: [forumPosts.categoryId],
            references: [forumCategories.id],
        }),
        replies: many(forumReplies),
    });
});
export var forumRepliesRelations = relations(forumReplies, function (_a) {
    var one = _a.one;
    return ({
        author: one(users, {
            fields: [forumReplies.authorId],
            references: [users.id],
        }),
        post: one(forumPosts, {
            fields: [forumReplies.postId],
            references: [forumPosts.id],
        }),
    });
});
export var playerStatsRelations = relations(playerStats, function (_a) {
    var one = _a.one;
    return ({
        user: one(users, {
            fields: [playerStats.userId],
            references: [users.id],
        }),
    });
});
// Schemas for validation
export var insertUserSchema = createInsertSchema(users).omit({
    id: true,
    createdAt: true,
});
export var insertCharacterSchema = createInsertSchema(characters).omit({
    id: true,
    createdAt: true,
}).extend({
    abilities: z.array(z.string()).optional().default([]),
});
export var insertBattleSchema = createInsertSchema(battles).omit({
    id: true,
    createdAt: true,
}).extend({
    itemsGained: z.array(z.string()).optional().default([]),
});
export var insertGuildSchema = createInsertSchema(guilds).omit({
    id: true,
    createdAt: true,
});
export var insertForumPostSchema = createInsertSchema(forumPosts).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    replyCount: true,
    lastReplyAt: true,
});
export var insertForumReplySchema = createInsertSchema(forumReplies).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
