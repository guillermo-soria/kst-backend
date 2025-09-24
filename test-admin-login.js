#!/usr/bin/env node

/**
 * Test Admin Login Script
 * 
 * This script tests the admin login functionality via API
 */

const readline = require('readline');

async function promptForBackendUrl() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n🌐 Backend URL Required');
    console.log('Please provide your Railway backend URL');
    console.log('Example: https://web-production-1a2b.up.railway.app');
    console.log('(Do NOT include /admin at the end)\n');
    
    rl.question('Backend URL: ', (url) => {
      rl.close();
      resolve(url.trim());
    });
  });
}

async function testAdminLogin(backendUrl) {
  console.log('🧪 Testing admin login...');
  
  // Clean URL (remove trailing slash)
  const cleanUrl = backendUrl.replace(/\/$/, '');
  
  // Test 1: Health check
  console.log('\n📋 Step 1: Testing backend health...');
  try {
    const healthResponse = await fetch(`${cleanUrl}/health`);
    if (healthResponse.ok) {
      const health = await healthResponse.text();
      console.log('✅ Backend is running:', health);
    } else {
      console.log('⚠️  Health check failed:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
    return false;
  }
  
  // Test 2: Admin UI availability
  console.log('\n📋 Step 2: Testing admin UI availability...');
  try {
    const adminResponse = await fetch(`${cleanUrl}/admin`);
    console.log('Admin UI response status:', adminResponse.status);
    
    if (adminResponse.status === 200) {
      console.log('✅ Admin UI is available');
    } else if (adminResponse.status === 404) {
      console.log('⚠️  Admin UI not found (might be disabled)');
    } else {
      console.log('⚠️  Admin UI returned status:', adminResponse.status);
    }
  } catch (error) {
    console.log('❌ Admin UI check failed:', error.message);
  }
  
  // Test 3: Login API
  console.log('\n📋 Step 3: Testing admin login API...');
  try {
    const loginData = {
      email: 'admin@kst.test',
      password: 'KST2025@Admin'
    };
    
    console.log('Attempting login with:', loginData.email);
    
    const loginResponse = await fetch(`${cleanUrl}/auth/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    console.log('Login API response status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const result = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log('Response:', result);
      return true;
    } else {
      const error = await loginResponse.text();
      console.log('❌ Login failed:', error);
      return false;
    }
  } catch (error) {
    console.log('❌ Login API test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🧪 Medusa Admin Login Test');
  console.log('==========================');
  
  let backendUrl = process.env.BACKEND_URL;
  
  if (!backendUrl) {
    backendUrl = await promptForBackendUrl();
  }
  
  if (!backendUrl) {
    console.log('❌ No backend URL provided. Exiting...');
    process.exit(1);
  }
  
  console.log('🔗 Testing backend:', backendUrl);
  
  const success = await testAdminLogin(backendUrl);
  
  if (success) {
    console.log('\n🎉 SUCCESS! Admin login is working correctly.');
    console.log('\n🌐 You can now access the admin panel at:');
    console.log(`   ${backendUrl}/admin`);
    console.log('\n📋 Login with:');
    console.log('   Email: admin@kst.test');
    console.log('   Password: KST2025@Admin');
  } else {
    console.log('\n💥 Login test failed. Check the errors above.');
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Verify backend is running');
    console.log('2. Check DISABLE_MEDUSA_ADMIN environment variable');
    console.log('3. Check database connection');
    console.log('4. Verify admin user was created correctly');
  }
}

// Add fetch polyfill for Node.js < 18
if (typeof fetch === 'undefined') {
  console.log('⚠️  Installing fetch polyfill...');
  global.fetch = require('node-fetch');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
