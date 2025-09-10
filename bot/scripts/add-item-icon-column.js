import pool from '../src/database/connection.js';

async function addColumn() {
  const client = await pool.connect();
  try {
    console.log('🔗 Connected to the database');
    console.log('➡️ Ensuring items.icon column exists...');
    await client.query(`ALTER TABLE items ADD COLUMN IF NOT EXISTS icon VARCHAR(50)`);
    console.log('✅ icon column ensured on items');
  } catch (err) {
    console.error('❌ Failed to add icon column:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

addColumn();
