const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://medusa@localhost/medusa_v2'
});

async function checkProviderIdentity() {
  const client = await pool.connect();
  
  try {
    console.log('=== CHECKING PROVIDER_IDENTITY TABLE ===\n');
    
    // Check schema
    console.log('1. PROVIDER_IDENTITY SCHEMA:');
    const schema = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'provider_identity' 
      ORDER BY ordinal_position
    `);
    console.table(schema.rows);
    
    // Check content
    console.log('\n2. PROVIDER_IDENTITY CONTENT:');
    const content = await client.query('SELECT * FROM "provider_identity" ORDER BY created_at DESC');
    console.table(content.rows);
    
    console.log('\n3. ROW COUNT:');
    const count = await client.query('SELECT COUNT(*) FROM "provider_identity"');
    console.log('Total rows:', count.rows[0].count);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkProviderIdentity();
