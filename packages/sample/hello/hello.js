const { Client } = require('pg');
const { URL } = require('url');

async function main(args) {
  let name = args.name || 'stranger';
  let greeting = 'Hello ' + name + '!';

  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ DATABASE_URL is not defined');
    return { statusCode: 500, body: 'DATABASE_URL is missing' };
  }

  // Parse and log parts of the connection string for debugging
  try {
    const parsed = new URL(dbUrl);
    console.log('🔍 Parsed DATABASE_URL:');
    console.log(' - Host:', parsed.hostname);
    console.log(' - Port:', parsed.port || 'default');
    console.log(' - User:', parsed.username);
    console.log(' - Database:', parsed.pathname?.slice(1));
    console.log(' - SSL: enabled');
  } catch (e) {
    console.error('⚠️ Invalid DATABASE_URL format:', e.message);
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🔌 Attempting to connect to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected successfully!');

    const res = await client.query('SELECT NOW()');
    console.log('🕒 Server time:', res.rows[0]);

    await client.end();
    console.log('🔌 Disconnected cleanly');
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL');
    console.error(' - Error message:', err.message);
    console.error(' - Stack trace:', err.stack);
    return { statusCode: 500, body: 'Database connection failed: ' + err.message };
  }

  return { body: greeting };
}

exports.main = main;
