const bcrypt = require('bcrypt');

// 👉 Это пароль, который ты хочешь проверить
const inputPassword = '1234';

// 👉 Это хеш из твоей базы (скопируй точно из SELECT * FROM users)
const hashFromDB = '$2b$10$qjO/9DhR1aMGEqpL/BdQBuRzRPS.9L71my9UbaW5Eu6VsBAYaNQcy';

bcrypt.compare(inputPassword, hashFromDB)
  .then(result => {
    console.log(result ? '✅ Пароль совпадает' : '❌ Пароль НЕ совпадает');
  })
  .catch(err => {
    console.error('Ошибка bcrypt:', err);
  });
