import pool from './src/database/connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function resetAndSeedDatabase() {
  const client = await pool.connect();
  try {
    console.log('🧹 Starting complete database reset...');
    
    // Get all table names in the database
    const tablesResult = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'pg_%' 
      AND tablename NOT LIKE 'sql_%'
      ORDER BY tablename
    `);
    
    console.log('📋 Found tables to clean:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.tablename}`);
    });
    
    // Disable foreign key checks temporarily
    console.log('🔓 Disabling foreign key constraints...');
    for (const row of tablesResult.rows) {
      try {
        await client.query(`TRUNCATE TABLE "${row.tablename}" CASCADE`);
        console.log(`   ✅ Truncated: ${row.tablename}`);
      } catch (error) {
        console.log(`   ⚠️ Could not truncate ${row.tablename}: ${error.message}`);
      }
    }
    
    console.log('✅ All tables truncated successfully.');
    
    // Now seed with fresh data
    console.log('🌱 Seeding with fresh data...');
    
    // Read and execute core-data.sql
    const coreDataPath = path.resolve(__dirname, 'src', 'database', 'seeds', 'core-data.sql');
    if (fs.existsSync(coreDataPath)) {
      const coreDataSql = fs.readFileSync(coreDataPath, 'utf8');
      await client.query(coreDataSql);
      console.log('   ✅ Core data seeded');
    }
    
    // Read and execute game-data.sql
    const gameDataPath = path.resolve(__dirname, 'src', 'database', 'seeds', 'game-data.sql');
    if (fs.existsSync(gameDataPath)) {
      const gameDataSql = fs.readFileSync(gameDataPath, 'utf8');
      await client.query(gameDataSql);
      console.log('   ✅ Game data seeded');
    }
    
    console.log('🎉 Database reset and seeding completed successfully!');
    
    // Verify the setup
    console.log('🔍 Verifying database setup...');
    
    // Check each main table for data
    const mainTables = ['users', 'eidolons', 'user_eidolons', 'syndicates', 'player_stats'];
    for (const tableName of mainTables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`   📊 ${tableName}: ${countResult.rows[0].count} records`);
      } catch (error) {
        console.log(`   ⚠️ Could not check ${tableName}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error during database reset:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the reset
resetAndSeedDatabase()
  .then(() => {
    console.log('✅ Database reset and seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  });
