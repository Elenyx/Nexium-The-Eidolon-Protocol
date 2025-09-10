import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// SQLite database path
const DEFAULT_DB_PATH = path.resolve(process.cwd(), "../shared/data/nexium.db");
const sqliteDbPath = process.env.SQLITE_DB_PATH || DEFAULT_DB_PATH;

// PostgreSQL connection
const pgUrl = process.env.DATABASE_URL || "postgresql://postgres:UrzpIxgDoFWRnMVkgbdUMaYvXZkyGLCD@trolley.proxy.rlwy.net:52172/railway";

// Check if SQLite database exists
if (!fs.existsSync(sqliteDbPath)) {
  console.error(`SQLite database does not exist at: ${sqliteDbPath}`);
  process.exit(1);
}

// Connect to SQLite database
console.log(`Connecting to SQLite database at: ${sqliteDbPath}`);
const sqliteDb = new Database(sqliteDbPath);

// Connect to PostgreSQL database
console.log(`Connecting to PostgreSQL database at: ${pgUrl}`);
const pgPool = new pg.Pool({ connectionString: pgUrl });

// Function to get all records from a table in SQLite
function getRecordsFromSqlite(table) {
  try {
    const stmt = sqliteDb.prepare(`SELECT * FROM ${table}`);
    return stmt.all();
  } catch (error) {
    console.error(`Error getting records from ${table}:`, error.message);
    return [];
  }
}

// Function to insert records into PostgreSQL
async function insertIntoPostgres(table, records) {
  if (!records || records.length === 0) {
    console.log(`No records to insert into ${table}`);
    return;
  }
  
  const client = await pgPool.connect();
  
  try {
    // Begin transaction
    await client.query('BEGIN');
    
    console.log(`Migrating ${records.length} records to ${table} table...`);
    
    // Insert each record
    for (const record of records) {
      const columns = Object.keys(record).join(', ');
      const placeholders = Object.keys(record).map((_, i) => `$${i + 1}`).join(', ');
      const values = Object.values(record);
      
      try {
        await client.query(
          `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
          values
        );
      } catch (error) {
        console.error(`Error inserting record into ${table}:`, error.message);
        console.error('Record data:', record);
        // Continue with next record
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    console.log(`Successfully migrated ${records.length} records to ${table}`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Transaction failed for ${table}:`, error.message);
  } finally {
    client.release();
  }
}

async function migrateData() {
  try {
    // Define the tables to migrate in order of dependencies
    const tables = [
      'users',
      'characters',
      'battles',
      'guilds',
      'player_stats'
    ];
    
    // Migrate each table
    for (const table of tables) {
      console.log(`\nMigrating ${table}...`);
      const records = getRecordsFromSqlite(table);
      await insertIntoPostgres(table, records);
    }
    
    console.log('\nMigration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    // Close connections
    sqliteDb.close();
    await pgPool.end();
  }
}

// Run the migration
migrateData().catch(error => {
  console.error('Unhandled error during migration:', error);
  process.exit(1);
});
