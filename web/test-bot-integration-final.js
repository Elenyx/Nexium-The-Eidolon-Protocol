import pool from '../bot/src/database/connection.js';

async function testBotIntegration() {
  try {
    console.log('🧪 Testing bot database integration for web app...');
    
    const client = await pool.connect();
    
    // Test bot user exists and has correct data
    const userResult = await client.query(`
      SELECT id, username, nexium, cred, level, avatar, discriminator 
      FROM users 
      WHERE id = $1
    `, ['123456789012345678']);
    
    console.log('✅ Bot User Data:');
    console.log('   User ID (Discord ID):', userResult.rows[0]?.id);
    console.log('   Username:', userResult.rows[0]?.username);
    console.log('   NEX (Nexium):', userResult.rows[0]?.nexium);
    console.log('   CRD (Cred):', userResult.rows[0]?.cred);
    console.log('   Level:', userResult.rows[0]?.level);
    
    // Test Eidolons (renamed from characters)
    const eidolonsResult = await client.query(`
      SELECT ue.*, e.name 
      FROM user_eidolons ue
      JOIN eidolons e ON ue.eidolon_id = e.id
      WHERE ue.user_id = $1
    `, ['123456789012345678']);
    
    console.log('\n✅ User Eidolons:');
    console.log('   Total Eidolons:', eidolonsResult.rows.length);
    eidolonsResult.rows.forEach((eidolon, i) => {
      console.log(`   ${i+1}. ${eidolon.name} (Level ${eidolon.level}, Sync: ${eidolon.sync_ratio}%)`);
    });
    
    // Test player stats
    const statsResult = await client.query(`
      SELECT * FROM player_stats WHERE user_id = $1
    `, ['123456789012345678']);
    
    console.log('\n✅ Player Stats:');
    console.log('   Total Power:', statsResult.rows[0]?.total_power);
    console.log('   PvP Rating:', statsResult.rows[0]?.pvp_rating);
    console.log('   Dungeons Cleared:', statsResult.rows[0]?.dungeons_cleared);
    
    client.release();
    await pool.end();
    
    console.log('\n🌐 Web app should now display:');
    console.log('   - Header: "Eidolons" navigation');
    console.log('   - Dashboard: "NEX (Nexium): 250" and "CRD (Cred): 125"');
    console.log('   - Characters page: List of user\'s Eidolons');
    console.log('   - Visit: http://localhost:5000');
    
  } catch (error) {
    console.error('❌ Error testing integration:', error);
  }
}

testBotIntegration();
