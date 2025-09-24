#!/usr/bin/env node
/**
 * Script para crear admin usando endpoint interno de Medusa
 * Este script simula el proceso de bootstrap de Medusa
 */

const https = require('https');

const BACKEND_URL = 'medusa-starter-default-production-ec61.up.railway.app';

// Intentar crear admin via diferentes endpoints
async function tryCreateAdmin() {
  console.log('🚀 Intentando crear admin via Medusa internal API...');
  
  const adminData = {
    email: 'admin@kst.com',
    password: 'KST2025@Admin',
    first_name: 'KST',
    last_name: 'Admin'
  };

  // Endpoints posibles para crear admin
  const endpoints = [
    { path: '/admin/auth/register', method: 'POST' },
    { path: '/admin/users', method: 'POST' },
    { path: '/auth/admin/create', method: 'POST' },
    { path: '/admin/invite/accept', method: 'POST' },
    { path: '/admin/bootstrap', method: 'POST' }
  ];

  for (const endpoint of endpoints) {
    console.log(`\n🔍 Probando: ${endpoint.method} ${endpoint.path}`);
    
    try {
      const result = await makeRequest(endpoint.path, endpoint.method, adminData);
      
      if (result.status >= 200 && result.status < 300) {
        console.log('✅ ¡Admin creado exitosamente!');
        console.log('📧 Email: admin@kst.com');
        console.log('🔐 Password: KST2025@Admin');
        console.log('🚀 URL: https://medusa-starter-default-production-ec61.up.railway.app/admin');
        return true;
      }
      
      console.log(`📝 Status: ${result.status}`);
      if (result.data) {
        console.log(`📄 Response:`, JSON.parse(result.data).message || result.data.substring(0, 100));
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  return false;
}

function makeRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: BACKEND_URL,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => resolve({ 
        status: res.statusCode, 
        data: responseData,
        headers: res.headers
      }));
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

tryCreateAdmin().then(success => {
  if (!success) {
    console.log('\n💡 Ningún endpoint funcionó. Opciones:');
    console.log('1. Buscar más tablas en Railway PostgreSQL');
    console.log('2. Revisar la documentación de Medusa v2 auth');
    console.log('3. Verificar si hay semillas/seeds predeterminadas');
  }
}).catch(console.error);
