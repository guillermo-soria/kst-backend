const axios = require('axios');

async function createAdminUser() {
  try {
    console.log('Attempting to create admin user via Medusa API...\n');
    
    // Try to create user via invite endpoint
    console.log('Step 1: Creating invite...');
    
    const inviteData = {
      user: 'admin@kst.test',
      role: 'admin'  
    };
    
    try {
      const inviteResponse = await axios.post('http://localhost:9001/admin/invites', inviteData, {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: function (status) {
          return status < 500;
        }
      });
      
      console.log('Invite response status:', inviteResponse.status);
      console.log('Invite response:', JSON.stringify(inviteResponse.data, null, 2));
      
    } catch (error) {
      console.log('Invite failed:', error.response?.status, error.response?.data);
    }
    
    // Try to register directly
    console.log('\nStep 2: Attempting direct registration...');
    
    const registerData = {
      email: 'admin@kst.test',
      password: 'supersecret',
      first_name: 'Guillermo',
      last_name: 'Soria'
    };
    
    try {
      const registerResponse = await axios.post('http://localhost:9001/admin/auth/register', registerData, {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: function (status) {
          return status < 500;
        }
      });
      
      console.log('Register response status:', registerResponse.status);
      console.log('Register response:', JSON.stringify(registerResponse.data, null, 2));
      
    } catch (error) {
      console.log('Register failed:', error.response?.status, error.response?.data);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createAdminUser();
