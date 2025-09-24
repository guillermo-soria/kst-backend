#!/usr/bin/env node
/**
 * Script simple para crear usuario admin directamente en PostgreSQL
 * Para usar: node scripts/create-admin-simple.js
 */
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const EMAIL = process.env.ADMIN_EMAIL || "admin@kst.test";
const PASSWORD = process.env.ADMIN_PASSWORD || "UnaClaveFuerte123";
const FIRST = process.env.ADMIN_FIRST || "Guillermo";
const LAST = process.env.ADMIN_LAST || "Soria";

async function createAdmin() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('🔗 Conectado a la base de datos');

    // Crear las tablas si no existen (schema básico)
    await client.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email VARCHAR UNIQUE NOT NULL,
        first_name VARCHAR,
        last_name VARCHAR,
        avatar_url VARCHAR,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "auth_identity" (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        entity_id VARCHAR NOT NULL,
        provider_id VARCHAR NOT NULL,
        provider VARCHAR NOT NULL,
        actor_type VARCHAR DEFAULT 'user',
        auth_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE,
        UNIQUE(provider, provider_id, actor_type)
      );
    `);

    console.log('📊 Tablas creadas/verificadas');

    // Verificar si el usuario ya existe
    const existingUser = await client.query(
      'SELECT id FROM "user" WHERE email = $1',
      [EMAIL]
    );

    if (existingUser.rows.length > 0) {
      console.log(`✅ Ya existe un usuario con email ${EMAIL}:`, existingUser.rows[0].id);
      return;
    }

    // Crear usuario
    const userResult = await client.query(`
      INSERT INTO "user" (email, first_name, last_name, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id
    `, [EMAIL, FIRST, LAST]);

    const userId = userResult.rows[0].id;
    console.log('👤 Usuario creado con ID:', userId);

    // Hash de la contraseña
    const hash = await bcrypt.hash(PASSWORD, 10);

    // Crear identidad de autenticación
    await client.query(`
      INSERT INTO "auth_identity" (entity_id, provider_id, provider, actor_type, auth_data, created_at, updated_at)
      VALUES ($1, $2, 'emailpass', 'user', $3, NOW(), NOW())
    `, [userId, EMAIL, JSON.stringify({ password: hash })]);

    console.log('🔐 Identidad de autenticación creada');
    console.log(`🎉 ¡Listo! Admin creado exitosamente:`);
    console.log(`   📧 Email: ${EMAIL}`);
    console.log(`   🔑 Password: ${PASSWORD}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createAdmin();
