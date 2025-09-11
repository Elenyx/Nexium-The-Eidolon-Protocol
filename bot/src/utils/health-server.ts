import express, { Request, Response } from 'express';
import type { Client } from 'discord.js';

export class HealthServer {
  private app: express.Application;
  private server: any;
  private port: number;
  private botClient: Client;

  constructor(botClient: Client, port: number = 3000) {
    this.app = express();
    this.port = port;
    this.botClient = botClient;
    this.setupRoutes();
  }

  private setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      const isReady = this.botClient.isReady();
      const status = isReady ? 'ok' : 'not_ready';
      const statusCode = isReady ? 200 : 503;

      res.status(statusCode).json({
        status,
        timestamp: new Date().toISOString(),
        service: 'nexium-discord-bot',
        version: '1.0.0',
        uptime: process.uptime(),
        discord: {
          ready: isReady,
          guilds: isReady ? this.botClient.guilds.cache.size : 0,
          users: isReady ? this.botClient.users.cache.size : 0,
          ping: isReady ? this.botClient.ws.ping : null
        }
      });
    });

    // Bot stats endpoint (optional)
    this.app.get('/stats', (req: Request, res: Response) => {
      if (!this.botClient.isReady()) {
        return res.status(503).json({ error: 'Bot not ready' });
      }

      res.json({
        guilds: this.botClient.guilds.cache.size,
        users: this.botClient.users.cache.size,
        channels: this.botClient.channels.cache.size,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        ping: this.botClient.ws.ping
      });
    });

    // Simple ping endpoint
    this.app.get('/ping', (req: Request, res: Response) => {
      res.json({ pong: true, timestamp: new Date().toISOString() });
    });
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(this.port, '0.0.0.0', () => {
          console.log(`🏥 Health server running on port ${this.port}`);
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('🏥 Health server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
