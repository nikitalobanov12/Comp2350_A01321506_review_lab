require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  const config = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
    ssl: { rejectUnauthorized: false } // Add SSL for Aiven/FreeDB
  };

  try {
    const connection = await mysql.createConnection(config);
    console.log('Connected to database successfully!');
    await connection.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

testConnection();