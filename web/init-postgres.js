import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PostgreSQL connection
const pgUrl = "postgresql://postgres:UrzpIxgDoFWRnMVkgbdUMaYvXZkyGLCD@trolley.proxy.rlwy.net:52172/railway";
const pool = new pg.Pool({ connectionString: pgUrl });

console.log('Connecting to PostgreSQL database...');

async function initPostgresDB() {
  try {
    // Drop existing tables if any to avoid foreign key issues
    await pool.query(`DROP TABLE IF EXISTS characters, battles, guilds, forum_replies, forum_posts, forum_categories, player_stats CASCADE`);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        avatar TEXT,
        discord_id TEXT UNIQUE,
        discriminator TEXT,
        access_token TEXT,
        refresh_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS characters (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        name TEXT NOT NULL,
        level INTEGER DEFAULT 1,
        experience INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS battles (
        id SERIAL PRIMARY KEY,
        winner_id TEXT REFERENCES users(id),
        loser_id TEXT REFERENCES users(id),
        winner_score INTEGER,
        loser_score INTEGER,
        battle_type TEXT DEFAULT 'pvp',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS guilds (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        leader_id TEXT REFERENCES users(id),
        level INTEGER DEFAULT 1,
        total_power INTEGER DEFAULT 0,
        territories INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS forum_categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS forum_posts (
        id SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES forum_categories(id),
        author_id TEXT REFERENCES users(id),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS forum_replies (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES forum_posts(id),
        author_id TEXT REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS player_stats (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        pvp_wins INTEGER DEFAULT 0,
        pvp_losses INTEGER DEFAULT 0,
        pvp_rating INTEGER DEFAULT 1000,
        total_battles INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert some default forum categories
    const categories = [
      { name: 'General Discussion', description: 'General chat about the game' },
      { name: 'Strategy', description: 'Share your strategies and tactics' },
      { name: 'Bug Reports', description: 'Report bugs and issues' },
      { name: 'Suggestions', description: 'Suggest new features and improvements' }
    ];

    for (const category of categories) {
      await pool.query(`
        INSERT INTO forum_categories (name, description) 
        VALUES ($1, $2) 
        ON CONFLICT (name) DO NOTHING
      `, [category.name, category.description]);
    }

    // Migrate data from SQLite if needed
    await migrateFromSQLite();

    console.log('PostgreSQL database initialized successfully!');
  } catch (error) {
    console.error('Error initializing PostgreSQL database:', error);
  } finally {
    await pool.end();
  }
}

async function migrateFromSQLite() {
  try {
    console.log('Checking for data to migrate from SQLite...');
    const dbPath = path.resolve(__dirname, '../shared/data/nexium.db');
    const sqliteDb = new Database(dbPath);
    
    // Check if SQLite has any users
    const userCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM users').get();
    
    if (userCount && userCount.count > 0) {
      console.log(`Found ${userCount.count} users in SQLite, starting migration...`);
      
      // Get users from SQLite
      const users = sqliteDb.prepare('SELECT * FROM users').all();
      
      // Insert into PostgreSQL
      const pgPool = new pg.Pool({ connectionString: pgUrl });
      
      for (const user of users) {
        await pgPool.query(`
          INSERT INTO users (id, username, avatar, discord_id, created_at, last_active) 
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING
        `, [user.id, user.username, user.avatar, user.discord_id, user.created_at, user.last_active]);
      }
      
      await pgPool.end();
      console.log('Migration from SQLite completed successfully!');
    } else {
      console.log('No data found in SQLite to migrate.');
    }
    
    sqliteDb.close();
  } catch (error) {
    console.error('Error during SQLite migration:', error);
  }
}

// Run the initialization
initPostgresDB()
  .then(() => console.log('PostgreSQL setup complete!'))
  .catch(err => console.error('Error during setup:', err));
