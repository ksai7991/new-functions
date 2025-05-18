const { Client } = require('pg');

async function main(args) {
  let name = args.name || 'stranger';
  let greeting = 'Hello ' + name + '!';

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Optional: Run a test query
    const res = await client.query('SELECT NOW()');
    console.log('Server time:', res.rows[0]);

    await client.end();
  } catch (err) {
    console.error('Database connection error:', err);
    return { statusCode: 500, body: 'Database connection failed' };
  }

  console.log(greeting);
  return { body: greeting };
}

exports.main = main;
