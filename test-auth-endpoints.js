#!/usr/bin/env node

/**
 * Test Medusa Auth Endpoints
 */

const readline = require('readline');
const fetch = require('node-fetch');

async function promptForBackendUrl() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n🌐 Backend URL Required');
    console.log('Please provide your Railway backend URL');
    
    rl.question('Backend URL: ', (url) => {
      rl.close();
      resolve(url.trim());
    });
  });
}

async function testAuthEndpoints(backendUrl) {
  const cleanUrl = backendUrl.replace(/\/$/, '');
  
  console.log('🧪 Testing authentication endpoints...');
  
  const endpoints = [
    '/auth/session',
    '/auth/token',
    '/admin/auth/session',  
    '/admin/auth/token',
    '/admin/login',
    '/admin/auth',
    '/api/admin/auth/session',
    '/api/auth/session'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testing ${endpoint}...`);
      
      const response = await fetch(`${cleanUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@kst.test',
          password: 'KST2025@Admin'
        })
      });
      
      console.log(`   Status: ${response.status}`);
      
      if (response.status === 200 || response.status === 201) {
        const result = await response.json();
        console.log('   ✅ SUCCESS!', result);
        return endpoint;
      } else if (response.status === 404) {
        console.log('   ❌ Not found');
      } else if (response.status === 401) {
        console.log('   ⚠️  Unauthorized (endpoint exists but auth failed)');
        const error = await response.text();
        console.log('   Error:', error);
      } else {
        console.log(`   ❓ Status ${response.status}`);
        const text = await response.text();
        console.log('   Response:', text.substring(0, 200));
      }
    } catch (error) {
      console.log(`   💥 Error: ${error.message}`);
    }
  }
  
  return null;
}

async function checkAvailableRoutes(backendUrl) {
  const cleanUrl = backendUrl.replace(/\/$/, '');
  
  console.log('\n🔍 Checking available routes...');
  
  const routes = [
    '/',
    '/admin',
    '/health', 
    '/store',
    '/api',
    '/auth'
  ];
  
  for (const route of routes) {
    try {
      const response = await fetch(`${cleanUrl}${route}`);
      console.log(`${route}: ${response.status} ${response.statusText}`);
      
      if (response.status === 200) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const json = await response.json();
          console.log(`   Response:`, JSON.stringify(json).substring(0, 100));
        }
      }
    } catch (error) {
      console.log(`${route}: Error - ${error.message}`);
    }
  }
}

async function main() {
  console.log('🔍 Medusa Auth Endpoints Test');
  console.log('=============================');
  
  let backendUrl = process.env.BACKEND_URL;
  
  if (!backendUrl) {
    backendUrl = await promptForBackendUrl();
  }
  
  if (!backendUrl) {
    console.log('❌ No backend URL provided. Exiting...');
    process.exit(1);
  }
  
  await checkAvailableRoutes(backendUrl);
  const workingEndpoint = await testAuthEndpoints(backendUrl);
  
  if (workingEndpoint) {
    console.log(`\n🎉 Found working auth endpoint: ${workingEndpoint}`);
  } else {
    console.log('\n💥 No working auth endpoint found');
    console.log('This might indicate:');
    console.log('- Auth module not properly configured');
    console.log('- Different auth provider setup');
    console.log('- Admin UI disabled or misconfigured');
  }
}

if (require.main === module) {
  main().catch(console.error);
}
