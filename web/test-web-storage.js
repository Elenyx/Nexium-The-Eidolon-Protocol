import { getUser, getUserByDiscordId } from './server/storage.js';

async function testWebStorage() {
  try {
    console.log('🧪 Testing web storage with bot database...');
    
    const testDiscordId = '123456789012345678';
    
    // Test getUserByDiscordId
    console.log('\n📋 Testing getUserByDiscordId...');
    const user = await getUserByDiscordId(testDiscordId);
    console.log('User found:', user);
    
    if (user) {
      console.log('✅ Web storage successfully reads from bot database!');
      console.log('   Username:', user.username);
      console.log('   NEX (Nexium):', user.nexium);
      console.log('   CRD (Cred):', user.cred);
      console.log('   Level:', user.level);
      console.log('   Has Discord fields:', user.hasOwnProperty('avatar'), user.hasOwnProperty('discriminator'));
    } else {
      console.log('❌ User not found');
    }
    
  } catch (error) {
    console.error('❌ Error testing web storage:', error);
  }
}

testWebStorage();
