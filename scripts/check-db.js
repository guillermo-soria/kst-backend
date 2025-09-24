const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://medusa@localhost/medusa'
});

async function checkDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('=== CHECKING DATABASE STATE ===\n');
    
    // Check users
    console.log('1. USERS:');
    const users = await client.query('SELECT id, email, first_name, last_name, created_at FROM "user" ORDER BY created_at DESC');
    console.table(users.rows);
    
    // Check auth identities - first check what columns exist
    console.log('\n2. AUTH IDENTITY SCHEMA:');
    const authSchema = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'auth_identity' 
      ORDER BY ordinal_position
    `);
    console.table(authSchema.rows);
    
    // Check auth identities with existing columns
    console.log('\n3. AUTH IDENTITIES:');
    const identities = await client.query('SELECT * FROM "auth_identity" ORDER BY created_at DESC');
    console.table(identities.rows);
    
    // Check if auth_identity has provider field
    console.log('\n4. USER TABLE SCHEMA:');
    const userSchema = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'user' 
      ORDER BY ordinal_position
    `);
    console.table(userSchema.rows);
    
    // Check all tables
    console.log('\n5. ALL TABLES:');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log('Tables:', tables.rows.map(row => row.table_name));
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkDatabase();
