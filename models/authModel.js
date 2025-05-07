const pool = require('../backend/db');

async function verifyUser(username, password) {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    return result.rows[0] || false;
  } catch (err) {
    console.error('Ошибка в verifyUser:', err);
    throw err;
  }
}

module.exports = {
  verifyUser,
};
