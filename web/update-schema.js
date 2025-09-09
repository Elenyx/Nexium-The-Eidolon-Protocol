import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../shared/data/nexium.db');
const db = new Database(dbPath);

console.log('Updating SQLite database schema...');

try {
  // Update users table to add missing columns
  db.exec(`
    ALTER TABLE users ADD COLUMN discriminator TEXT;
    ALTER TABLE users ADD COLUMN access_token TEXT;
    ALTER TABLE users ADD COLUMN refresh_token TEXT;
  `);

  console.log('SQLite database schema updated successfully!');
} catch (error) {
  // SQLite error code 1 means "column already exists"
  if (error.code !== 1) {
    console.error('Error updating SQLite schema:', error);
  } else {
    console.log('Columns already exist, continuing...');
  }
} finally {
  db.close();
}
