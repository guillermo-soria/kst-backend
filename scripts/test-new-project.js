const axios = require('axios');

async function testNewProject() {
  try {
    console.log('=== TESTING NEW MEDUSAJS V2 PROJECT ===\n');
    
    const loginData = {
      email: 'admin@kst.test',
      password: 'supersecret'
    };
    
    console.log('Testing login on port 9000...');
    console.log('Credentials:', loginData);
    
    // Try login
    const response = await axios.post('http://localhost:9000/admin/auth', loginData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      validateStatus: (status) => status < 500,
    });
    
    console.log('\nLogin Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200) {
      console.log('\n🎉 SUCCESS! LOGIN WORKS IN NEW PROJECT!');
    } else {
      console.log('\n❌ Login failed, but let\'s check the error...');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

testNewProject();
