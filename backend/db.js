const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',        
  host: '172.24.81.54',
  database: 'crypto_portfolio', 
  password: '2005',  
  port: 5432,
});

module.exports = pool;
