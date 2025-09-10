import pool from './src/database/connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function cleanRailwayDatabase() {
  const client = await pool.connect();
  try {
    console.log('🧹 COMPLETELY CLEANING Railway database to match Bot schema only...');
    
    // First, get ALL tables, views, sequences, etc.
    console.log('🔍 Finding all database objects...');
    
    // Drop all views first
    const viewsResult = await client.query(`
      SELECT viewname FROM pg_views 
      WHERE schemaname = 'public'
    `);
    
    for (const row of viewsResult.rows) {
      try {
        await client.query(`DROP VIEW IF EXISTS "${row.viewname}" CASCADE`);
        console.log(`   ✅ Dropped view: ${row.viewname}`);
      } catch (error) {
        console.log(`   ⚠️ Could not drop view ${row.viewname}: ${error.message}`);
      }
    }
    
    // Drop all tables
    const tablesResult = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'pg_%' 
      AND tablename NOT LIKE 'sql_%'
      ORDER BY tablename
    `);
    
    console.log('🗑️ Dropping ALL existing tables...');
    for (const row of tablesResult.rows) {
      try {
        await client.query(`DROP TABLE IF EXISTS "${row.tablename}" CASCADE`);
        console.log(`   ✅ Dropped table: ${row.tablename}`);
      } catch (error) {
        console.log(`   ⚠️ Could not drop table ${row.tablename}: ${error.message}`);
      }
    }
    
    // Drop all sequences
    const sequencesResult = await client.query(`
      SELECT sequence_name FROM information_schema.sequences 
      WHERE sequence_schema = 'public'
    `);
    
    for (const row of sequencesResult.rows) {
      try {
        await client.query(`DROP SEQUENCE IF EXISTS "${row.sequence_name}" CASCADE`);
        console.log(`   ✅ Dropped sequence: ${row.sequence_name}`);
      } catch (error) {
        console.log(`   ⚠️ Could not drop sequence ${row.sequence_name}: ${error.message}`);
      }
    }
    
    // Drop all functions
    const functionsResult = await client.query(`
      SELECT routine_name FROM information_schema.routines 
      WHERE routine_schema = 'public' 
      AND routine_type = 'FUNCTION'
    `);
    
    for (const row of functionsResult.rows) {
      try {
        await client.query(`DROP FUNCTION IF EXISTS "${row.routine_name}" CASCADE`);
        console.log(`   ✅ Dropped function: ${row.routine_name}`);
      } catch (error) {
        console.log(`   ⚠️ Could not drop function ${row.routine_name}: ${error.message}`);
      }
    }
    
    console.log('✅ Database completely cleaned!');
    
    // Now recreate ONLY the bot's schema
    console.log('🏗️ Creating BOT schema ONLY...');
    
    // Read and execute the bot's main schema
    const schemaPath = path.resolve(__dirname, 'src', 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      // Split the SQL into individual statements
      const statements = schemaSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (const statement of statements) {
        try {
          await client.query(statement);
          console.log(`   ✅ Executed schema statement`);
        } catch (error) {
          console.log(`   ⚠️ Schema statement warning: ${error.message}`);
        }
      }
    }
    
    // Apply bot migrations ONLY
    const migrationsDir = path.resolve(__dirname, 'src', 'database', 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();
      
      for (const file of migrationFiles) {
        try {
          const migrationSql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
          await client.query(migrationSql);
          console.log(`   ✅ Applied bot migration: ${file}`);
        } catch (error) {
          console.log(`   ⚠️ Migration ${file} warning: ${error.message}`);
        }
      }
    }
    
    // Seed with bot's core data ONLY
    console.log('🌱 Seeding with BOT data ONLY...');
    
    const coreDataPath = path.resolve(__dirname, 'src', 'database', 'seeds', 'core-data.sql');
    if (fs.existsSync(coreDataPath)) {
      const coreDataSql = fs.readFileSync(coreDataPath, 'utf8');
      await client.query(coreDataSql);
      console.log('   ✅ Bot core data seeded');
    }
    
    const gameDataPath = path.resolve(__dirname, 'src', 'database', 'seeds', 'game-data.sql');
    if (fs.existsSync(gameDataPath)) {
      const gameDataSql = fs.readFileSync(gameDataPath, 'utf8');
      await client.query(gameDataSql);
      console.log('   ✅ Bot game data seeded');
    }
    
    console.log('🎉 Railway database now contains ONLY bot schema and data!');
    
    // Verify what we have now
    console.log('🔍 Final verification - Tables in database:');
    const finalTables = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);
    
    const botExpectedTables = [
      'users', 'eidolons', 'user_eidolons', 'items', 'user_items',
      'syndicates', 'syndicate_members', 'battles', 'encounters',
      'combat_logs', 'market_listings', 'world_events', 'player_stats'
    ];
    
    console.log('📋 Current tables:');
    finalTables.rows.forEach(row => {
      const isExpected = botExpectedTables.includes(row.tablename);
      console.log(`   ${isExpected ? '✅' : '❌'} ${row.tablename}`);
    });
    
    // Check for any unexpected tables
    const currentTables = finalTables.rows.map(r => r.tablename);
    const unexpectedTables = currentTables.filter(t => !botExpectedTables.includes(t));
    
    if (unexpectedTables.length > 0) {
      console.log('⚠️ Unexpected tables found:');
      unexpectedTables.forEach(table => console.log(`   - ${table}`));
    } else {
      console.log('✅ All tables match expected bot schema!');
    }
    
    // Show record counts
    console.log('📊 Record counts:');
    for (const table of botExpectedTables) {
      if (currentTables.includes(table)) {
        try {
          const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
          console.log(`   ${table}: ${countResult.rows[0].count} records`);
        } catch (error) {
          console.log(`   ${table}: Error checking count`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error during database cleaning:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

cleanRailwayDatabase()
  .then(() => {
    console.log('✅ Railway database successfully cleaned and contains ONLY bot data!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database cleaning failed:', error);
    process.exit(1);
  });
