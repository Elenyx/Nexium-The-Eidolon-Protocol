import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../shared/data/nexium.db');
const db = new Database(dbPath);

console.log('Initializing database tables...');

try {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      avatar TEXT,
      discord_id TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_active DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Characters table (mapping to user_eidolons)
  db.exec(`
    CREATE TABLE IF NOT EXISTS characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT REFERENCES users(id),
      name TEXT NOT NULL,
      level INTEGER DEFAULT 1,
      experience INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Battles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS battles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      winner_id TEXT REFERENCES users(id),
      loser_id TEXT REFERENCES users(id),
      winner_score INTEGER,
      loser_score INTEGER,
      battle_type TEXT DEFAULT 'pvp',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Guilds table (mapping to syndicates)
  db.exec(`
    CREATE TABLE IF NOT EXISTS guilds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      leader_id TEXT REFERENCES users(id),
      level INTEGER DEFAULT 1,
      total_power INTEGER DEFAULT 0,
      territories INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);


  // Player stats
  db.exec(`
    CREATE TABLE IF NOT EXISTS player_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT REFERENCES users(id),
      pvp_wins INTEGER DEFAULT 0,
      pvp_losses INTEGER DEFAULT 0,
      pvp_rating INTEGER DEFAULT 1000,
      total_battles INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);


  console.log('Database initialized successfully!');
  console.log('Created tables: users, characters, battles, guilds, player_stats');

} catch (error) {
  console.error('Error initializing database:', error);
} finally {
  db.close();
}
