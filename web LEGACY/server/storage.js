var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { users, characters, battles, guilds, forumCategories, forumPosts, forumReplies, playerStats, } from "../shared/types/schema";
import { db } from "./db";
import { eq, desc, count, and } from "drizzle-orm";
var DatabaseStorage = /** @class */ (function () {
    function DatabaseStorage() {
    }
    DatabaseStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(users).where(eq(users.id, id))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserByDiscordId = function (discordId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(users).where(eq(users.discordId, discordId))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.createUser = function (insertUser) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .insert(users)
                            .values(insertUser)
                            .returning()];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateUser = function (id, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .update(users)
                            .set(updateData)
                            .where(eq(users.id, id))
                            .returning()];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getCharactersByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(characters).where(eq(characters.userId, userId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createCharacter = function (character) {
        return __awaiter(this, void 0, void 0, function () {
            var newCharacter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .insert(characters)
                            .values(character)
                            .returning()];
                    case 1:
                        newCharacter = (_a.sent())[0];
                        return [2 /*return*/, newCharacter];
                }
            });
        });
    };
    DatabaseStorage.prototype.getBattlesByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(battles)
                            .where(and(eq(battles.winnerId, userId)))
                            .orderBy(desc(battles.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createBattle = function (battle) {
        return __awaiter(this, void 0, void 0, function () {
            var newBattle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .insert(battles)
                            .values(battle)
                            .returning()];
                    case 1:
                        newBattle = (_a.sent())[0];
                        return [2 /*return*/, newBattle];
                }
            });
        });
    };
    DatabaseStorage.prototype.getRecentBattles = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(battles)
                            .orderBy(desc(battles.createdAt))
                            .limit(limit)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getGuilds = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(guilds)
                            .orderBy(desc(guilds.totalPower))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getGuildById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var guild;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(guilds).where(eq(guilds.id, id))];
                    case 1:
                        guild = (_a.sent())[0];
                        return [2 /*return*/, guild || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.createGuild = function (guild) {
        return __awaiter(this, void 0, void 0, function () {
            var newGuild;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .insert(guilds)
                            .values(guild)
                            .returning()];
                    case 1:
                        newGuild = (_a.sent())[0];
                        return [2 /*return*/, newGuild];
                }
            });
        });
    };
    DatabaseStorage.prototype.getForumCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(forumCategories)
                            .orderBy(forumCategories.name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getForumPostsByCategory = function (categoryId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(forumPosts)
                            .where(eq(forumPosts.categoryId, categoryId))
                            .orderBy(desc(forumPosts.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createForumPost = function (post) {
        return __awaiter(this, void 0, void 0, function () {
            var newPost;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .insert(forumPosts)
                            .values(post)
                            .returning()];
                    case 1:
                        newPost = (_a.sent())[0];
                        return [2 /*return*/, newPost];
                }
            });
        });
    };
    DatabaseStorage.prototype.getForumPost = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(forumPosts).where(eq(forumPosts.id, id))];
                    case 1:
                        post = (_a.sent())[0];
                        return [2 /*return*/, post || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getForumRepliesByPost = function (postId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(forumReplies)
                            .where(eq(forumReplies.postId, postId))
                            .orderBy(forumReplies.createdAt)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createForumReply = function (reply) {
        return __awaiter(this, void 0, void 0, function () {
            var newReply;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .insert(forumReplies)
                            .values(reply)
                            .returning()];
                    case 1:
                        newReply = (_a.sent())[0];
                        return [2 /*return*/, newReply];
                }
            });
        });
    };
    DatabaseStorage.prototype.getPlayerStats = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(playerStats).where(eq(playerStats.userId, userId))];
                    case 1:
                        stats = (_a.sent())[0];
                        return [2 /*return*/, stats || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getLeaderboard = function (type_1) {
        return __awaiter(this, arguments, void 0, function (type, limit) {
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(type === 'pvp')) return [3 /*break*/, 2];
                        return [4 /*yield*/, db
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
                                .limit(limit)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, db
                            .select()
                            .from(guilds)
                            .orderBy(desc(guilds.totalPower))
                            .limit(limit)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getDashboardStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalPlayersResult, activeBattlesResult, charactersResult, territoriesResult, totalTerritories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select({ count: count() }).from(users)];
                    case 1:
                        totalPlayersResult = (_a.sent())[0];
                        return [4 /*yield*/, db.select({ count: count() }).from(battles)];
                    case 2:
                        activeBattlesResult = (_a.sent())[0];
                        return [4 /*yield*/, db.select({ count: count() }).from(characters)];
                    case 3:
                        charactersResult = (_a.sent())[0];
                        return [4 /*yield*/, db.select({ total: guilds.territories }).from(guilds)];
                    case 4:
                        territoriesResult = _a.sent();
                        totalTerritories = territoriesResult.reduce(function (sum, guild) { return sum + (guild.total || 0); }, 0);
                        return [2 /*return*/, {
                                totalPlayers: totalPlayersResult.count,
                                activeBattles: activeBattlesResult.count,
                                charactersCollected: charactersResult.count,
                                territoriesClaimed: totalTerritories,
                            }];
                }
            });
        });
    };
    return DatabaseStorage;
}());
export { DatabaseStorage };
export var storage = new DatabaseStorage();
