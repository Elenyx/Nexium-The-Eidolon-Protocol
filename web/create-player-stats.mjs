import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// PostgreSQL connection
const pgUrl = process.env.DATABASE_URL || "postgresql://postgres:UrzpIxgDoFWRnMVkgbdUMaYvXZkyGLCD@trolley.proxy.rlwy.net:52172/railway";
const pool = new pg.Pool({ connectionString: pgUrl });

// Simple log function
function log(message) {
  console.log(`${new Date().toISOString()} [script] ${message}`);
}

// Helper function for PostgreSQL queries
async function query(sql, params = []) {
  try {
    const result = await pool.query(sql, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Failed query:', sql);
    console.error('Parameters:', params);
    return { rows: [] };
  }
}

async function createPlayerStats() {
  try {
    // Get all users who don't have player stats
    const usersRes = await query(`SELECT id FROM users`);
    const users = usersRes.rows;
    
    if (users.length === 0) {
      log('No users found');
      return;
    }
    
    log(`Found ${users.length} users`);
    
    // Check existing player stats to avoid duplicates
    const existingStatsRes = await query(`SELECT user_id FROM player_stats`);
    const existingUserIds = existingStatsRes.rows.map(row => row.user_id);
    
    // Create player stats for users who don't have them
    let createdCount = 0;
    
    for (const user of users) {
      if (!existingUserIds.includes(user.id)) {
        await query(`
          INSERT INTO player_stats 
            (user_id, pvp_wins, pvp_losses, pvp_rating, total_battles)
          VALUES 
            ($1, $2, $3, $4, $5)
        `, [user.id, 0, 0, 1000, 0]);
        createdCount++;
      }
    }
    
    log(`Created player stats for ${createdCount} users`);
    
  } catch (error) {
    console.error('Error creating player stats:', error);
  }
}

// Run the function
createPlayerStats()
  .then(() => {
    log('All done!');
    setTimeout(() => process.exit(0), 500);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
