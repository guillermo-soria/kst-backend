#!/usr/bin/env node

/**
 * Comprehensive Admin Diagnosis Script
 * 
 * This script performs a complete diagnosis of the admin setup
 */

const fetch = require('node-fetch');
const readline = require('readline');

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

async function diagnosisAdmin(backendUrl) {
  const cleanUrl = backendUrl.replace(/\/$/, '');
  
  console.log('🔍 COMPREHENSIVE ADMIN DIAGNOSIS');
  console.log('================================');
  console.log('Backend URL:', cleanUrl);
  
  // 1. Test basic health
  console.log('\n📋 1. Backend Health Check');
  try {
    const healthResponse = await fetch(`${cleanUrl}/health`);
    const health = await healthResponse.text();
    console.log('✅ Status:', healthResponse.status);
    console.log('✅ Response:', health);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }
  
  // 2. Test admin UI routes
  console.log('\n📋 2. Admin UI Routes');
  const adminRoutes = ['/admin', '/admin/', '/admin/login', '/admin/auth'];
  
  for (const route of adminRoutes) {
    try {
      const response = await fetch(`${cleanUrl}${route}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0'
        }
      });
      
      console.log(`${route}: ${response.status} ${response.statusText}`);
      
      if (response.status === 200) {
        const contentType = response.headers.get('content-type');
        console.log(`  Content-Type: ${contentType}`);
        if (contentType && contentType.includes('text/html')) {
          const html = await response.text();
          if (html.includes('admin') || html.includes('login') || html.includes('medusa')) {
            console.log('  ✅ Contains admin-related content');
          } else {
            console.log('  ⚠️  No admin content detected');
          }
        }
      }
    } catch (error) {
      console.log(`${route}: ❌ Error - ${error.message}`);
    }
  }
  
  // 3. Test authentication endpoints with different patterns
  console.log('\n📋 3. Authentication Endpoints');
  const authEndpoints = [
    { path: '/auth/session', method: 'POST', desc: 'Medusa v2 auth endpoint' },
    { path: '/admin/auth/session', method: 'POST', desc: 'Admin auth endpoint' },
    { path: '/admin/auth', method: 'POST', desc: 'Simple admin auth' },
    { path: '/auth/user/emailpass', method: 'POST', desc: 'EmailPass provider' },
    { path: '/admin/auth/user/emailpass', method: 'POST', desc: 'Admin EmailPass' },
  ];
  
  const credentials = {
    email: 'admin@kst.test',
    password: 'KST2025@Admin'
  };
  
  for (const endpoint of authEndpoints) {
    try {
      console.log(`\nTesting ${endpoint.path} (${endpoint.desc})`);
      
      const response = await fetch(`${cleanUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      
      console.log(`  Status: ${response.status} ${response.statusText}`);
      
      if (response.status === 200 || response.status === 201) {
        try {
          const result = await response.json();
          console.log('  ✅ SUCCESS! Response:', JSON.stringify(result, null, 2));
          return endpoint.path; // Return successful endpoint
        } catch (e) {
          console.log('  ✅ SUCCESS but response is not JSON');
        }
      } else if (response.status === 404) {
        console.log('  ❌ Endpoint not found');
      } else if (response.status === 400) {
        const error = await response.text();
        console.log('  ⚠️  Bad Request:', error.substring(0, 200));
      } else if (response.status === 401) {
        const error = await response.text();
        console.log('  ⚠️  Unauthorized:', error.substring(0, 200));
      } else {
        const error = await response.text();
        console.log(`  ❓ Status ${response.status}:`, error.substring(0, 200));
      }
    } catch (error) {
      console.log(`  💥 Error: ${error.message}`);
    }
  }
  
  // 4. Test with different credential formats
  console.log('\n📋 4. Testing Different Credential Formats');
  
  const credentialFormats = [
    { email: 'admin@kst.test', password: 'KST2025@Admin', desc: 'Standard format' },
    { identifier: 'admin@kst.test', password: 'KST2025@Admin', desc: 'Identifier format' },
    { username: 'admin@kst.test', password: 'KST2025@Admin', desc: 'Username format' },
  ];
  
  for (const creds of credentialFormats) {
    try {
      console.log(`\nTrying /auth/session with ${creds.desc}`);
      
      const response = await fetch(`${cleanUrl}/auth/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(creds)
      });
      
      console.log(`  Status: ${response.status}`);
      
      if (response.status === 200 || response.status === 201) {
        const result = await response.json();
        console.log('  ✅ SUCCESS!', result);
        return '/auth/session';
      } else {
        const error = await response.text();
        console.log(`  Response:`, error.substring(0, 150));
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
  
  // 5. Check if modules are loaded
  console.log('\n📋 5. Module Information Check');
  try {
    const moduleEndpoints = ['/modules', '/admin/modules', '/_modules'];
    
    for (const endpoint of moduleEndpoints) {
      const response = await fetch(`${cleanUrl}${endpoint}`);
      console.log(`${endpoint}: ${response.status}`);
      
      if (response.status === 200) {
        try {
          const modules = await response.json();
          console.log('  Modules:', modules);
        } catch (e) {
          console.log('  Response not JSON');
        }
      }
    }
  } catch (error) {
    console.log('Module check failed:', error.message);
  }
  
  console.log('\n🔍 DIAGNOSIS COMPLETE');
  console.log('====================');
  console.log('No working authentication endpoint found.');
  console.log('\nPossible issues:');
  console.log('1. ⚠️  Auth module not properly loaded');
  console.log('2. ⚠️  Environment variables missing');
  console.log('3. ⚠️  CORS configuration blocking requests');
  console.log('4. ⚠️  Different auth provider expected');
  console.log('5. ⚠️  Admin user not properly created in database');
  
  return null;
}

async function main() {
  console.log('🔍 Comprehensive Medusa Admin Diagnosis');
  console.log('=======================================');
  
  let backendUrl = process.env.BACKEND_URL;
  
  if (!backendUrl) {
    backendUrl = await promptForBackendUrl();
  }
  
  if (!backendUrl) {
    console.log('❌ No backend URL provided. Exiting...');
    process.exit(1);
  }
  
  const workingEndpoint = await diagnosisAdmin(backendUrl);
  
  if (workingEndpoint) {
    console.log(`\n🎉 Found working endpoint: ${workingEndpoint}`);
  } else {
    console.log('\n💡 Next steps:');
    console.log('1. Check Railway deployment logs for errors');
    console.log('2. Verify environment variables are set');
    console.log('3. Check if admin module is properly configured');
    console.log('4. Consider trying manual database user creation');
  }
}

if (require.main === module) {
  main().catch(console.error);
}
