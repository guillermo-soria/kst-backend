#!/usr/bin/env node
/**
 * Script mejorado para crear usuario admin compatible con MedusaJS v2
 */
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const EMAIL = process.env.ADMIN_EMAIL || "admin@kst.test";
const PASSWORD = process.env.ADMIN_PASSWORD || "UnaClaveFuerte123";
const FIRST = process.env.ADMIN_FIRST || "Guillermo";
const LAST = process.env.ADMIN_LAST || "Soria";

async function createAdminV2() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('🔗 Conectado a la base de datos');

    // Hash de la contraseña
    const hash = await bcrypt.hash(PASSWORD, 12); // Usar salt rounds más alto
    
    // Verificar si el usuario ya existe
    const existingUser = await client.query(
      'SELECT id FROM "user" WHERE email = $1',
      [EMAIL]
    );

    let userId;

    if (existingUser.rows.length > 0) {
      userId = existingUser.rows[0].id;
      console.log(`📝 Usuario existente encontrado: ${userId}`);
      
      // Actualizar el usuario existente
      await client.query(`
        UPDATE "user" 
        SET first_name = $2, last_name = $3, updated_at = NOW()
        WHERE id = $1
      `, [userId, FIRST, LAST]);
      
      console.log(`✅ Usuario actualizado`);
    } else {
      // Crear nuevo usuario
      const userResult = await client.query(`
        INSERT INTO "user" (email, first_name, last_name, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING id
      `, [EMAIL, FIRST, LAST]);

      userId = userResult.rows[0].id;
      console.log('👤 Usuario creado con ID:', userId);
    }

    // Eliminar identidades existentes
    await client.query(`
      DELETE FROM auth_identity 
      WHERE entity_id = $1 AND provider = 'emailpass'
    `, [userId]);

    // Crear nueva identidad de autenticación con el formato correcto para v2
    const authData = {
      password: hash,
      email: EMAIL
    };

    await client.query(`
      INSERT INTO auth_identity (entity_id, provider_id, provider, actor_type, auth_data, created_at, updated_at)
      VALUES ($1, $2, 'emailpass', 'user', $3, NOW(), NOW())
    `, [userId, EMAIL, JSON.stringify(authData)]);

    console.log('🔐 Identidad de autenticación creada/actualizada');
    console.log(`🎉 ¡Listo! Admin configurado exitosamente:`);
    console.log(`   📧 Email: ${EMAIL}`);
    console.log(`   🔑 Password: ${PASSWORD}`);
    console.log(`   👤 ID: ${userId}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createAdminV2();
