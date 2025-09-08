import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './connection.js';

// ESM-safe __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function wipeAndRebuild() {
  const client = await pool.connect();
  try {
    console.log('🔥 Starting database wipe and rebuild...');
    await client.query('BEGIN');

    // 1. Get all table names in the public schema
    console.log('🔍 Finding all tables to drop...');
    const res = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `);
    const tableNames = res.rows.map(row => row.tablename);

    // 2. Drop all tables
    if (tableNames.length > 0) {
      const dropQuery = tableNames.map(name => `"${name}"`).join(', ');
      console.log(`Dropping tables: ${dropQuery}`);
      await client.query(`DROP TABLE IF EXISTS ${dropQuery} CASCADE`);
      console.log('✅ All existing tables dropped.');
    } else {
      console.log('ℹ️ No tables found to drop.');
    }

    // 3. Re-run the schema.sql file
    console.log('🏗️ Recreating schema from schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSQL);
    console.log('✅ Schema recreated successfully.');

    // 4. Run migrations
    const migrationsDir = path.join(__dirname, 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
      console.log(`📂 Found ${files.length} migration(s).`);
      for (const file of files) {
        const migSQL = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await client.query(migSQL);
        console.log(`✅ Applied migration: ${file}`);
      }
    }

    await client.query('COMMIT');
    console.log('🎉 Database wipe and rebuild complete!');
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('❌ An error occurred during the wipe and rebuild process:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

wipeAndRebuild().catch(() => process.exit(1));
