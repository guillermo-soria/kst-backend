const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with credentials from database...\n');
    
    const loginData = {
      email: 'admin@kst.test',
      password: 'supersecret'
    };
    
    console.log('Login attempt with:', loginData);
    console.log('Trying /admin/auth endpoint...\n');
    
    const response = await axios.post('http://localhost:9001/admin/auth', loginData, {
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: function (status) {
        return status < 500; // Don't throw error for 4xx responses
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200) {
      console.log('\n✅ LOGIN SUCCESSFUL!');
    } else {
      console.log('\n❌ LOGIN FAILED');
    }
    
  } catch (error) {
    console.error('Error during login test:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    // Try with different endpoint
    try {
      console.log('\nTrying alternative endpoint /auth/user/emailpass...');
      const response2 = await axios.post('http://localhost:9001/auth/user/emailpass', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: function (status) {
          return status < 500;
        }
      });
      
      console.log('Alternative response status:', response2.status);
      console.log('Alternative response data:', JSON.stringify(response2.data, null, 2));
      
    } catch (error2) {
      console.error('Alternative endpoint also failed:', error2.message);
    }
  }
}

testLogin();
