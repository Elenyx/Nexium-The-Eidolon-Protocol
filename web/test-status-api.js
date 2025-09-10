// Test script for the status API endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testStatusEndpoints() {
  console.log('🧪 Testing Nexium Status API Endpoints\n');

  try {
    // Test 1: System Status
    console.log('1️⃣ Testing /api/status...');
    const statusResponse = await fetch(`${BASE_URL}/status`);
    const statusData = await statusResponse.json();
    
    console.log('✅ Status Response:');
    console.log(`   Overall Status: ${statusData.overall}`);
    console.log(`   Services Count: ${statusData.services.length}`);
    statusData.services.forEach(service => {
      console.log(`   - ${service.name}: ${service.status} (${service.responseTime}ms)`);
    });
    console.log(`   Last Updated: ${statusData.lastUpdated}\n`);

    // Test 2: Uptime Stats
    console.log('2️⃣ Testing /api/status/uptime...');
    const uptimeResponse = await fetch(`${BASE_URL}/status/uptime`);
    const uptimeData = await uptimeResponse.json();
    
    console.log('✅ Uptime Stats Response:');
    uptimeData.stats.forEach(stat => {
      console.log(`   - ${stat.service}: ${stat.uptime}% uptime, ${stat.averageResponseTime}ms avg response`);
    });
    console.log();

    // Test 3: Service History (if available)
    console.log('3️⃣ Testing /api/status/history/Database...');
    const historyResponse = await fetch(`${BASE_URL}/status/history/Database`);
    const historyData = await historyResponse.json();
    
    console.log('✅ History Response:');
    console.log(`   Service: ${historyData.service}`);
    console.log(`   History Entries: ${historyData.history.length}`);
    console.log();

    console.log('🎉 All status endpoints are working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
  }
}

// Run the test
testStatusEndpoints();
