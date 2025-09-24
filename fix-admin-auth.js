#!/usr/bin/env node

/**
 * Fix Admin Authentication Records
 * 
 * This script fixes the admin authentication records to match Medusa v2 expectations
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const AUTH_IDENTITY_ID = 'authid_new_admin_001';
const ADMIN_EMAIL = 'admin@kst.test';
const ADMIN_PASSWORD = 'KST2025@Admin';

async function promptForDatabaseUrl() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n🔗 Database Connection Required');
    console.log('Please provide your Railway PostgreSQL DATABASE_URL');
    
    rl.question('DATABASE_URL: ', (url) => {
      rl.close();
      resolve(url.trim());
    });
  });
}

async function fixAdminAuth(databaseUrl) {
  console.log('🔧 Fixing admin authentication records...');

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('railway.internal') || process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false
  });

  let client;

  try {
    client = await pool.connect();
    console.log('✅ Connected to database');
    
    // 1. Check current state
    console.log('\n🔍 Checking current auth records...');
    const authQuery = await client.query(`
      SELECT * FROM auth_identity WHERE id = $1
    `, [AUTH_IDENTITY_ID]);
    
    const providerQuery = await client.query(`
      SELECT * FROM provider_identity WHERE auth_identity_id = $1
    `, [AUTH_IDENTITY_ID]);
    
    if (authQuery.rows.length === 0) {
      console.log('❌ Auth identity not found');
      return false;
    }
    
    if (providerQuery.rows.length === 0) {
      console.log('❌ Provider identity not found');
      return false;
    }
    
    console.log('✅ Found existing records');
    
    // 2. Test current password
    const provider = providerQuery.rows[0];
    const currentPassword = provider.provider_metadata?.password;
    
    if (currentPassword) {
      console.log('🔍 Testing current password hash...');
      const isValid = await bcrypt.compare(ADMIN_PASSWORD, currentPassword);
      console.log('Current password test:', isValid ? '✅ VALID' : '❌ INVALID');
      
      if (isValid) {
        console.log('✅ Password is correct, checking other fields...');
      } else {
        console.log('🔧 Need to fix password hash...');
        // Create new hash
        const newHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
        
        await client.query(`
          UPDATE provider_identity 
          SET provider_metadata = jsonb_set(provider_metadata, '{password}', to_jsonb($1::text))
          WHERE id = $2
        `, [newHash, provider.id]);
        
        console.log('✅ Updated password hash');
      }
    }
    
    // 3. Fix auth_identity app_metadata
    const auth = authQuery.rows[0];
    if (!auth.app_metadata || Object.keys(auth.app_metadata).length === 0) {
      console.log('🔧 Fixing auth_identity app_metadata...');
      
      const appMetadata = {
        user_id: provider.entity_id,
        email: ADMIN_EMAIL,
        role: 'admin'
      };
      
      await client.query(`
        UPDATE auth_identity 
        SET app_metadata = $1
        WHERE id = $2
      `, [JSON.stringify(appMetadata), AUTH_IDENTITY_ID]);
      
      console.log('✅ Updated auth_identity app_metadata');
    }
    
    // 4. Ensure provider_metadata has email
    const metadata = provider.provider_metadata || {};
    if (!metadata.email) {
      console.log('🔧 Adding email to provider_metadata...');
      
      await client.query(`
        UPDATE provider_identity 
        SET provider_metadata = jsonb_set(
          COALESCE(provider_metadata, '{}'), 
          '{email}', 
          to_jsonb($1::text)
        )
        WHERE id = $2
      `, [ADMIN_EMAIL, provider.id]);
      
      console.log('✅ Added email to provider_metadata');
    }
    
    // 5. Verify final state
    console.log('\n🔍 Verifying final state...');
    
    const finalAuthQuery = await client.query(`
      SELECT * FROM auth_identity WHERE id = $1
    `, [AUTH_IDENTITY_ID]);
    
    const finalProviderQuery = await client.query(`
      SELECT * FROM provider_identity WHERE auth_identity_id = $1
    `, [AUTH_IDENTITY_ID]);
    
    const finalAuth = finalAuthQuery.rows[0];
    const finalProvider = finalProviderQuery.rows[0];
    
    console.log('📋 Final Auth Identity:');
    console.log('   ID:', finalAuth.id);
    console.log('   App Metadata:', finalAuth.app_metadata);
    
    console.log('\n📋 Final Provider Identity:');
    console.log('   ID:', finalProvider.id);
    console.log('   Entity ID:', finalProvider.entity_id);
    console.log('   Provider:', finalProvider.provider);
    console.log('   Provider Metadata:', finalProvider.provider_metadata);
    
    // Test final password
    if (finalProvider.provider_metadata?.password) {
      const finalPasswordTest = await bcrypt.compare(ADMIN_PASSWORD, finalProvider.provider_metadata.password);
      console.log('\n🔐 Final password test:', finalPasswordTest ? '✅ VALID' : '❌ INVALID');
    }
    
    console.log('\n🎉 Admin authentication records have been fixed!');
    console.log('📋 Login Credentials:');
    console.log('   Email:', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error fixing admin auth:', error);
    return false;
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

async function main() {
  console.log('🔧 Medusa Admin Authentication Fix');
  console.log('==================================');
  
  let databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    databaseUrl = await promptForDatabaseUrl();
  }
  
  if (!databaseUrl) {
    console.log('❌ No database URL provided. Exiting...');
    process.exit(1);
  }
  
  const success = await fixAdminAuth(databaseUrl);
  
  if (success) {
    console.log('\n✨ Success! Try logging in again.');
  } else {
    console.log('\n💥 Failed to fix admin authentication.');
  }
}

if (require.main === module) {
  main().catch(console.error);
}
