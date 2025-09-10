import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from bot's .env file
dotenv.config({ path: path.resolve(__dirname, 'bot', '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function resetDatabase() {
  const client = await pool.connect();
  try {
    console.log('🧹 Starting complete database reset...');
    
    // First, drop all tables to ensure clean slate
    console.log('🗑️ Dropping all existing tables...');
    
    // Get all table names
    const tablesResult = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'pg_%' 
      AND tablename NOT LIKE 'sql_%'
    `);
    
    // Drop each table
    for (const row of tablesResult.rows) {
      try {
        await client.query(`DROP TABLE IF EXISTS "${row.tablename}" CASCADE`);
        console.log(`   Dropped table: ${row.tablename}`);
      } catch (error) {
        console.log(`   Warning: Could not drop ${row.tablename}: ${error.message}`);
      }
    }
    
    // Drop sequences
    const sequencesResult = await client.query(`
      SELECT sequence_name FROM information_schema.sequences 
      WHERE sequence_schema = 'public'
    `);
    
    for (const row of sequencesResult.rows) {
      try {
        await client.query(`DROP SEQUENCE IF EXISTS "${row.sequence_name}" CASCADE`);
        console.log(`   Dropped sequence: ${row.sequence_name}`);
      } catch (error) {
        console.log(`   Warning: Could not drop sequence ${row.sequence_name}: ${error.message}`);
      }
    }

    console.log('✅ All tables and sequences dropped successfully.');
    
    // Now recreate the schema from bot's schema files
    console.log('🏗️ Creating fresh schema...');
    
    // Read and execute the main schema
    const schemaPath = path.resolve(__dirname, 'bot', 'src', 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      // Split the SQL into individual statements and execute them
      const statements = schemaSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (const statement of statements) {
        try {
          await client.query(statement);
        } catch (error) {
          console.log(`   Warning: ${error.message}`);
        }
      }
      console.log('   ✅ Main schema created');
    }
    
    // Execute migration files
    const migrationsDir = path.resolve(__dirname, 'bot', 'src', 'database', 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort(); // Execute in order
      
      for (const file of migrationFiles) {
        try {
          const migrationSql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
          await client.query(migrationSql);
          console.log(`   ✅ Applied migration: ${file}`);
        } catch (error) {
          console.log(`   ⚠️ Migration ${file} failed: ${error.message}`);
        }
      }
    }
    
    // Seed with core data
    console.log('🌱 Seeding with core data...');
    
    const coreDataPath = path.resolve(__dirname, 'bot', 'src', 'database', 'seeds', 'core-data.sql');
    if (fs.existsSync(coreDataPath)) {
      const coreDataSql = fs.readFileSync(coreDataPath, 'utf8');
      await client.query(coreDataSql);
      console.log('   ✅ Core data seeded');
    }
    
    const gameDataPath = path.resolve(__dirname, 'bot', 'src', 'database', 'seeds', 'game-data.sql');
    if (fs.existsSync(gameDataPath)) {
      const gameDataSql = fs.readFileSync(gameDataPath, 'utf8');
      await client.query(gameDataSql);
      console.log('   ✅ Game data seeded');
    }
    
    console.log('🎉 Database reset and seeding completed successfully!');
    
    // Verify the setup
    console.log('🔍 Verifying database setup...');
    const tables = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);
    
    console.log('📋 Tables created:');
    tables.rows.forEach(row => {
      console.log(`   - ${row.tablename}`);
    });
    
  } catch (error) {
    console.error('❌ Error during database reset:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the reset
resetDatabase()
  .then(() => {
    console.log('✅ Database reset completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  });
