#!/usr/bin/env node

// Railway Deployment Validation Script for Nexium Status System
// Run this after deployment to verify everything is working

const https = require('https');
const http = require('http');

const DOMAIN = 'nexium-rpg.win';
const ENDPOINTS = {
  website: `https://${DOMAIN}`,
  status: `https://${DOMAIN}/status`,
  api: `https://${DOMAIN}/api/status`,
  uptime: `https://${DOMAIN}/api/status/uptime`
};

console.log('🚀 Validating Nexium Status System Deployment on Railway...\n');

async function checkEndpoint(name, url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https:') ? https : http;
    const start = Date.now();
    
    protocol.get(url, (res) => {
      const responseTime = Date.now() - start;
      const status = res.statusCode === 200 ? '✅' : '❌';
      
      console.log(`${status} ${name}: ${res.statusCode} (${responseTime}ms)`);
      console.log(`   URL: ${url}`);
      
      if (res.statusCode === 200) {
        resolve({ success: true, responseTime });
      } else {
        resolve({ success: false, responseTime, statusCode: res.statusCode });
      }
    }).on('error', (err) => {
      const responseTime = Date.now() - start;
      console.log(`❌ ${name}: ERROR (${responseTime}ms)`);
      console.log(`   URL: ${url}`);
      console.log(`   Error: ${err.message}`);
      resolve({ success: false, responseTime, error: err.message });
    });
  });
}

async function validateDeployment() {
  const results = {};
  
  console.log('📡 Checking endpoints...\n');
  
  for (const [name, url] of Object.entries(ENDPOINTS)) {
    results[name] = await checkEndpoint(name, url);
    console.log(''); // Add spacing
  }
  
  console.log('📊 Summary:');
  console.log('=' .repeat(50));
  
  const successful = Object.values(results).filter(r => r.success).length;
  const total = Object.keys(results).length;
  
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log('\n🎉 All systems operational! Status monitoring is working correctly.');
    console.log(`Visit https://${DOMAIN}/status to see your live status dashboard.`);
  } else {
    console.log('\n⚠️  Some endpoints are not responding. Check Railway deployment logs.');
    console.log('Run: railway logs --service web');
  }
  
  console.log('\n🔍 Next steps:');
  console.log('1. Check the status dashboard for service health');
  console.log('2. Verify database connectivity shows as operational');  
  console.log('3. Confirm bot status updates when users interact with Discord bot');
  console.log('4. Set up Uptime Kuma for external monitoring');
}

validateDeployment().catch(console.error);
