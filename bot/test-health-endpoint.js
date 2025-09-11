// Quick health endpoint test without starting the full bot
import express from 'express';

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Simple health endpoint simulation
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'nexium-discord-bot',
    version: '1.0.0',
    uptime: process.uptime(),
    port: port
  });
});

app.get('/ping', (req, res) => {
  res.json({ pong: true, timestamp: new Date().toISOString() });
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🏥 Test health server running on port ${port}`);
  
  // Test the endpoint
  setTimeout(async () => {
    try {
      const response = await fetch(`http://localhost:${port}/health`);
      const data = await response.json();
      console.log('✅ Health endpoint test:', data);
      console.log('✅ Health endpoint working correctly!');
      server.close();
    } catch (error) {
      console.error('❌ Health endpoint test failed:', error);
      server.close();
    }
  }, 1000);
});
