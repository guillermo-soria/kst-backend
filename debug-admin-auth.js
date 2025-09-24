#!/usr/bin/env node

/**
 * Debug Admin Authentication Script
 * 
 * This script debugs admin authentication by checking the database records
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

async function debugAdminAuth(databaseUrl) {
  console.log('🔍 Debugging admin authentication...');

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
    
    // 1. Check auth_identity
    console.log('\n🔍 Checking auth_identity...');
    const authQuery = await client.query(`
      SELECT id, app_metadata, user_metadata, provider_identities, created_at, updated_at
      FROM auth_identity 
      WHERE id = $1
    `, [AUTH_IDENTITY_ID]);
    
    if (authQuery.rows.length > 0) {
      const auth = authQuery.rows[0];
      console.log('✅ Auth Identity Found:');
      console.log('   ID:', auth.id);
      console.log('   App Metadata:', auth.app_metadata);
      console.log('   User Metadata:', auth.user_metadata);
      console.log('   Provider Identities:', auth.provider_identities);
      console.log('   Created:', auth.created_at);
    } else {
      console.log('❌ Auth identity not found');
      return;
    }
    
    // 2. Check provider_identity
    console.log('\n🔍 Checking provider_identity...');
    const providerQuery = await client.query(`
      SELECT id, entity_id, provider, auth_identity_id, provider_metadata, created_at
      FROM provider_identity 
      WHERE auth_identity_id = $1
    `, [AUTH_IDENTITY_ID]);
    
    if (providerQuery.rows.length > 0) {
      const provider = providerQuery.rows[0];
      console.log('✅ Provider Identity Found:');
      console.log('   ID:', provider.id);
      console.log('   Entity ID:', provider.entity_id);
      console.log('   Provider:', provider.provider);
      console.log('   Auth Identity ID:', provider.auth_identity_id);
      console.log('   Provider Metadata:', provider.provider_metadata);
      console.log('   Created:', provider.created_at);
      
      // Test password hash
      const metadata = provider.provider_metadata;
      if (metadata && metadata.password_hash) {
        console.log('\n🔐 Testing password hash...');
        const isValid = await bcrypt.compare(ADMIN_PASSWORD, metadata.password_hash);
        console.log('   Password hash test:', isValid ? '✅ VALID' : '❌ INVALID');
        
        if (!isValid) {
          console.log('   Expected password:', ADMIN_PASSWORD);
          console.log('   This might be the issue!');
        }
      } else {
        console.log('⚠️  No password hash found in metadata');
      }
      
      // Check email in metadata
      if (metadata && metadata.email) {
        console.log('   Email in metadata:', metadata.email);
        if (metadata.email !== ADMIN_EMAIL) {
          console.log('   ⚠️  Email mismatch!');
        }
      } else {
        console.log('   ⚠️  No email found in metadata');
      }
      
    } else {
      console.log('❌ Provider identity not found');
      return;
    }
    
    // 3. Check for user table (if exists)
    console.log('\n🔍 Checking user table...');
    try {
      const userQuery = await client.query(`
        SELECT id, email, first_name, last_name, created_at
        FROM "user" 
        WHERE email = $1
      `, [ADMIN_EMAIL]);
      
      if (userQuery.rows.length > 0) {
        console.log('✅ User record found:', userQuery.rows[0]);
      } else {
        console.log('ℹ️  No user record found (this might be normal for auth-only setup)');
      }
    } catch (error) {
      console.log('ℹ️  User table check skipped:', error.message);
    }
    
    // 4. Search for any auth records with the email
    console.log('\n🔍 Searching for any records with admin email...');
    const emailSearch = await client.query(`
      SELECT 
        'auth_identity' as table_name,
        id,
        app_metadata,
        user_metadata
      FROM auth_identity 
      WHERE app_metadata::text LIKE '%${ADMIN_EMAIL}%' 
         OR user_metadata::text LIKE '%${ADMIN_EMAIL}%'
      
      UNION ALL
      
      SELECT 
        'provider_identity' as table_name,
        id,
        provider_metadata,
        null
      FROM provider_identity 
      WHERE provider_metadata::text LIKE '%${ADMIN_EMAIL}%'
         OR entity_id = '${ADMIN_EMAIL}'
    `);
    
    if (emailSearch.rows.length > 0) {
      console.log('📧 Records containing admin email:');
      emailSearch.rows.forEach(row => {
        console.log(`   ${row.table_name}:`, row.id);
      });
    } else {
      console.log('⚠️  No records found containing admin email');
    }
    
    console.log('\n📋 DIAGNOSIS SUMMARY:');
    console.log('====================');
    
    if (authQuery.rows.length > 0 && providerQuery.rows.length > 0) {
      console.log('✅ Database records exist');
      
      const provider = providerQuery.rows[0];
      const metadata = provider.provider_metadata;
      
      if (metadata && metadata.password_hash) {
        const isValidPassword = await bcrypt.compare(ADMIN_PASSWORD, metadata.password_hash);
        if (isValidPassword) {
          console.log('✅ Password hash is correct');
          console.log('🤔 Issue might be:');
          console.log('   - API endpoint configuration');
          console.log('   - Authentication middleware');
          console.log('   - CORS settings');
          console.log('   - Provider configuration');
        } else {
          console.log('❌ Password hash is incorrect');
          console.log('🔧 Need to update password hash');
        }
      } else {
        console.log('❌ No password hash found');
        console.log('🔧 Need to create proper provider_identity');
      }
    } else {
      console.log('❌ Missing database records');
      console.log('🔧 Need to run admin creation scripts');
    }
    
  } catch (error) {
    console.error('❌ Error debugging admin auth:', error);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

async function main() {
  console.log('🔍 Medusa Admin Authentication Debug');
  console.log('===================================');
  
  let databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    databaseUrl = await promptForDatabaseUrl();
  }
  
  if (!databaseUrl) {
    console.log('❌ No database URL provided. Exiting...');
    process.exit(1);
  }
  
  await debugAdminAuth(databaseUrl);
}

if (require.main === module) {
  main().catch(console.error);
}
