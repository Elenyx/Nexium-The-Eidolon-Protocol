import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertForumPostSchema, insertForumReplySchema } from "../../shared/types/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/user/discord/:discordId", async (req, res) => {
    try {
      const user = await storage.getUserByDiscordId(req.params.discordId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user by Discord ID:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Character routes
  app.get("/api/characters/:userId", async (req, res) => {
    try {
      const characters = await storage.getCharactersByUserId(req.params.userId);
      res.json(characters);
    } catch (error) {
      console.error("Error fetching characters:", error);
      res.status(500).json({ error: "Failed to fetch characters" });
    }
  });

  // Battle routes
  app.get("/api/battles/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const battles = await storage.getRecentBattles(limit);
      res.json(battles);
    } catch (error) {
      console.error("Error fetching recent battles:", error);
      res.status(500).json({ error: "Failed to fetch recent battles" });
    }
  });

  app.get("/api/battles/user/:userId", async (req, res) => {
    try {
      const battles = await storage.getBattlesByUserId(req.params.userId);
      res.json(battles);
    } catch (error) {
      console.error("Error fetching user battles:", error);
      res.status(500).json({ error: "Failed to fetch user battles" });
    }
  });

  // Guild routes
  app.get("/api/guilds", async (req, res) => {
    try {
      const guilds = await storage.getGuilds();
      res.json(guilds);
    } catch (error) {
      console.error("Error fetching guilds:", error);
      res.status(500).json({ error: "Failed to fetch guilds" });
    }
  });

  // Forum routes
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching forum categories:", error);
      res.status(500).json({ error: "Failed to fetch forum categories" });
    }
  });

  app.get("/api/forum/posts/:categoryId", async (req, res) => {
    try {
      const posts = await storage.getForumPostsByCategory(req.params.categoryId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      res.status(500).json({ error: "Failed to fetch forum posts" });
    }
  });

  app.post("/api/forum/posts", async (req, res) => {
    try {
      const validatedData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid post data", details: error.errors });
      }
      console.error("Error creating forum post:", error);
      res.status(500).json({ error: "Failed to create forum post" });
    }
  });

  app.get("/api/forum/post/:id", async (req, res) => {
    try {
      const post = await storage.getForumPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching forum post:", error);
      res.status(500).json({ error: "Failed to fetch forum post" });
    }
  });

  app.get("/api/forum/replies/:postId", async (req, res) => {
    try {
      const replies = await storage.getForumRepliesByPost(req.params.postId);
      res.json(replies);
    } catch (error) {
      console.error("Error fetching forum replies:", error);
      res.status(500).json({ error: "Failed to fetch forum replies" });
    }
  });

  app.post("/api/forum/replies", async (req, res) => {
    try {
      const validatedData = insertForumReplySchema.parse(req.body);
      const reply = await storage.createForumReply(validatedData);
      res.status(201).json(reply);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid reply data", details: error.errors });
      }
      console.error("Error creating forum reply:", error);
      res.status(500).json({ error: "Failed to create forum reply" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard/pvp", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getLeaderboard('pvp', limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching PvP leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch PvP leaderboard" });
    }
  });

  app.get("/api/leaderboard/guilds", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getLeaderboard('guild', limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching guild leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch guild leaderboard" });
    }
  });

  // Player stats
  app.get("/api/player/stats/:userId", async (req, res) => {
    try {
      const stats = await storage.getPlayerStats(req.params.userId);
      if (!stats) {
        return res.status(404).json({ error: "Player stats not found" });
      }
      res.json(stats);
    } catch (error) {
      console.error("Error fetching player stats:", error);
      res.status(500).json({ error: "Failed to fetch player stats" });
    }
  });

  // Discord OAuth endpoints
  app.get("/api/auth/discord", (req, res) => {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = process.env.DISCORD_REDIRECT_URI || `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'http://localhost:5000'}/api/auth/discord/callback`;
    const scope = "identify email guilds";
    
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
    
    res.redirect(authUrl);
  });

  app.get("/api/auth/discord/callback", async (req, res) => {
    try {
      const { code } = req.query;
      
      if (!code) {
        return res.status(400).json({ error: "Missing authorization code" });
      }

      const clientId = process.env.DISCORD_CLIENT_ID;
      const clientSecret = process.env.DISCORD_CLIENT_SECRET;
      const redirectUri = process.env.DISCORD_REDIRECT_URI || `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'http://localhost:5000'}/api/auth/discord/callback`;

      // Exchange code for access token
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId!,
          client_secret: clientSecret!,
          grant_type: 'authorization_code',
          code: code as string,
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        console.error('Discord token error:', tokenData);
        return res.status(400).json({ error: "Failed to exchange code for token" });
      }

      // Get user info from Discord
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      const discordUser = await userResponse.json();

      if (!userResponse.ok) {
        console.error('Discord user error:', discordUser);
        return res.status(400).json({ error: "Failed to fetch user info" });
      }

      // Check if user exists or create new user
      let user = await storage.getUserByDiscordId(discordUser.id);
      
      if (!user) {
        user = await storage.createUser({
          discordId: discordUser.id,
          username: discordUser.username,
          avatar: discordUser.avatar,
          discriminator: discordUser.discriminator,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
        });
      } else {
        // Update existing user with new tokens
        user = await storage.updateUser(user.id, {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          username: discordUser.username,
          avatar: discordUser.avatar,
        });
      }

      // Redirect to frontend with user info
      res.redirect(`/?user=${encodeURIComponent(JSON.stringify(user))}`);
    } catch (error) {
      console.error("Discord OAuth error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
