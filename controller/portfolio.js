// controller/portfolio.js
const assetModel = require('../models/assetModel');

// Получить все активы (портфель)
async function getPortfolio() {
  return await assetModel.getAllAssets();
}

// Добавить новый актив
async function addToPortfolio(data) {
  const { name, symbol, amount, price_usd } = data;

  // Простая валидация
  if (!name || !symbol || amount <= 0 || price_usd <= 0) {
    throw new Error('Неверные данные');
  }

  return await assetModel.addAsset(name, symbol, amount, price_usd);
}

// Удалить актив
async function removeFromPortfolio(id) {
  return await assetModel.deleteAsset(id);
}

// Обновить актив
async function updateAsset(id, amount, price_usd) {
  return await assetModel.updateAsset(id, amount, price_usd);
}

// Подсчет общей стоимости портфеля
async function getTotalValueUSD() {
  const assets = await assetModel.getAllAssets();
  return assets.reduce((total, asset) => {
    return total + Number(asset.amount) * Number(asset.price_usd);
  }, 0);
}

module.exports = {
  getPortfolio,
  addToPortfolio,
  removeFromPortfolio,
  updateAsset,
  getTotalValueUSD,
};

const fetch = require('node-fetch');

async function getPriceFromAPI(symbol) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`);
    const data = await response.json();
    if (data[symbol.toLowerCase()] && data[symbol.toLowerCase()].usd) {
      return data[symbol.toLowerCase()].usd;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Ошибка при получении цены с CoinGecko:', error);
    return null;
  }
}

module.exports.getPriceFromAPI = getPriceFromAPI;
