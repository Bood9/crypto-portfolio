const pool = require('./db');

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Успешное подключение к БД. Время:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Ошибка подключения к БД:', err.message);
  } finally {
    pool.end();
  }
}

testConnection();
