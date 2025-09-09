import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// PostgreSQL connection
const pgUrl = "postgresql://postgres:UrzpIxgDoFWRnMVkgbdUMaYvXZkyGLCD@trolley.proxy.rlwy.net:52172/railway";
const pool = new pg.Pool({ connectionString: pgUrl });

console.log('Connecting to PostgreSQL database...');

async function recreateSchema() {
  const client = await pool.connect();
  
  try {
    // Start a transaction
    await client.query('BEGIN');
    
    console.log('Dropping existing tables...');
    await client.query(`
      DROP TABLE IF EXISTS player_stats CASCADE;
      DROP TABLE IF EXISTS forum_replies CASCADE;
      DROP TABLE IF EXISTS forum_posts CASCADE;
      DROP TABLE IF EXISTS forum_categories CASCADE;
      DROP TABLE IF EXISTS characters CASCADE;
      DROP TABLE IF EXISTS battles CASCADE;
      DROP TABLE IF EXISTS guilds CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    
    console.log('Creating users table...');
    await client.query(`
      CREATE TABLE users (
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
    
    console.log('Creating characters table...');
    await client.query(`
      CREATE TABLE characters (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        name TEXT NOT NULL,
        level INTEGER DEFAULT 1,
        experience INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Creating battles table...');
    await client.query(`
      CREATE TABLE battles (
        id SERIAL PRIMARY KEY,
        winner_id TEXT REFERENCES users(id),
        loser_id TEXT REFERENCES users(id),
        winner_score INTEGER,
        loser_score INTEGER,
        battle_type TEXT DEFAULT 'pvp',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Creating guilds table...');
    await client.query(`
      CREATE TABLE guilds (
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
    
    console.log('Creating forum tables...');
    await client.query(`
      CREATE TABLE forum_categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
      CREATE TABLE forum_posts (
        id SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES forum_categories(id),
        author_id TEXT REFERENCES users(id),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
      CREATE TABLE forum_replies (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES forum_posts(id),
        author_id TEXT REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Creating player_stats table...');
    await client.query(`
      CREATE TABLE player_stats (
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
    console.log('Adding default forum categories...');
    const categories = [
      { name: 'General Discussion', description: 'General chat about the game' },
      { name: 'Strategy', description: 'Share your strategies and tactics' },
      { name: 'Bug Reports', description: 'Report bugs and issues' },
      { name: 'Suggestions', description: 'Suggest new features and improvements' }
    ];
    
    for (const category of categories) {
      await client.query(`
        INSERT INTO forum_categories (name, description) 
        VALUES ($1, $2)
      `, [category.name, category.description]);
    }
    
    // Commit the transaction
    await client.query('COMMIT');
    console.log('PostgreSQL database schema created successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating PostgreSQL database schema:', error);
  } finally {
    client.release();
  }
}

// Run the schema recreation
recreateSchema()
  .then(() => {
    console.log('All done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });
