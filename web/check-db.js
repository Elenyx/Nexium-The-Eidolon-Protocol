import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../shared/data/nexium.db');
const db = new Database(dbPath);

try {
  const tables = db.prepare('SELECT name FROM sqlite_master WHERE type=\'table\'').all();
  console.log('Tables in database:');
  tables.forEach(table => {
    console.log(`- ${table.name}`);
  });
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
