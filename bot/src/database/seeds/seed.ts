import pool from '../connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seedDatabase() {
  const client = await pool.connect();
  try {
    console.log('Starting database seed process...');

    // Read and execute schema.sql
    const schemaSql = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');
    await client.query(schemaSql);
    console.log('Schema created successfully.');

    // Read and execute core-data.sql
    const coreDataSql = fs.readFileSync(path.resolve(__dirname, 'core-data.sql'), 'utf8');
    await client.query(coreDataSql);
    console.log('Core data seeded successfully.');

    // Read and execute game-data.sql
    const gameDataSql = fs.readFileSync(path.resolve(__dirname, 'game-data.sql'), 'utf8');
    await client.query(gameDataSql);
    console.log('Game data seeded successfully.');

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    client.release();
    pool.end();
  }
}

seedDatabase();
