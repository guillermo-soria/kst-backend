#!/usr/bin/env node

/**
 * Check Database Schema Script
 */

const { Pool } = require('pg');
const readline = require('readline');

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

async function checkSchema(databaseUrl) {
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
    
    // Check auth_identity table structure
    console.log('\n🔍 Checking auth_identity table structure...');
    const authStructure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'auth_identity'
      ORDER BY ordinal_position
    `);
    
    if (authStructure.rows.length > 0) {
      console.log('✅ auth_identity table columns:');
      authStructure.rows.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
      });
    } else {
      console.log('❌ auth_identity table not found');
    }
    
    // Check provider_identity table structure
    console.log('\n🔍 Checking provider_identity table structure...');
    const providerStructure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'provider_identity'
      ORDER BY ordinal_position
    `);
    
    if (providerStructure.rows.length > 0) {
      console.log('✅ provider_identity table columns:');
      providerStructure.rows.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
      });
    } else {
      console.log('❌ provider_identity table not found');
    }
    
    // Check actual data with simple SELECT *
    console.log('\n🔍 Checking auth_identity data...');
    const authData = await client.query(`
      SELECT * FROM auth_identity WHERE id = 'authid_new_admin_001'
    `);
    
    if (authData.rows.length > 0) {
      console.log('✅ Found auth_identity data:', authData.rows[0]);
    } else {
      console.log('❌ No auth_identity data found');
    }
    
    // Check provider_identity data
    console.log('\n🔍 Checking provider_identity data...');
    const providerData = await client.query(`
      SELECT * FROM provider_identity WHERE auth_identity_id = 'authid_new_admin_001'
    `);
    
    if (providerData.rows.length > 0) {
      console.log('✅ Found provider_identity data:', providerData.rows[0]);
    } else {
      console.log('❌ No provider_identity data found');
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

async function main() {
  console.log('🔍 Database Schema Check');
  console.log('=======================');
  
  let databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    databaseUrl = await promptForDatabaseUrl();
  }
  
  if (!databaseUrl) {
    console.log('❌ No database URL provided. Exiting...');
    process.exit(1);
  }
  
  await checkSchema(databaseUrl);
}

if (require.main === module) {
  main().catch(console.error);
}
