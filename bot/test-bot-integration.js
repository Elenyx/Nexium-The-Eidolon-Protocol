/**
 * Bot Integration Test - Step 5 Validation
 * Tests that the bot can write to new tables (battles, player_stats)
 */

import { BattleService } from './src/services/battleService.js';
import { PlayerStatsService } from './src/services/playerStatsService.js';
import { UserService } from './src/services/userService.js';
import pool from './src/database/connection.js';

console.log('🤖 Bot Integration Test - Step 5 Validation');
console.log('============================================\n');

async function testBotDatabaseWrites() {
  const testUserId = 'bot-test-user-' + Date.now();
  
  try {
    console.log('🔍 Testing Bot Database Write Operations...');
    
    // Test 1: Create test user
    console.log('1. Creating test user...');
    await UserService.createUser(testUserId, 'BotTestUser');
    console.log('✅ Test user created successfully');

    // Test 2: Create player stats
    console.log('2. Testing PlayerStatsService...');
    const stats = await PlayerStatsService.createPlayerStats(testUserId);
    console.log('✅ Player stats created:', stats.user_id);
    
    // Test 3: Update player stats
    await PlayerStatsService.incrementWins(testUserId);
    await PlayerStatsService.updateRating(testUserId, 1200);
    const updatedStats = await PlayerStatsService.getPlayerStats(testUserId);
    console.log('✅ Player stats updated - Wins:', updatedStats.pvp_wins, 'Rating:', updatedStats.pvp_rating);

    // Test 4: Create battle record
    console.log('3. Testing BattleService...');
    const battle = await BattleService.createBattle({
      winner_id: testUserId,
      loser_id: 'dummy-loser-id',
      battle_type: 'test',
      exp_gained: 100,
      gold_gained: 50,
      items_gained: { 'test_item': 1 }
    });
    console.log('✅ Battle record created:', battle.id);

    // Test 5: Query recent battles
    const recentBattles = await BattleService.getRecentBattles(5);
    console.log('✅ Recent battles retrieved:', recentBattles.length, 'battles');

    // Test 6: Check database table structure
    console.log('4. Verifying database schema...');
    const battlesSchema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'battles'
      ORDER BY ordinal_position
    `);
    
    const statsSchema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'player_stats'
      ORDER BY ordinal_position
    `);
    
    console.log('✅ Battles table columns:', battlesSchema.rows.length);
    console.log('✅ Player stats table columns:', statsSchema.rows.length);

    // Cleanup
    console.log('5. Cleaning up test data...');
    await pool.query('DELETE FROM battles WHERE winner_id = $1', [testUserId]);
    await pool.query('DELETE FROM player_stats WHERE user_id = $1', [testUserId]);
    await pool.query('DELETE FROM users WHERE id = $1', [testUserId]);
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 Bot Integration Test PASSED!');
    console.log('✅ Bot can write to battles table');
    console.log('✅ Bot can write to player_stats table');
    console.log('✅ All bot services working correctly');
    
  } catch (error) {
    console.error('❌ Bot integration test failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

testBotDatabaseWrites()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
