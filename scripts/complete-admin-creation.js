const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function completeAdminCreation() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    const client = await pool.connect();
    
    console.log('🔍 Checking existing auth_identity record...');
    
    // Check if auth_identity exists
    const authCheck = await client.query(
      'SELECT * FROM auth_identity WHERE id = $1',
      ['authid_new_admin_001']
    );
    
    if (authCheck.rows.length === 0) {
      console.log('❌ Auth identity authid_new_admin_001 not found');
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
      return;
    }
    
    console.log('📝 Creating provider_identity record...');
    
    // Hash the password
    const password = 'KST2025@Admin';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create provider_identity record
    const providerId = `provid_new_admin_001`;
    const entityId = `user_new_admin_001`;
    
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
    } else {
      console.log('❌ Verification failed');
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error completing admin creation:', error);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  completeAdminCreation();
}

module.exports = completeAdminCreation;
