const { Pool } = require('pg');

async function createDatabase() {
  // Connect to postgres default database to create new database
  const pool = new Pool({
    connectionString: 'postgres://medusa@localhost/postgres'
  });
  
  const client = await pool.connect();
  
  try {
    console.log('Creating database medusa_v2...');
    await client.query('CREATE DATABASE medusa_v2');
    console.log('Database medusa_v2 created successfully!');
  } catch (error) {
    if (error.code === '42P04') {
      console.log('Database medusa_v2 already exists');
    } else {
      console.error('Error creating database:', error.message);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

createDatabase();
