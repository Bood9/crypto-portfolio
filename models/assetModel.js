// models/assetModel.js
const { Pool } = require('pg');

// Настройки подключения к PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: '172.24.81.54',
  database: 'crypto_portfolio',
  password: '2005', // замени на свой пароль
  port: 5432,
});

// Получить все активы
async function getAllAssets() {
  const result = await pool.query('SELECT * FROM assets ORDER BY added_at DESC');
  return result.rows;
}

// Добавить новый актив
async function addAsset(name, symbol, amount, price_usd) {
  const query = `
    INSERT INTO assets (name, symbol, amount, price_usd)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [name, symbol, amount, price_usd];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Удалить актив по ID
async function deleteAsset(id) {
  await pool.query('DELETE FROM assets WHERE id = $1', [id]);
}

// Обновить актив по ID
async function updateAsset(id, amount, price_usd) {
  const query = `
    UPDATE assets
    SET amount = $1, price_usd = $2
    WHERE id = $3
    RETURNING *;
  `;
  const values = [amount, price_usd, id];
  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = {
  getAllAssets,
  addAsset,
  deleteAsset,
  updateAsset,
};
