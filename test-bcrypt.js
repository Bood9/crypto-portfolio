const bcrypt = require('bcrypt');


const inputPassword = '1234';


const hashFromDB = '$2b$10$qjO/9DhR1aMGEqpL/BdQBuRzRPS.9L71my9UbaW5Eu6VsBAYaNQcy';

bcrypt.compare(inputPassword, hashFromDB)
  .then(result => {
    console.log(result ? '✅ Пароль совпадает' : '❌ Пароль НЕ совпадает');
  })
  .catch(err => {
    console.error('Ошибка bcrypt:', err);
  });
