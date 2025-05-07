const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const portfolioController = require('../controller/portfolio');
const authModel = require('../models/authModel');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('renderer/login.html');
}

// Авторизация
ipcMain.handle('auth:login', async (_, { username, password }) => {
  try {
    const user = await authModel.verifyUser(username, password);
    if (user) {
      mainWindow.loadFile('renderer/index.html');
      return { success: true, user: { id: user.id, username: user.username } };
    } else {
      return { success: false, message: 'Неверные данные' };
    }
  } catch (err) {
    console.error('Ошибка авторизации:', err);
    return { success: false, message: 'Ошибка сервера' };
  }
});

// Остальной функционал
ipcMain.handle('portfolio:get', async () => await portfolioController.getPortfolio());
ipcMain.handle('portfolio:add', async (_, data) => await portfolioController.addToPortfolio(data));
ipcMain.handle('portfolio:delete', async (_, id) => await portfolioController.removeFromPortfolio(id));
ipcMain.handle('portfolio:update', async (_, { id, amount, price_usd }) => await portfolioController.updateAsset(id, amount, price_usd));
ipcMain.handle('portfolio:total', async () => await portfolioController.getTotalValueUSD());
ipcMain.handle('coingecko:getPrice', async (_, symbol) => await portfolioController.getPriceFromAPI(symbol));

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
