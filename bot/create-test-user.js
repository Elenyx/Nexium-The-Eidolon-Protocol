import { UserService } from './src/services/userService.js';
import pool from './src/database/connection.js';

async function createTestUser() {
  try {
    const testUserId = '123456789012345678'; // Replace with actual Discord user ID
    const testUsername = 'TestUser';

    console.log('Creating test user...');
    const user = await UserService.createUser(testUserId, testUsername);
    console.log('Test user created:', user);

    // Close the pool
    await pool.end();
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();