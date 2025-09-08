import { Client, GatewayIntentBits, Collection, Events, REST, Routes, ActivityType } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

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

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });
    
    this.commands = new Collection();
    
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
    // In production, use dist directory; in development, use src directory
    // Default to production if NODE_ENV is not set (common in deployment environments)
    const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV == null;
    const commandsPath = isProduction 
      ? path.join(process.cwd(), 'dist', 'commands')
      : path.join(process.cwd(), 'src', 'commands');
    
    const fileExtension = isProduction ? '.js' : '.ts';
    const commandFiles = readdirSync(commandsPath).filter(file => 
      file.endsWith(fileExtension) || (!isProduction && file.endsWith('.js'))
    );

    console.log(`Environment: ${process.env.NODE_ENV || 'undefined (defaulting to production)'}`);
    console.log(`Loading commands from: ${commandsPath}`);
    console.log(`Looking for files with extension: ${fileExtension}`);
    console.log(`Found ${commandFiles.length} command files:`, commandFiles);

    for (const file of commandFiles) {
      try {
        // Use relative import path instead of pathToFileURL
        const commandPath = isProduction 
          ? `./commands/${file}`
          : `./commands/${file}`;
        
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
      if (!interaction.isChatInputCommand()) return;

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

  async start(): Promise<void> {
    try {
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
process.on('SIGINT', () => {
  console.log('🔄 Received SIGINT, shutting down gracefully...');
  bot.client?.destroy();
  process.exit(0);
});

export default bot;

