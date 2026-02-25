const { Pool } = require('pg');
const dns = require('dns');
require('dotenv').config();

// Force IPv4 to avoid IPv6 connection issues
dns.setDefaultResultOrder('ipv4first');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;