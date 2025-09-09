import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../../database/connection.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Read the seed SQL file
    const seedPath = path.join(__dirname, 'seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');

    // Split the SQL into individual statements
    const statements = seedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

// If executed directly, run the seed function
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}


