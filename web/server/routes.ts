import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { randomUUID } from "crypto";

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
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      console.error("Discord OAuth configuration missing. Please set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in your .env file.");
      return res.status(500).json({ error: "Discord OAuth not configured" });
    }
    
    const redirectUri = process.env.DISCORD_REDIRECT_URI || `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'http://localhost:5000'}/api/auth/discord/callback`;
    const scope = "identify email guilds";
    
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
    
    res.redirect(authUrl);
  });
  
  // Simple demo login for testing (bypasses Discord OAuth)
  app.get("/api/auth/demo-login", async (req, res) => {
    try {
      // Create a demo user if it doesn't exist
      const demoUserId = randomUUID();
      
      // Create a simple user object
      const demoUser = {
        id: demoUserId,
        username: "Demo User",
        avatar: null,
        discordId: "demo-" + Math.floor(Math.random() * 10000),
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      
      // Return success with user info
      res.json({ 
        success: true, 
        user: demoUser
      });
    } catch (error) {
      console.error("Demo login error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.get("/api/auth/discord/callback", async (req, res) => {
    try {
      const { code } = req.query;
      
      if (!code) {
        return res.status(400).json({ error: "Missing authorization code" });
      }

      const clientId = process.env.DISCORD_CLIENT_ID;
      const clientSecret = process.env.DISCORD_CLIENT_SECRET;
      
      if (!clientId || !clientSecret) {
        console.error("Discord OAuth configuration missing. Please set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in your .env file.");
        return res.status(500).json({ error: "Discord OAuth not configured" });
      }
      
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
      let userData;
      try {
        // Check if user exists or create new user
        let user = await storage.getUserByDiscordId(discordUser.id);
        
        if (!user) {
          console.log('Creating new user for Discord ID:', discordUser.id);
          user = await storage.createUser({
            discordId: discordUser.id,
            username: discordUser.username || 'New User',
            avatar: discordUser.avatar,
            // discriminator may be null in newer Discord accounts with the new username system
            discriminator: discordUser.discriminator || null,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
          });
          console.log('User created:', user);
        } else {
          console.log('Updating existing user with ID:', user.id);
          // Update existing user with new tokens
          user = await storage.updateUser(user.id, {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            username: discordUser.username || user.username,
            avatar: discordUser.avatar || user.avatar,
            // Update discriminator if needed (could be null)
            discriminator: discordUser.discriminator,
          });
          console.log('User updated');
        }
        userData = user;
      } catch (error) {
        console.error('Error handling Discord user:', error);
        return res.status(500).json({ error: "Failed to process user data" });
      }

      // Redirect to frontend with user info
      if (userData) {
        res.redirect(`/?user=${encodeURIComponent(JSON.stringify(userData))}`);
      } else {
        res.redirect('/?error=failed-auth');
      }
    } catch (error) {
      console.error("Discord OAuth error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
