const { Client } = require('pg');
const { URL } = require('url');

async function main(args) {
  let name = args.name || 'stranger';
  let greeting = 'Hello ' + name + '!';

  // Use the provided connection string directly
  const dbUrl = 'postgres://doadmin:AVNS_Ml9v4Iw73AA1xqOJlFw@db-postgresql-sgp1-03058-do-user-16324282-0.h.db.ondigitalocean.com:25060/defaultdb';

  // Parse and log parts of the connection string for debugging
  let parsed;
  try {
    parsed = new URL(dbUrl);
    console.log('🔍 Parsed DATABASE_URL:');
    console.log(' - Host:', parsed.hostname);
    console.log(' - Port:', parsed.port || 'default');
    console.log(' - User:', parsed.username);
    console.log(' - Database:', parsed.pathname?.slice(1));
    console.log(' - SSL: enabled\n');
  } catch (e) {
    console.error('⚠️ Invalid connection string format:', e.message);
    return { statusCode: 500, body: 'Invalid connection string format' };
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
