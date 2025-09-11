#!/usr/bin/env node

// Quick test for health server functionality
import { HealthServer } from './dist/utils/health-server.js';
import { Client } from 'discord.js';

console.log('🧪 Testing Health Server...');

// Create a mock Discord client for testing
const mockClient = new Client({
  intents: []
});

// Mock the isReady method
mockClient.isReady = () => true;

// Mock the guilds cache
mockClient.guilds = { cache: { size: 5 } };
mockClient.users = { cache: { size: 150 } };
mockClient.channels = { cache: { size: 25 } };
mockClient.ws = { ping: 45 };

const healthServer = new HealthServer(mockClient, 3001);

console.log('✅ Health Server created successfully');

// Test starting the server
healthServer.start()
  .then(() => {
    console.log('✅ Health Server started successfully');
    console.log('🌐 Health endpoint available at: http://localhost:3001/health');
    console.log('📊 Stats endpoint available at: http://localhost:3001/stats');
    console.log('🏓 Ping endpoint available at: http://localhost:3001/ping');

    // Stop the server after a brief test
    setTimeout(() => {
      healthServer.stop()
        .then(() => {
          console.log('✅ Health Server stopped successfully');
          console.log('🎉 All tests passed!');
          process.exit(0);
        })
        .catch((error) => {
          console.error('❌ Error stopping server:', error);
          process.exit(1);
        });
    }, 1000);
  })
  .catch((error) => {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  });
