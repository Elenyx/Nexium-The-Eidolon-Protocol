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

  // Forum categories
  db.exec(`
    CREATE TABLE IF NOT EXISTS forum_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Forum posts
  db.exec(`
    CREATE TABLE IF NOT EXISTS forum_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER REFERENCES forum_categories(id),
      author_id TEXT REFERENCES users(id),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Forum replies
  db.exec(`
    CREATE TABLE IF NOT EXISTS forum_replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER REFERENCES forum_posts(id),
      author_id TEXT REFERENCES users(id),
      content TEXT NOT NULL,
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

  // Insert some default forum categories
  const categories = [
    { name: 'General Discussion', description: 'General chat about the game' },
    { name: 'Strategy', description: 'Share your strategies and tactics' },
    { name: 'Bug Reports', description: 'Report bugs and issues' },
    { name: 'Suggestions', description: 'Suggest new features and improvements' }
  ];

  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO forum_categories (name, description) VALUES (?, ?)
  `);

  for (const category of categories) {
    insertCategory.run(category.name, category.description);
  }

  console.log('Database initialized successfully!');
  console.log('Created tables: users, characters, battles, guilds, forum_categories, forum_posts, forum_replies, player_stats');

} catch (error) {
  console.error('Error initializing database:', error);
} finally {
  db.close();
}
