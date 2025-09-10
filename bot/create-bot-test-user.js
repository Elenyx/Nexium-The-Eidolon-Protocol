import pool from './src/database/connection.js';

async function createTestUser() {
  const client = await pool.connect();
  try {
    console.log('🎭 Creating test user in bot database...');
    
    const discordId = '123456789012345678'; // Test Discord ID
    
    // Create test user in bot's users table
    await client.query(`
      INSERT INTO users (id, username, nexium, cred, level, experience, avatar, discriminator, access_token, refresh_token)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET 
        username = EXCLUDED.username,
        nexium = EXCLUDED.nexium,
        cred = EXCLUDED.cred,
        level = EXCLUDED.level,
        experience = EXCLUDED.experience,
        avatar = EXCLUDED.avatar,
        discriminator = EXCLUDED.discriminator,
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token
    `, [discordId, 'TestWeaver', 250, 125, 3, 750, null, null, 'test-access-token', 'test-refresh-token']);
    
    // Add some Eidolons for the test user
    const eidolonsResult = await client.query('SELECT id FROM eidolons LIMIT 3');
    for (const eidolon of eidolonsResult.rows) {
      await client.query(`
        INSERT INTO user_eidolons (user_id, eidolon_id, level, experience, sync_ratio)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [discordId, eidolon.id, 2, 150, 25.5]);
    }
    
    // Create player stats
    await client.query(`
      INSERT INTO player_stats (user_id, total_power, pvp_wins, pvp_losses, pvp_rating, dungeons_cleared, gold, reputation)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id) DO UPDATE SET
        total_power = EXCLUDED.total_power,
        pvp_wins = EXCLUDED.pvp_wins,
        pvp_losses = EXCLUDED.pvp_losses,
        pvp_rating = EXCLUDED.pvp_rating,
        dungeons_cleared = EXCLUDED.dungeons_cleared,
        gold = EXCLUDED.gold,
        reputation = EXCLUDED.reputation
    `, [discordId, 450, 3, 1, 1150, 2, 0, 50]);
    
    console.log('✅ Test user created successfully!');
    console.log('Discord ID (also bot user ID):', discordId);
    
    // Verify data
    const userCheck = await client.query('SELECT id, username, nexium, cred, level, avatar, discriminator FROM users WHERE id = $1', [discordId]);
    const eidolonsCheck = await client.query('SELECT COUNT(*) FROM user_eidolons WHERE user_id = $1', [discordId]);
    const statsCheck = await client.query('SELECT * FROM player_stats WHERE user_id = $1', [discordId]);
    
    console.log('✅ Verification:');
    console.log('   User:', userCheck.rows[0]);
    console.log('   Eidolons Count:', eidolonsCheck.rows[0].count);
    console.log('   Player Stats:', statsCheck.rows[0]);
    
    console.log('');
    console.log('🌐 You can now test the web app at: http://localhost:5000');
    console.log('   The Discord login should create/update this user automatically');
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

createTestUser();
