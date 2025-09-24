#!/usr/bin/env node

/**
 * Complete Admin Creation Script
 * 
 * This script completes the admin user creation by adding the provider_identity record
 * that references the existing auth_identity record (authid_new_admin_001).
 * 
 * Usage:
 *   DATABASE_URL="your_railway_postgres_url" node complete-admin.js
 *   
 * Or run interactively and it will prompt for the database URL.
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Admin credentials
const ADMIN_EMAIL = 'admin@kst.test';
const ADMIN_PASSWORD = 'KST2025@Admin';
const AUTH_IDENTITY_ID = 'authid_new_admin_001';

async function promptForDatabaseUrl() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n🔗 Database Connection Required');
    console.log('Please provide your Railway PostgreSQL DATABASE_URL');
    console.log('Format: postgresql://user:password@host:port/database');
    console.log('Example: postgresql://postgres:xxx@postgres.railway.internal:5432/railway\n');
    
    rl.question('DATABASE_URL: ', (url) => {
      rl.close();
      resolve(url.trim());
    });
  });
}

async function completeAdminCreation(databaseUrl) {
  console.log('🚀 Starting admin completion process...');
  console.log('🔗 Connecting to database...');

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('railway.internal') || process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false
  });

  let client;

  try {
    client = await pool.connect();
    console.log('✅ Connected to database successfully');
    
    // Step 1: Verify auth_identity exists
    console.log('\n📋 Step 1: Checking auth_identity record...');
    const authCheck = await client.query(
      'SELECT * FROM auth_identity WHERE id = $1',
      [AUTH_IDENTITY_ID]
    );
    
    if (authCheck.rows.length === 0) {
      console.log(`❌ Auth identity ${AUTH_IDENTITY_ID} not found`);
      console.log('⚠️  Please run create-admin-v2.mjs first to create the auth_identity record');
      return false;
    }
    
    console.log('✅ Found auth_identity record:', {
      id: authCheck.rows[0].id,
      created_at: authCheck.rows[0].created_at
    });
    
    // Step 2: Check if provider_identity already exists
    console.log('\n📋 Step 2: Checking existing provider_identity...');
    const providerCheck = await client.query(
      'SELECT * FROM provider_identity WHERE auth_identity_id = $1',
      [AUTH_IDENTITY_ID]
    );
    
    if (providerCheck.rows.length > 0) {
      console.log('ℹ️  Provider identity already exists!');
      console.log('✅ Admin user is already complete');
      await verifyAdminSetup(client);
      return true;
    }
    
    // Step 3: Create provider_identity
    console.log('\n📋 Step 3: Creating provider_identity record...');
    console.log('🔐 Hashing password...');
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);
    
    // Generate unique IDs with timestamp
    const timestamp = Date.now();
    const providerId = `provid_admin_${timestamp}`;
    const entityId = `user_admin_${timestamp}`;
    
    console.log('📝 Creating provider identity with:');
    console.log('   Provider ID:', providerId);
    console.log('   Entity ID:', entityId);
    console.log('   Email:', ADMIN_EMAIL);
    console.log('   Auth Identity ID:', AUTH_IDENTITY_ID);
    
    const providerInsert = await client.query(`
      INSERT INTO provider_identity (
        id, 
        entity_id, 
        provider, 
        auth_identity_id, 
        provider_metadata, 
        created_at, 
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, entity_id, provider, auth_identity_id, created_at
    `, [
      providerId,
      entityId,
      'emailpass',
      AUTH_IDENTITY_ID,
      JSON.stringify({
        email: ADMIN_EMAIL,
        password_hash: hashedPassword
      }),
      new Date().toISOString(),
      new Date().toISOString()
    ]);
    
    console.log('✅ Created provider_identity successfully:', providerInsert.rows[0]);
    
    // Step 4: Verify complete setup
    console.log('\n📋 Step 4: Verifying complete admin setup...');
    await verifyAdminSetup(client);
    
    console.log('\n🎉 ADMIN USER CREATION COMPLETE!');
    console.log('📋 Login Credentials:');
    console.log('   Email:', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('\n✨ You can now log in to your Medusa admin panel!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error completing admin creation:', error);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Database connection failed. Please check your DATABASE_URL');
    } else if (error.code === '23505') {
      console.log('\n💡 Record already exists (duplicate key error)');
      console.log('   This might mean the admin is already created');
    }
    
    return false;
    
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

async function verifyAdminSetup(client) {
  try {
    const verifyQuery = await client.query(`
      SELECT 
        ai.id as auth_id,
        ai.created_at as auth_created,
        pi.id as provider_id,
        pi.entity_id,
        pi.provider,
        pi.provider_metadata->>'email' as email,
        pi.created_at as provider_created
      FROM auth_identity ai
      JOIN provider_identity pi ON ai.id = pi.auth_identity_id
      WHERE ai.id = $1
    `, [AUTH_IDENTITY_ID]);
    
    if (verifyQuery.rows.length > 0) {
      const admin = verifyQuery.rows[0];
      console.log('🔍 Complete Admin Setup Verified:');
      console.log('   ✅ Auth ID:', admin.auth_id);
      console.log('   ✅ Provider ID:', admin.provider_id);
      console.log('   ✅ Entity ID:', admin.entity_id);
      console.log('   ✅ Provider:', admin.provider);
      console.log('   ✅ Email:', admin.email);
      console.log('   ✅ Auth Created:', admin.auth_created);
      console.log('   ✅ Provider Created:', admin.provider_created);
      return true;
    } else {
      console.log('❌ Verification failed - records not properly linked');
      return false;
    }
  } catch (error) {
    console.error('❌ Error during verification:', error);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🎯 Medusa v2 Admin User Completion Script');
  console.log('=========================================');
  
  let databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    databaseUrl = await promptForDatabaseUrl();
  }
  
  if (!databaseUrl) {
    console.log('❌ No database URL provided. Exiting...');
    process.exit(1);
  }
  
  const success = await completeAdminCreation(databaseUrl);
  
  if (success) {
    console.log('\n🎊 Success! Your admin user is ready to use.');
    process.exit(0);
  } else {
    console.log('\n💥 Failed to complete admin creation.');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { completeAdminCreation };
