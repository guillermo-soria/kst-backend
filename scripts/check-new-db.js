const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://medusa@localhost/medusa_v2'
});

async function checkNewDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('=== CHECKING NEW DATABASE (medusa_v2) ===\n');
    
    // Check users
    console.log('1. USERS:');
    const users = await client.query('SELECT id, email, first_name, last_name, created_at FROM "user" ORDER BY created_at DESC');
    console.table(users.rows);
    
    // Check auth identities
    console.log('\n2. AUTH IDENTITIES:');
    const identities = await client.query('SELECT * FROM "auth_identity" ORDER BY created_at DESC');
    console.table(identities.rows);
    
    // Check auth_identity schema
    console.log('\n3. AUTH IDENTITY SCHEMA:');
    const schema = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'auth_identity' 
      ORDER BY ordinal_position
    `);
    console.table(schema.rows);
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkNewDatabase();
