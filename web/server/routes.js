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
import { createServer } from "http";
import { storage } from "./storage";
import { insertForumPostSchema, insertForumReplySchema } from "../../shared/types/schema";
import { z } from "zod";
export function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var httpServer;
        var _this = this;
        return __generator(this, function (_a) {
            // Dashboard stats
            app.get("/api/stats", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var stats, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getDashboardStats()];
                        case 1:
                            stats = _a.sent();
                            res.json(stats);
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            console.error("Error fetching dashboard stats:", error_1);
                            res.status(500).json({ error: "Failed to fetch dashboard stats" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // User routes
            app.get("/api/user/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var user, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getUser(req.params.id)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                            }
                            res.json(user);
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            console.error("Error fetching user:", error_2);
                            res.status(500).json({ error: "Failed to fetch user" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/user/discord/:discordId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var user, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getUserByDiscordId(req.params.discordId)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                            }
                            res.json(user);
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            console.error("Error fetching user by Discord ID:", error_3);
                            res.status(500).json({ error: "Failed to fetch user" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Character routes
            app.get("/api/characters/:userId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var characters, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getCharactersByUserId(req.params.userId)];
                        case 1:
                            characters = _a.sent();
                            res.json(characters);
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            console.error("Error fetching characters:", error_4);
                            res.status(500).json({ error: "Failed to fetch characters" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Battle routes
            app.get("/api/battles/recent", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var limit, battles, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            limit = req.query.limit ? parseInt(req.query.limit) : 10;
                            return [4 /*yield*/, storage.getRecentBattles(limit)];
                        case 1:
                            battles = _a.sent();
                            res.json(battles);
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _a.sent();
                            console.error("Error fetching recent battles:", error_5);
                            res.status(500).json({ error: "Failed to fetch recent battles" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/battles/user/:userId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var battles, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getBattlesByUserId(req.params.userId)];
                        case 1:
                            battles = _a.sent();
                            res.json(battles);
                            return [3 /*break*/, 3];
                        case 2:
                            error_6 = _a.sent();
                            console.error("Error fetching user battles:", error_6);
                            res.status(500).json({ error: "Failed to fetch user battles" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Guild routes
            app.get("/api/guilds", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var guilds, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getGuilds()];
                        case 1:
                            guilds = _a.sent();
                            res.json(guilds);
                            return [3 /*break*/, 3];
                        case 2:
                            error_7 = _a.sent();
                            console.error("Error fetching guilds:", error_7);
                            res.status(500).json({ error: "Failed to fetch guilds" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Forum routes
            app.get("/api/forum/categories", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var categories, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getForumCategories()];
                        case 1:
                            categories = _a.sent();
                            res.json(categories);
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _a.sent();
                            console.error("Error fetching forum categories:", error_8);
                            res.status(500).json({ error: "Failed to fetch forum categories" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/forum/posts/:categoryId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var posts, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getForumPostsByCategory(req.params.categoryId)];
                        case 1:
                            posts = _a.sent();
                            res.json(posts);
                            return [3 /*break*/, 3];
                        case 2:
                            error_9 = _a.sent();
                            console.error("Error fetching forum posts:", error_9);
                            res.status(500).json({ error: "Failed to fetch forum posts" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/api/forum/posts", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var validatedData, post, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            validatedData = insertForumPostSchema.parse(req.body);
                            return [4 /*yield*/, storage.createForumPost(validatedData)];
                        case 1:
                            post = _a.sent();
                            res.status(201).json(post);
                            return [3 /*break*/, 3];
                        case 2:
                            error_10 = _a.sent();
                            if (error_10 instanceof z.ZodError) {
                                return [2 /*return*/, res.status(400).json({ error: "Invalid post data", details: error_10.errors })];
                            }
                            console.error("Error creating forum post:", error_10);
                            res.status(500).json({ error: "Failed to create forum post" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/forum/post/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var post, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getForumPost(req.params.id)];
                        case 1:
                            post = _a.sent();
                            if (!post) {
                                return [2 /*return*/, res.status(404).json({ error: "Post not found" })];
                            }
                            res.json(post);
                            return [3 /*break*/, 3];
                        case 2:
                            error_11 = _a.sent();
                            console.error("Error fetching forum post:", error_11);
                            res.status(500).json({ error: "Failed to fetch forum post" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/forum/replies/:postId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var replies, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getForumRepliesByPost(req.params.postId)];
                        case 1:
                            replies = _a.sent();
                            res.json(replies);
                            return [3 /*break*/, 3];
                        case 2:
                            error_12 = _a.sent();
                            console.error("Error fetching forum replies:", error_12);
                            res.status(500).json({ error: "Failed to fetch forum replies" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/api/forum/replies", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var validatedData, reply, error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            validatedData = insertForumReplySchema.parse(req.body);
                            return [4 /*yield*/, storage.createForumReply(validatedData)];
                        case 1:
                            reply = _a.sent();
                            res.status(201).json(reply);
                            return [3 /*break*/, 3];
                        case 2:
                            error_13 = _a.sent();
                            if (error_13 instanceof z.ZodError) {
                                return [2 /*return*/, res.status(400).json({ error: "Invalid reply data", details: error_13.errors })];
                            }
                            console.error("Error creating forum reply:", error_13);
                            res.status(500).json({ error: "Failed to create forum reply" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Leaderboard routes
            app.get("/api/leaderboard/pvp", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var limit, leaderboard, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            limit = req.query.limit ? parseInt(req.query.limit) : 10;
                            return [4 /*yield*/, storage.getLeaderboard('pvp', limit)];
                        case 1:
                            leaderboard = _a.sent();
                            res.json(leaderboard);
                            return [3 /*break*/, 3];
                        case 2:
                            error_14 = _a.sent();
                            console.error("Error fetching PvP leaderboard:", error_14);
                            res.status(500).json({ error: "Failed to fetch PvP leaderboard" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/leaderboard/guilds", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var limit, leaderboard, error_15;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            limit = req.query.limit ? parseInt(req.query.limit) : 10;
                            return [4 /*yield*/, storage.getLeaderboard('guild', limit)];
                        case 1:
                            leaderboard = _a.sent();
                            res.json(leaderboard);
                            return [3 /*break*/, 3];
                        case 2:
                            error_15 = _a.sent();
                            console.error("Error fetching guild leaderboard:", error_15);
                            res.status(500).json({ error: "Failed to fetch guild leaderboard" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Player stats
            app.get("/api/player/stats/:userId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var stats, error_16;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getPlayerStats(req.params.userId)];
                        case 1:
                            stats = _a.sent();
                            if (!stats) {
                                return [2 /*return*/, res.status(404).json({ error: "Player stats not found" })];
                            }
                            res.json(stats);
                            return [3 /*break*/, 3];
                        case 2:
                            error_16 = _a.sent();
                            console.error("Error fetching player stats:", error_16);
                            res.status(500).json({ error: "Failed to fetch player stats" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Discord OAuth endpoints
            app.get("/api/auth/discord", function (req, res) {
                var _a;
                var clientId = process.env.DISCORD_CLIENT_ID;
                var redirectUri = process.env.DISCORD_REDIRECT_URI || "".concat(((_a = process.env.REPLIT_DOMAINS) === null || _a === void 0 ? void 0 : _a.split(',')[0]) || 'http://localhost:5000', "/api/auth/discord/callback");
                var scope = "identify email guilds";
                var authUrl = "https://discord.com/api/oauth2/authorize?client_id=".concat(clientId, "&redirect_uri=").concat(encodeURIComponent(redirectUri), "&response_type=code&scope=").concat(encodeURIComponent(scope));
                res.redirect(authUrl);
            });
            app.get("/api/auth/discord/callback", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var code, clientId, clientSecret, redirectUri, tokenResponse, tokenData, userResponse, discordUser, user, error_17;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 10, , 11]);
                            code = req.query.code;
                            if (!code) {
                                return [2 /*return*/, res.status(400).json({ error: "Missing authorization code" })];
                            }
                            clientId = process.env.DISCORD_CLIENT_ID;
                            clientSecret = process.env.DISCORD_CLIENT_SECRET;
                            redirectUri = process.env.DISCORD_REDIRECT_URI || "".concat(((_a = process.env.REPLIT_DOMAINS) === null || _a === void 0 ? void 0 : _a.split(',')[0]) || 'http://localhost:5000', "/api/auth/discord/callback");
                            return [4 /*yield*/, fetch('https://discord.com/api/oauth2/token', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    body: new URLSearchParams({
                                        client_id: clientId,
                                        client_secret: clientSecret,
                                        grant_type: 'authorization_code',
                                        code: code,
                                        redirect_uri: redirectUri,
                                    }),
                                })];
                        case 1:
                            tokenResponse = _b.sent();
                            return [4 /*yield*/, tokenResponse.json()];
                        case 2:
                            tokenData = _b.sent();
                            if (!tokenResponse.ok) {
                                console.error('Discord token error:', tokenData);
                                return [2 /*return*/, res.status(400).json({ error: "Failed to exchange code for token" })];
                            }
                            return [4 /*yield*/, fetch('https://discord.com/api/users/@me', {
                                    headers: {
                                        Authorization: "Bearer ".concat(tokenData.access_token),
                                    },
                                })];
                        case 3:
                            userResponse = _b.sent();
                            return [4 /*yield*/, userResponse.json()];
                        case 4:
                            discordUser = _b.sent();
                            if (!userResponse.ok) {
                                console.error('Discord user error:', discordUser);
                                return [2 /*return*/, res.status(400).json({ error: "Failed to fetch user info" })];
                            }
                            return [4 /*yield*/, storage.getUserByDiscordId(discordUser.id)];
                        case 5:
                            user = _b.sent();
                            if (!!user) return [3 /*break*/, 7];
                            return [4 /*yield*/, storage.createUser({
                                    discordId: discordUser.id,
                                    username: discordUser.username,
                                    avatar: discordUser.avatar,
                                    discriminator: discordUser.discriminator,
                                    accessToken: tokenData.access_token,
                                    refreshToken: tokenData.refresh_token,
                                })];
                        case 6:
                            user = _b.sent();
                            return [3 /*break*/, 9];
                        case 7: return [4 /*yield*/, storage.updateUser(user.id, {
                                accessToken: tokenData.access_token,
                                refreshToken: tokenData.refresh_token,
                                username: discordUser.username,
                                avatar: discordUser.avatar,
                            })];
                        case 8:
                            // Update existing user with new tokens
                            user = _b.sent();
                            _b.label = 9;
                        case 9:
                            // Redirect to frontend with user info
                            res.redirect("/?user=".concat(encodeURIComponent(JSON.stringify(user))));
                            return [3 /*break*/, 11];
                        case 10:
                            error_17 = _b.sent();
                            console.error("Discord OAuth error:", error_17);
                            res.status(500).json({ error: "Authentication failed" });
                            return [3 /*break*/, 11];
                        case 11: return [2 /*return*/];
                    }
                });
            }); });
            httpServer = createServer(app);
            return [2 /*return*/, httpServer];
        });
    });
}
