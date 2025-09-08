import fs from 'fs';
import path from 'path';
import pool from './connection.js';

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

// Run the seed function
seedDatabase();
