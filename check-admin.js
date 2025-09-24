#!/usr/bin/env node

/**
 * Verify Admin Setup Script
 * 
 * This script checks the current state of the admin user setup
 * and tells you what needs to be done next.
 */

const { Pool } = require('pg');
const readline = require('readline');

const AUTH_IDENTITY_ID = 'authid_new_admin_001';
const ADMIN_EMAIL = 'admin@kst.test';

async function promptForDatabaseUrl() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n🔗 Database Connection Required');
    console.log('Please provide your Railway PostgreSQL DATABASE_URL');
    console.log('Format: postgresql://user:password@host:port/database');
    
    rl.question('DATABASE_URL: ', (url) => {
      rl.close();
      resolve(url.trim());
    });
  });
}

async function verifyAdminStatus(databaseUrl) {
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
    console.log('✅ Connected to database successfully\n');
    
    // Check auth_identity
    console.log('🔍 Checking auth_identity table...');
    const authCheck = await client.query(`
      SELECT id, app_metadata, created_at 
      FROM auth_identity 
      WHERE id = $1
    `, [AUTH_IDENTITY_ID]);
    
    let authExists = false;
    if (authCheck.rows.length > 0) {
      console.log('✅ auth_identity found:', {
        id: authCheck.rows[0].id,
        created_at: authCheck.rows[0].created_at,
        app_metadata: authCheck.rows[0].app_metadata
      });
      authExists = true;
    } else {
      console.log('❌ auth_identity NOT found');
      console.log('   Expected ID:', AUTH_IDENTITY_ID);
    }
    
    // Check provider_identity
    console.log('\n🔍 Checking provider_identity table...');
    const providerCheck = await client.query(`
      SELECT id, entity_id, provider, auth_identity_id, provider_metadata, created_at
      FROM provider_identity 
      WHERE auth_identity_id = $1
    `, [AUTH_IDENTITY_ID]);
    
    let providerExists = false;
    if (providerCheck.rows.length > 0) {
      console.log('✅ provider_identity found:', {
        id: providerCheck.rows[0].id,
        entity_id: providerCheck.rows[0].entity_id,
        provider: providerCheck.rows[0].provider,
        email: providerCheck.rows[0].provider_metadata?.email,
        created_at: providerCheck.rows[0].created_at
      });
      providerExists = true;
    } else {
      console.log('❌ provider_identity NOT found');
      console.log('   Looking for auth_identity_id:', AUTH_IDENTITY_ID);
    }
    
    // Check complete setup
    console.log('\n🔍 Checking complete admin setup...');
    const completeCheck = await client.query(`
      SELECT 
        ai.id as auth_id,
        pi.id as provider_id,
        pi.entity_id,
        pi.provider_metadata->>'email' as email
      FROM auth_identity ai
      JOIN provider_identity pi ON ai.id = pi.auth_identity_id
      WHERE ai.id = $1
    `, [AUTH_IDENTITY_ID]);
    
    console.log('\n📋 SUMMARY:');
    console.log('==========');
    
    if (completeCheck.rows.length > 0) {
      console.log('🎉 ADMIN USER IS COMPLETE AND READY!');
      console.log('✅ Both auth_identity and provider_identity exist');
      console.log('✅ Records are properly linked');
      console.log('\n📋 Login Credentials:');
      console.log('   Email:', ADMIN_EMAIL);
      console.log('   Password: KST2025@Admin');
      console.log('\n✨ You can log in to your Medusa admin panel now!');
      return 'complete';
    } else if (authExists && !providerExists) {
      console.log('⚠️  ADMIN USER IS PARTIALLY CREATED');
      console.log('✅ auth_identity exists');
      console.log('❌ provider_identity missing');
      console.log('\n🔧 NEXT STEP:');
      console.log('   Run: node complete-admin.js');
      console.log('   This will create the missing provider_identity record');
      return 'partial';
    } else if (!authExists) {
      console.log('❌ ADMIN USER NOT CREATED');
      console.log('❌ auth_identity missing');
      console.log('❌ provider_identity missing');
      console.log('\n🔧 NEXT STEPS:');
      console.log('   1. Run: node scripts/create-admin-v2.mjs');
      console.log('   2. Then run: node complete-admin.js');
      return 'missing';
    }
    
    return 'unknown';
    
  } catch (error) {
    console.error('❌ Error verifying admin status:', error);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Database connection failed. Please check your DATABASE_URL');
    }
    
    return 'error';
    
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

// Main execution
async function main() {
  console.log('🔍 Medusa v2 Admin User Status Check');
  console.log('===================================');
  
  let databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    databaseUrl = await promptForDatabaseUrl();
  }
  
  if (!databaseUrl) {
    console.log('❌ No database URL provided. Exiting...');
    process.exit(1);
  }
  
  const status = await verifyAdminStatus(databaseUrl);
  
  console.log(`\n🏁 Admin Status: ${status}`);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { verifyAdminStatus };
