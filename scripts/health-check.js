#!/usr/bin/env node

const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:9000';

function checkHealth() {
  console.log('🏥 Checking backend health...\n');

  const options = {
    hostname: new URL(BACKEND_URL).hostname,
    port: new URL(BACKEND_URL).port || (new URL(BACKEND_URL).protocol === 'https:' ? 443 : 80),
    path: '/health',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const healthData = JSON.parse(data);
        
        console.log('✅ Health Check Results:');
        console.log(`   Status: ${healthData.status}`);
        console.log(`   Message: ${healthData.message}`);
        console.log(`   Environment: ${healthData.environment}`);
        console.log(`   Version: ${healthData.version}`);
        console.log(`   Database: ${healthData.database}`);
        console.log(`   Timestamp: ${healthData.timestamp}\n`);

        if (healthData.status === 'ok') {
          console.log('🎉 Backend is ready for deployment!');
          process.exit(0);
        } else {
          console.log('❌ Backend health check failed');
          process.exit(1);
        }
      } catch (error) {
        console.log('❌ Failed to parse health check response:', error.message);
        console.log('Raw response:', data);
        process.exit(1);
      }
    });
  });

  req.on('error', (error) => {
    console.log(`❌ Health check failed: ${error.message}`);
    console.log('Make sure the backend is running on:', BACKEND_URL);
    process.exit(1);
  });

  req.end();
}

console.log(`🔍 Checking backend health at: ${BACKEND_URL}`);
checkHealth();
