import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './connection.js';

// ESM-safe __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function initDatabase(): Promise<void> {
  try {
    console.log('\u2699\ufe0f Initializing database schema...');

    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.warn('No schema.sql found at', schemaPath);
      return;
    }

    const sql = fs.readFileSync(schemaPath, 'utf8');

    // Split on semicolons and run each statement (simple, works for this schema)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const stmt of statements) {
      try {
        await pool.query(stmt);
      } catch (err: any) {
        // Log and continue - many CREATE TABLE IF NOT EXISTS statements are idempotent
        console.error('\u274c Error running statement:', err?.message || err);
      }
    }

    // Run any migration SQL files found in migrations/
    const migrationsDir = path.join(__dirname, 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
      for (const file of files) {
        try {
          const migSQL = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
          await pool.query(migSQL);
          console.log(`\u2705 Applied migration: ${file}`);
        } catch (err: any) {
          console.error(`\u274c Migration ${file} failed:`, err?.message || err);
        }
      }
    }

    console.log('\u2705 Database schema applied (CREATE TABLE IF NOT EXISTS).');
  } catch (error) {
    console.error('\u274c Failed to initialize database schema:', error);
    throw error;
  }
}

// If this file is executed directly (e.g. via `npx tsx src/database/init.ts`), run the initializer.

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFilePath)) {
  initDatabase()
    .then(() => {
      console.log('\u2705 init finished');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Init failed:', err);
      process.exit(1);
    });
}
