const bcrypt = require('bcrypt');

(async () => {
  const hash = await bcrypt.hash('1234', 10);
  console.log('Хеш пароля 1234:', hash);
})();
