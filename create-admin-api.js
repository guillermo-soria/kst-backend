#!/usr/bin/env node
/**
 * Script para crear admin usando Medusa API interno
 */

const https = require('https');
const querystring = require('querystring');

const BACKEND_URL = 'https://medusa-starter-default-production-ec61.up.railway.app';
const ADMIN_DATA = {
  email: 'admin@kst.com',
  password: 'KST2025@Admin',
  first_name: 'KST',
  last_name: 'Admin'
};

async function createAdminViaAPI() {
  console.log('🚀 Intentando crear admin via API...');
  
  // Primero, intentemos ver si hay un endpoint de bootstrap
  const endpoints = [
    '/admin/users',
    '/admin/auth/register', 
    '/admin/invite',
    '/auth/admin/register',
    '/admin/bootstrap'
  ];
  
  for (const endpoint of endpoints) {
    console.log(`🔍 Probando endpoint: ${endpoint}`);
    
    const postData = JSON.stringify(ADMIN_DATA);
    
    const options = {
      hostname: 'medusa-starter-default-production-ec61.up.railway.app',
      port: 443,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    try {
      const response = await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
        });
        
        req.on('error', reject);
        req.write(postData);
        req.end();
      });
      
      console.log(`📝 Status: ${response.status}`);
      
      if (response.status === 200 || response.status === 201) {
        console.log('✅ ¡Admin creado exitosamente!');
        console.log('📧 Email: admin@kst.com');
        console.log('🔐 Password: KST2025@Admin');
        console.log('🚀 Login: https://medusa-starter-default-production-ec61.up.railway.app/admin');
        return;
      }
      
      if (response.status === 409) {
        console.log('⚠️  El usuario admin ya existe');
        console.log('🚀 Intenta hacer login: https://medusa-starter-default-production-ec61.up.railway.app/admin');
        return;
      }
      
    } catch (error) {
      console.log(`❌ Error en ${endpoint}:`, error.message);
    }
  }
  
  console.log('\n💡 Alternativas:');
  console.log('1. Accede directamente a: https://medusa-starter-default-production-ec61.up.railway.app/admin');
  console.log('2. Si hay pantalla de setup, úsala para crear el primer admin');
  console.log('3. Usa Railway Dashboard para conectar a la DB y crear manualmente');
}

createAdminViaAPI().catch(console.error);
