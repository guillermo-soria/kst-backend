const axios = require('axios');

async function checkAvailableRoutes() {
  try {
    console.log('Checking available routes...\n');
    
    // Test different endpoints
    const endpoints = [
      '/auth',
      '/auth/user',
      '/auth/user/emailpass',
      '/admin/auth',
      '/admin/auth/token',
      '/admin/invite/accept',
      '/store/auth',
      '/store/auth/user',
    ];
    
    for (const endpoint of endpoints) {
      try {
        const url = `http://localhost:9001${endpoint}`;
        console.log(`Testing ${url}...`);
        
        const response = await axios.get(url, {
          validateStatus: function (status) {
            return status < 500; // Don't throw error for 4xx responses
          },
          timeout: 2000
        });
        
        console.log(`  Status: ${response.status}`);
        if (response.data) {
          console.log(`  Response:`, response.data);
        }
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log(`  Error: Connection refused`);
        } else if (error.response) {
          console.log(`  Status: ${error.response.status}`);
          console.log(`  Response:`, error.response.data);
        } else {
          console.log(`  Error: ${error.message}`);
        }
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAvailableRoutes();
