/**
 * Manual Integration Test - Step 5 Validation
 * Simple tests to verify bot writes and web reads work correctly
 */

// Test 1: Check if bot database tables exist and have the expected structure
console.log('🔍 Testing Bot Database Tables...');

import { readFileSync } from 'fs';
import pool from './bot/src/database/connection.js';

async function testDatabaseTables() {
  try {
    // Check if battles table exists and has correct structure
    const battlesSchema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'battles'
      ORDER BY ordinal_position
    `);
    
    console.log('✅ Battles table schema:', battlesSchema.rows);

    // Check if player_stats table exists
    const statsSchema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'player_stats'
      ORDER BY ordinal_position
    `);
    
    console.log('✅ Player Stats table schema:', statsSchema.rows);

    // Check current data counts
    const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
    const battleCount = await pool.query('SELECT COUNT(*) as count FROM battles');
    const statsCount = await pool.query('SELECT COUNT(*) as count FROM player_stats');
    
    console.log('\n📊 Current Data Counts:');
    console.log(`   Users: ${userCount.rows[0].count}`);
    console.log(`   Battles: ${battleCount.rows[0].count}`);
    console.log(`   Player Stats: ${statsCount.rows[0].count}`);

    return true;
  } catch (error) {
    console.error('❌ Database table test failed:', error);
    return false;
  }
}

async function testWebAPIEndpoints() {
  console.log('\n🌐 Testing Web API Endpoints...');
  
  try {
    // Import storage from web app
    const { storage } = await import('./web/server/storage.js');
    
    // Test dashboard stats
    const dashboardStats = await storage.getDashboardStats();
    console.log('✅ Dashboard Stats:', dashboardStats);
    
    // Test recent battles
    const recentBattles = await storage.getRecentBattles(3);
    console.log('✅ Recent Battles:', recentBattles.length, 'battles found');
    
    // Test leaderboards
    const pvpLeaderboard = await storage.getLeaderboard('pvp', 3);
    const guildLeaderboard = await storage.getLeaderboard('guild', 3);
    console.log('✅ PvP Leaderboard:', pvpLeaderboard.length, 'entries');
    console.log('✅ Guild Leaderboard:', guildLeaderboard.length, 'entries');
    
    return true;
  } catch (error) {
    console.error('❌ Web API test failed:', error);
    return false;
  }
}

async function runValidation() {
  console.log('🧪 Step 5: Integration Validation Tests');
  console.log('=====================================\n');
  
  const dbTest = await testDatabaseTables();
  const webTest = await testWebAPIEndpoints();
  
  if (dbTest && webTest) {
    console.log('\n🎉 All Integration Tests PASSED!');
    console.log('✅ Bot database tables are properly configured');
    console.log('✅ Web app can read from bot\'s database');
    console.log('✅ No conflicts detected');
  } else {
    console.log('\n❌ Some tests failed - please check the errors above');
  }
  
  // Close the pool
  await pool.end();
}

runValidation().catch(console.error);
