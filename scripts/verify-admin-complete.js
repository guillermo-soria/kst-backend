const { Pool } = require('pg');

async function verifyAdminSetup() {
  // Use Railway's provided DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:xbStCVxwGoWTwPPLJWpBjyPSJISiGeTK@postgres.railway.internal:5432/railway';
  
  console.log('🔗 Connecting to database to verify admin setup...');
  console.log('Database URL pattern:', databaseUrl.replace(/:[^:@]*@/, ':****@'));

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to database');
    
    console.log('\n🔍 Checking auth_identity table...');
    const authCheck = await client.query(`
      SELECT id, app_metadata, user_metadata, provider_identities, created_at 
      FROM auth_identity 
      WHERE id = 'authid_new_admin_001'
    `);
    
    if (authCheck.rows.length === 0) {
      console.log('❌ No auth_identity record found with ID: authid_new_admin_001');
      console.log('⚠️  Run create-admin-v2.mjs first to create the auth_identity');
    } else {
      console.log('✅ Auth identity found:', authCheck.rows[0]);
    }
    
    console.log('\n🔍 Checking provider_identity table...');
    const providerCheck = await client.query(`
      SELECT id, entity_id, provider, auth_identity_id, provider_metadata, created_at
      FROM provider_identity 
      WHERE auth_identity_id = 'authid_new_admin_001'
    `);
    
    if (providerCheck.rows.length === 0) {
      console.log('❌ No provider_identity record found for auth_identity_id: authid_new_admin_001');
      console.log('⚠️  Run complete-admin-creation-railway.js to create the provider_identity');
    } else {
      console.log('✅ Provider identity found:', providerCheck.rows[0]);
    }
    
    console.log('\n🔍 Checking complete admin setup...');
    const completeCheck = await client.query(`
      SELECT 
        ai.id as auth_id,
        ai.provider_identities,
        pi.id as provider_id,
        pi.entity_id,
        pi.provider,
        pi.provider_metadata->>'email' as email,
        ai.created_at as auth_created,
        pi.created_at as provider_created
      FROM auth_identity ai
      JOIN provider_identity pi ON ai.id = pi.auth_identity_id
      WHERE ai.id = 'authid_new_admin_001'
    `);
    
    if (completeCheck.rows.length > 0) {
      const admin = completeCheck.rows[0];
      console.log('🎉 COMPLETE ADMIN SETUP FOUND!');
      console.log('📋 Admin Details:');
      console.log('   Auth ID:', admin.auth_id);
      console.log('   Provider ID:', admin.provider_id);
      console.log('   Entity ID:', admin.entity_id);
      console.log('   Provider:', admin.provider);
      console.log('   Email:', admin.email);
      console.log('   Auth Created:', admin.auth_created);
      console.log('   Provider Created:', admin.provider_created);
      
      console.log('\n✨ LOGIN CREDENTIALS:');
      console.log('   Email: admin@kst.test');
      console.log('   Password: KST2025@Admin');
      console.log('\n🌐 You can now log in to your Medusa admin panel!');
    } else {
      console.log('❌ Complete admin setup not found');
      console.log('⚠️  Both auth_identity and provider_identity records are needed');
    }
    
    // Check for user table as well (if it exists)
    console.log('\n🔍 Checking if user table exists and has admin...');
    try {
      const userCheck = await client.query(`
        SELECT id, email, first_name, last_name, created_at
        FROM "user" 
        WHERE email = 'admin@kst.test'
      `);
      
      if (userCheck.rows.length > 0) {
        console.log('✅ User record found:', userCheck.rows[0]);
      } else {
        console.log('ℹ️  No user record found (this might be normal for Medusa v2)');
      }
    } catch (error) {
      console.log('ℹ️  User table not checked (might not exist):', error.message);
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error verifying admin setup:', error);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 This script should be run on Railway where DATABASE_URL is available');
      console.log('   Or set the DATABASE_URL environment variable with the correct Railway PostgreSQL URL');
    }
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  verifyAdminSetup();
}

module.exports = verifyAdminSetup;
