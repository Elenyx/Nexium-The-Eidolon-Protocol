import pool from './src/database/connection.js';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Connected to database');
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query successful:', result.rows[0]);
    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();
