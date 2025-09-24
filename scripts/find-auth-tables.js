const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://medusa@localhost/medusa_v2'
});

async function findAuthTables() {
  const client = await pool.connect();
  
  try {
    console.log('=== FINDING ALL AUTH TABLES ===\n');
    
    // Get all tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%auth%'
      OR table_name LIKE '%user%'
      OR table_name LIKE '%identity%'
      OR table_name LIKE '%provider%'
      ORDER BY table_name
    `);
    
    console.log('AUTH RELATED TABLES:');
    console.table(tables.rows);
    
    // Check if there are any provider tables
    const providerTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%provider%'
      ORDER BY table_name
    `);
    
    console.log('\nPROVIDER TABLES:');
    console.table(providerTables.rows);
    
    // Check all tables to find auth related ones
    const allTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\nALL TABLES (looking for auth patterns):');
    const authRelated = allTables.rows.filter(row => 
      row.table_name.includes('auth') || 
      row.table_name.includes('user') || 
      row.table_name.includes('identity') ||
      row.table_name.includes('provider')
    );
    console.table(authRelated);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

findAuthTables();
