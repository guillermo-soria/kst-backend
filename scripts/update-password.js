const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: 'postgres://medusa@localhost/medusa'
});

async function updatePasswordHash() {
  const client = await pool.connect();
  
  try {
    console.log('Updating password hash for admin@kst.test...\n');
    
    const password = 'supersecret';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    console.log('New password hash:', hashedPassword);
    
    // Update auth_identity with correct password hash
    const updateResult = await client.query(`
      UPDATE auth_identity 
      SET auth_data = jsonb_set(auth_data, '{password}', $1)
      WHERE provider_id = 'admin@kst.test' AND provider = 'emailpass'
    `, [JSON.stringify(hashedPassword)]);
    
    console.log('Rows updated:', updateResult.rowCount);
    
    // Verify the update
    const verifyResult = await client.query(`
      SELECT auth_data 
      FROM auth_identity 
      WHERE provider_id = 'admin@kst.test' AND provider = 'emailpass'
    `);
    
    console.log('Updated auth_data:', verifyResult.rows[0].auth_data);
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('Password verification test:', isValid);
    
    console.log('\n✅ Password hash updated successfully!');
    
  } catch (error) {
    console.error('Error updating password hash:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

updatePasswordHash();
