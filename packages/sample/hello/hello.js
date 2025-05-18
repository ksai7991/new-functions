const { Client } = require('pg');

async function main(args) {
  let name = args.name || 'stranger';
  let greeting = 'Hello ' + name + '!';

  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('DATABASE_URL environment variable is not set.');
    return { statusCode: 500, body: 'Database configuration missing' };
  }

  console.log('Using DATABASE_URL:', dbUrl);

  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Attempting to connect to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Optional: Run a test query
    const res = await client.query('SELECT NOW()');
    console.log('🕒 Server time:', res.rows[0]);

    await client.end();
    console.log('🔌 Disconnected from PostgreSQL');
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    console.error('Full error object:', err);
    return { statusCode: 500, body: 'Database connection failed: ' + err.message };
  }

  console.log(greeting);
  return { body: greeting };
}

exports.main = main;
