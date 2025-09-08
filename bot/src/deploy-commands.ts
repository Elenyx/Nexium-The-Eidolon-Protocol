import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { pathToFileURL } from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

interface Command {
  data: any;
  execute: (interaction: any) => Promise<void>;
}

async function deployCommands() {
  const commands: any[] = [];

  // Load command files from dist directory (compiled JavaScript)
  const commandsPath = path.join(process.cwd(), 'dist', 'commands');
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const fileUrl = pathToFileURL(filePath).href;

    try {
      const commandModule = await import(fileUrl);
      const command = commandModule.default;

      if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`✅ Loaded command: ${command.data.name}`);
      } else {
        console.log(`⚠️ Command ${file} is missing 'data' or 'execute' property`);
      }
    } catch (error) {
      console.error(`❌ Error loading command ${file}:`, error);
    }
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

  try {
    console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
      { body: commands },
    );

    console.log(`✅ Successfully reloaded ${(data as any[]).length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error('❌ Error deploying commands:', error);
  }
}

deployCommands();

