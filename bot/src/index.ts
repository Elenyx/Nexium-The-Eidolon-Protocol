import { Client, GatewayIntentBits, Collection, Events, REST, Routes, ActivityType } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { initDatabase } from './database/init.js';
import { HealthServer } from './utils/health-server.js';

dotenv.config();

interface Command {
  data: any;
  execute: (interaction: any) => Promise<void>;
}

class NexiumBot {
  public client: Client;
  private commands: Collection<string, Command>;
  private activities: Array<{ name: string; type: ActivityType }>;
  private activityIndex: number = 0;
  public healthServer: HealthServer;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });
    
    this.commands = new Collection();
    this.healthServer = new HealthServer(this.client);
    
    // Activity rotation for the bot status
    this.activities = [
      { name: 'the Eidolon Protocol', type: ActivityType.Watching },
      { name: 'Nexium RPG', type: ActivityType.Playing },
      { name: 'Neo-Avalon frequencies', type: ActivityType.Listening },
      { name: 'data weaving patterns', type: ActivityType.Watching },
      { name: 'with spectral entities', type: ActivityType.Playing },
      { name: 'anomaly reports', type: ActivityType.Watching },
      { name: 'Syndicate communications', type: ActivityType.Listening }
    ];
  }

  async loadCommands(): Promise<void> {
    // Detect if we're running from dist (compiled) or src (development)
    const currentFile = import.meta.url;
    const isRunningFromDist = currentFile.includes('/dist/') || currentFile.includes('\\dist\\');
    const isProduction = process.env.NODE_ENV === 'production' || isRunningFromDist;
    
    const commandsPath = isProduction 
      ? path.join(process.cwd(), 'dist', 'commands')
      : path.join(process.cwd(), 'src', 'commands');
    
    const fileExtension = isProduction ? '.js' : '.ts';
    const commandFiles = readdirSync(commandsPath).filter(file => 
      file.endsWith(fileExtension)
    );

    console.log(`Environment: ${process.env.NODE_ENV || 'undefined'} (detected ${isProduction ? 'production' : 'development'})`);
    console.log(`Loading commands from: ${commandsPath}`);
    console.log(`Looking for files with extension: ${fileExtension}`);
    console.log(`Found ${commandFiles.length} command files:`, commandFiles);

    for (const file of commandFiles) {
      try {
        // Use relative import path instead of pathToFileURL
        const commandPath = `./commands/${file}`;
        
        const commandModule = await import(commandPath);
        const command = commandModule.default;
        
        if ('data' in command && 'execute' in command) {
          this.commands.set(command.data.name, command);
          console.log(`✅ Loaded command: ${command.data.name}`);
        } else {
          console.log(`⚠️ Command ${file} is missing 'data' or 'execute' property`);
        }
      } catch (error) {
        console.error(`❌ Error loading command ${file}:`, error);
      }
    }
  }

  async deployCommands(): Promise<void> {
    const commands = Array.from(this.commands.values()).map(command => command.data.toJSON());
    
    const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

    try {
      console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);

      const data = await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
        { body: commands }
      );

      console.log(`✅ Successfully reloaded ${(data as any[]).length} application (/) commands.`);
    } catch (error) {
      console.error('❌ Error deploying commands:', error);
    }
  }

  setupEventHandlers(): void {
    this.client.once(Events.ClientReady, async (readyClient) => {
      console.log(`🤖 Nexium RPG Bot is online as ${readyClient.user.tag}!`);
      console.log(`📊 Serving ${readyClient.guilds.cache.size} guilds`);
      
      // Start activity rotation
      this.rotateActivity();
      setInterval(() => this.rotateActivity(), 30000); // Change every 30 seconds
    });

    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (interaction.isChatInputCommand()) {
        const command = this.commands.get(interaction.commandName);
        if (!command) {
          console.error(`❌ No command matching ${interaction.commandName} was found.`);
          return;
        }

        try {
          await command.execute(interaction);
          console.log(`✅ ${interaction.user.tag} used /${interaction.commandName}`);
        } catch (error) {
          console.error(`❌ Error executing command ${interaction.commandName}:`, error);
          
          const errorMessage = {
            content: '❌ There was an error while executing this command!',
            ephemeral: true
          };

          if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
          } else {
            await interaction.reply(errorMessage);
          }
        }
      } else if (interaction.isButton()) {
        // Handle button interactions (for PvP duels, etc.)
        await this.handleButtonInteraction(interaction);
      }
    });

    this.client.on(Events.Error, (error) => {
      console.error('❌ Discord client error:', error);
    });
  }

  rotateActivity(): void {
    const activity = this.activities[this.activityIndex];
    this.client.user?.setActivity(activity.name, { type: activity.type });
    this.activityIndex = (this.activityIndex + 1) % this.activities.length;
  }

  async handleButtonInteraction(interaction: any): Promise<void> {
    const customId = interaction.customId;

    try {
      if (customId.startsWith('pvp_accept_')) {
        await this.handlePvpAccept(interaction, customId);
      } else if (customId.startsWith('pvp_decline_')) {
        await this.handlePvpDecline(interaction, customId);
      } else if (customId.startsWith('duel_')) {
        await this.handleDuelAction(interaction, customId);
      }
    } catch (error) {
      console.error('❌ Error handling button interaction:', error);
      await interaction.reply({
        content: '❌ An error occurred while processing your action!',
        ephemeral: true
      });
    }
  }

  async handlePvpAccept(interaction: any, customId: string): Promise<void> {
    // This is handled in the PvP command, but we can add additional logic here if needed
    await interaction.reply({
      content: '✅ Challenge accepted! Use `/pvp accept` to proceed.',
      ephemeral: true
    });
  }

  async handlePvpDecline(interaction: any, customId: string): Promise<void> {
    // This is handled in the PvP command, but we can add additional logic here if needed
    await interaction.reply({
      content: '❌ Challenge declined.',
      ephemeral: true
    });
  }

  async handleDuelAction(interaction: any, customId: string): Promise<void> {
    // Import PvP duel handling logic here
    const pvpModule = await import('./commands/pvp.js');
    if (pvpModule.handleDuelAction) {
      await pvpModule.handleDuelAction(interaction, customId);
    }
  }

  async start(): Promise<void> {
    try {
      // Start health server first
      await this.healthServer.start();
      
      // Ensure DB schema is created/updated before loading commands that may touch the DB
      await initDatabase();
      await this.loadCommands();
      await this.deployCommands();
      this.setupEventHandlers();
      await this.client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
      console.error('❌ Failed to start bot:', error);
      process.exit(1);
    }
  }
}

// Start the bot
const bot = new NexiumBot();
bot.start().catch(console.error);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Received SIGINT, shutting down gracefully...');
  await bot.healthServer?.stop();
  bot.client?.destroy();
  process.exit(0);
});

export default bot;

