const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function completeAdminCreation() {
  // Use Railway's provided DATABASE_URL or fallback
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:xbStCVxwGoWTwPPLJWpBjyPSJISiGeTK@postgres.railway.internal:5432/railway';
  
  console.log('🔗 Connecting to database...');
  console.log('Database URL pattern:', databaseUrl.replace(/:[^:@]*@/, ':****@'));

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    const client = await pool.connect();
    
    console.log('✅ Connected to database');
    console.log('🔍 Checking existing auth_identity record...');
    
    // Check if auth_identity exists
    const authCheck = await client.query(
      'SELECT * FROM auth_identity WHERE id = $1',
      ['authid_new_admin_001']
    );
    
    if (authCheck.rows.length === 0) {
      console.log('❌ Auth identity authid_new_admin_001 not found');
      console.log('⚠️  Run the create-admin-v2.mjs script first to create the auth_identity record');
      client.release();
      return;
    }
    
    console.log('✅ Found auth_identity:', authCheck.rows[0]);
    
    // Check if provider_identity already exists
    const providerCheck = await client.query(
      'SELECT * FROM provider_identity WHERE auth_identity_id = $1',
      ['authid_new_admin_001']
    );
    
    if (providerCheck.rows.length > 0) {
      console.log('ℹ️  Provider identity already exists:', providerCheck.rows[0]);
      console.log('🎉 Admin user is already complete!');
      
      // Verify login works
      await testAdminLogin(client);
      client.release();
      return;
    }
    
    console.log('📝 Creating provider_identity record...');
    
    // Hash the password
    const password = 'KST2025@Admin';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Generate unique IDs
    const providerId = `provid_${Date.now()}`;
    const entityId = `user_${Date.now()}`;
    
    console.log('🔑 Creating provider identity with:');
    console.log('   Provider ID:', providerId);
    console.log('   Entity ID:', entityId);
    console.log('   Auth Identity ID: authid_new_admin_001');
    
    // Create provider_identity record
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
      RETURNING *
    `, [
      providerId,
      entityId,
      'emailpass',
      'authid_new_admin_001',
      JSON.stringify({
        email: 'admin@kst.test',
        password_hash: hashedPassword
      }),
      new Date().toISOString(),
      new Date().toISOString()
    ]);
    
    console.log('✅ Created provider_identity:', providerInsert.rows[0]);
    
    // Verify the complete setup
    console.log('\n🔍 Verifying complete admin setup...');
    
    const verifyQuery = await client.query(`
      SELECT 
        ai.id as auth_id,
        ai.provider_identities,
        pi.id as provider_id,
        pi.entity_id,
        pi.provider,
        pi.provider_metadata
      FROM auth_identity ai
      JOIN provider_identity pi ON ai.id = pi.auth_identity_id
      WHERE ai.id = $1
    `, ['authid_new_admin_001']);
    
    if (verifyQuery.rows.length > 0) {
      console.log('🎉 Admin user setup complete!');
      console.log('📋 Admin credentials:');
      console.log('   Email: admin@kst.test');
      console.log('   Password: KST2025@Admin');
      console.log('\n✨ You can now log in to the Medusa admin panel');
      
      // Test the login
      await testAdminLogin(client);
    } else {
      console.log('❌ Verification failed');
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error completing admin creation:', error);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 This script should be run on Railway where DATABASE_URL is available');
      console.log('   Or set the DATABASE_URL environment variable with the correct Railway PostgreSQL URL');
    }
  } finally {
    await pool.end();
  }
}

async function testAdminLogin(client) {
  try {
    console.log('\n🧪 Testing admin authentication...');
    
    // Check if we can find the admin user by email
    const adminQuery = await client.query(`
      SELECT 
        ai.id as auth_id,
        pi.id as provider_id,
        pi.entity_id,
        pi.provider_metadata->>'email' as email
      FROM auth_identity ai
      JOIN provider_identity pi ON ai.id = pi.auth_identity_id
      WHERE pi.provider_metadata->>'email' = $1
    `, ['admin@kst.test']);
    
    if (adminQuery.rows.length > 0) {
      console.log('✅ Admin user found in authentication tables');
      console.log('   Auth ID:', adminQuery.rows[0].auth_id);
      console.log('   Provider ID:', adminQuery.rows[0].provider_id);
      console.log('   Entity ID:', adminQuery.rows[0].entity_id);
      console.log('   Email:', adminQuery.rows[0].email);
    } else {
      console.log('❌ Admin user not found');
    }
    
  } catch (error) {
    console.error('❌ Error testing admin login:', error);
  }
}

// Run if called directly
if (require.main === module) {
  completeAdminCreation();
}

module.exports = completeAdminCreation;
