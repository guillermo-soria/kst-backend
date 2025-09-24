const axios = require('axios');

async function testFrontendLogin() {
  try {
    console.log('=== TESTING LOGIN LIKE FRONTEND ===\n');
    
    // Step 1: Try to get session info first
    console.log('Step 1: Getting session info...');
    
    try {
      const sessionResponse = await axios.get('http://localhost:9001/admin/auth', {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });
      console.log('Session status:', sessionResponse.status);
      console.log('Session data:', JSON.stringify(sessionResponse.data, null, 2));
    } catch (error) {
      console.log('Session check failed (expected for unauthenticated)');
    }
    
    // Step 2: Try login with form data
    console.log('\nStep 2: Attempting login with form data...');
    
    const formData = new URLSearchParams();
    formData.append('email', 'admin@kst.test');
    formData.append('password', 'supersecret');
    
    try {
      const loginResponse = await axios.post('http://localhost:9001/admin/auth', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });
      
      console.log('Login status:', loginResponse.status);
      console.log('Login headers:', loginResponse.headers);
      console.log('Login data:', JSON.stringify(loginResponse.data, null, 2));
      
    } catch (error) {
      console.log('Form login failed:', error.response?.status, error.response?.data);
    }
    
    // Step 3: Try with JSON payload
    console.log('\nStep 3: Attempting login with JSON payload...');
    
    const jsonPayload = {
      email: 'admin@kst.test',
      password: 'supersecret'
    };
    
    try {
      const jsonLoginResponse = await axios.post('http://localhost:9001/admin/auth', jsonPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });
      
      console.log('JSON login status:', jsonLoginResponse.status);
      console.log('JSON login headers:', jsonLoginResponse.headers);
      console.log('JSON login data:', JSON.stringify(jsonLoginResponse.data, null, 2));
      
      if (jsonLoginResponse.status === 200) {
        console.log('\n✅ LOGIN SUCCESSFUL WITH JSON!');
      }
      
    } catch (error) {
      console.log('JSON login failed:', error.response?.status, error.response?.data);
    }
    
    // Step 4: Test the new auth endpoint
    console.log('\nStep 4: Testing /auth/user/emailpass endpoint...');
    
    try {
      const authResponse = await axios.post('http://localhost:9001/auth/user/emailpass', {
        email: 'admin@kst.test',
        password: 'supersecret'
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: (status) => status < 500,
      });
      
      console.log('Auth endpoint status:', authResponse.status);
      console.log('Auth endpoint data:', JSON.stringify(authResponse.data, null, 2));
      
      if (authResponse.status === 200) {
        console.log('\n✅ AUTH ENDPOINT SUCCESSFUL!');
      }
      
    } catch (error) {
      console.log('Auth endpoint failed:', error.response?.status, error.response?.data);
      console.log('Full error:', error.message);
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testFrontendLogin();
