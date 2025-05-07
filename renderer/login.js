const { ipcRenderer } = require('electron');

const loginBtn = document.getElementById('login-btn');
const errorEl = document.getElementById('login-error');

loginBtn.addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  const result = await ipcRenderer.invoke('auth:login', { username, password });

  if (result.success) {
    // Успешный вход — новое окно подгружается с main.js
  } else {
    errorEl.textContent = result.message || 'Неверный логин или пароль';
    errorEl.style.display = 'block';
  }
});
