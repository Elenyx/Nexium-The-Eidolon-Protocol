import pool from './src/database/connection.js';

async function createTestUser() {
  const client = await pool.connect();
  try {
    console.log('Creating test user with Eidolons...');
    
    // Create a test user
    const discordId = '123456789012345678'; // Test Discord ID
    await client.query(`
      INSERT INTO users (id, username, nexium, cred, level, experience)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET 
        username = EXCLUDED.username,
        nexium = EXCLUDED.nexium,
        cred = EXCLUDED.cred,
        level = EXCLUDED.level,
        experience = EXCLUDED.experience
    `, [discordId, 'TestWeaver', 250, 125, 3, 750]);
    
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
    
    // Create web app user entry
    await client.query(`
      INSERT INTO users (id, discord_id, username, avatar, discriminator, access_token, refresh_token, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (discord_id) DO UPDATE SET
        username = EXCLUDED.username,
        avatar = EXCLUDED.avatar,
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token
    `, ['web-user-123', discordId, 'TestWeaver', null, null, 'test-token', 'test-refresh']);
    
    console.log('✅ Test user created successfully!');
    console.log('Discord ID:', discordId);
    console.log('Web User ID: web-user-123');
    
    // Verify data
    const userCheck = await client.query('SELECT * FROM users WHERE id = $1', [discordId]);
    const webUserCheck = await client.query('SELECT * FROM users WHERE discord_id = $1', [discordId]);
    const eidolonsCheck = await client.query('SELECT COUNT(*) FROM user_eidolons WHERE user_id = $1', [discordId]);
    const statsCheck = await client.query('SELECT * FROM player_stats WHERE user_id = $1', [discordId]);
    
    console.log('Bot User:', userCheck.rows[0]);
    console.log('Web User:', webUserCheck.rows[0]);
    console.log('Eidolons Count:', eidolonsCheck.rows[0].count);
    console.log('Player Stats:', statsCheck.rows[0]);
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

createTestUser();
