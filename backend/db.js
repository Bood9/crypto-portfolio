const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',         // имя пользователя БД
  host: '172.24.81.54',
  database: 'crypto_portfolio', // название БД
  password: '2005',  // замени на свой пароль от PostgreSQL
  port: 5432,
});

module.exports = pool;
