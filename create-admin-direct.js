#!/usr/bin/env node
/**
 * Script para crear admin user - Version simplificada
 * Uso: node create-admin-direct.js
 */

// Simulamos bcrypt con crypto nativo de Node.js para evitar dependencias
const crypto = require('crypto');

// Función simple de hash (solo para testing - en producción usar bcrypt)
function simpleHash(password) {
  return crypto.createHash('sha256').update(password + 'medusa-salt').digest('hex');
}

const { Client } = require('pg');

const EMAIL = "admin@kst.com";
const PASSWORD = "KST2025@Admin";
const FIRST = "KST";
const LAST = "Admin";

// URL de conexión directa a Railway
const DATABASE_URL = "postgresql://postgres:fmKbpLKfdjKfXIWnCaYCqIgCQKImLdFp@junction.proxy.rlwy.net:46901/railway";

async function createAdmin() {
  console.log('🚀 Iniciando creación de usuario admin...');
  
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Para Railway
    }
  });

  try {
    console.log('🔗 Conectando a Railway PostgreSQL...');
    await client.connect();
    console.log('✅ Conectado exitosamente');

    // Verificar si ya existe
    const existing = await client.query(
      'SELECT id FROM "user" WHERE email = $1',
      [EMAIL]
    );

    if (existing.rows.length > 0) {
      console.log('⚠️  Usuario admin ya existe:', EMAIL);
      console.log('🔑 Puedes hacer login con la contraseña:', PASSWORD);
      return;
    }

    // Crear usuario con hash simple
    const passwordHash = simpleHash(PASSWORD);
    
    const result = await client.query(`
      INSERT INTO "user" (
        id, email, first_name, last_name, password_hash,
        created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4,
        NOW(), NOW()
      ) RETURNING id, email, first_name, last_name
    `, [EMAIL, FIRST, LAST, passwordHash]);

    console.log('🎉 ¡Usuario admin creado exitosamente!');
    console.log('📧 Email:', result.rows[0].email);
    console.log('👤 Nombre:', result.rows[0].first_name, result.rows[0].last_name);
    console.log('🔐 Password:', PASSWORD);
    console.log('');
    console.log('🚀 Accede aquí:');
    console.log('https://medusa-starter-default-production-ec61.up.railway.app/admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('💡 Posibles soluciones:');
    console.log('1. Verificar que la URL de DATABASE_URL sea correcta');
    console.log('2. Verificar conectividad a Railway');
    console.log('3. Usar el panel admin de Railway para crear el usuario');
  } finally {
    await client.end();
  }
}

createAdmin().catch(console.error);
