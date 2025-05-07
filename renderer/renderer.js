const { ipcRenderer } = require('electron');

const form = document.getElementById('asset-form');
const tableBody = document.querySelector('#asset-table tbody');
const totalValueEl = document.getElementById('total-value');
const priceInput = document.getElementById('price');
const symbolInput = document.getElementById('symbol');
const chartTypeSelect = document.getElementById('chartType');
let chart = null;
let currentChartType = 'doughnut';

// CoinGecko
const coinSymbolToId = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana',
  DOGE: 'dogecoin', BNB: 'binancecoin', XRP: 'ripple',
  USDT: 'tether', ADA: 'cardano', DOT: 'polkadot', MATIC: 'matic-network'
};

let symbolTimeout = null;

symbolInput.addEventListener('input', () => {
  const rawSymbol = symbolInput.value.trim().toUpperCase();
  const coinId = coinSymbolToId[rawSymbol];
  clearTimeout(symbolTimeout);

  if (coinId) {
    symbolTimeout = setTimeout(async () => {
      try {
        const price = await ipcRenderer.invoke('coingecko:getPrice', coinId);
        if (price !== null) priceInput.value = price.toFixed(2);
      } catch (err) {
        console.error('Ошибка при получении цены с CoinGecko:', err);
      }
    }, 500);
  }
});

chartTypeSelect.addEventListener('change', () => {
  currentChartType = chartTypeSelect.value === 'bar-y' ? 'bar' : chartTypeSelect.value;
  loadPortfolio(); // перерисует
});

async function loadPortfolio() {
  try {
    const assets = await ipcRenderer.invoke('portfolio:get');
    tableBody.innerHTML = '';

    assets.forEach(asset => {
      const row = document.createElement('tr');
      const totalFormatted = (asset.amount * asset.price_usd).toLocaleString('ru-RU', { minimumFractionDigits: 2 });
      const priceFormatted = asset.price_usd.toLocaleString('ru-RU', { minimumFractionDigits: 2 });

      row.innerHTML = `
        <td>${asset.name}</td>
        <td>${asset.symbol}</td>
        <td>${asset.amount}</td>
        <td>${priceFormatted}</td>
        <td>${totalFormatted}</td>
        <td>
          <button onclick="confirmDeleteAsset(${asset.id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    updateTotalValue();
    updateChart(assets);
  } catch (err) {
    console.error('❌ Ошибка загрузки портфеля:', err);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const symbol = document.getElementById('symbol').value.trim().toUpperCase();
  const amount = parseFloat(document.getElementById('amount').value);
  const price_usd = parseFloat(document.getElementById('price').value);

  if (!name || !symbol || isNaN(amount) || isNaN(price_usd)) {
    alert('Пожалуйста, заполните все поля корректно!');
    return;
  }

  try {
    await ipcRenderer.invoke('portfolio:add', { name, symbol, amount, price_usd });
    form.reset();
    loadPortfolio();
  } catch (err) {
    console.error('❌ Ошибка при добавлении актива:', err);
    alert('Ошибка при добавлении. Проверьте подключение к базе данных.');
  }
});

let assetIdToDelete = null;

function confirmDeleteAsset(id) {
  assetIdToDelete = id;
  document.getElementById('confirmModal').style.display = 'flex';
}

document.getElementById('confirmDelete').addEventListener('click', async () => {
  if (assetIdToDelete !== null) {
    try {
      await ipcRenderer.invoke('portfolio:delete', assetIdToDelete);
    } catch (err) {
      console.error('❌ Ошибка при удалении:', err);
      alert('Ошибка при удалении актива.');
    } finally {
      assetIdToDelete = null;
      document.getElementById('confirmModal').style.display = 'none';
      loadPortfolio();
    }
  }
});

document.getElementById('cancelDelete').addEventListener('click', () => {
  assetIdToDelete = null;
  document.getElementById('confirmModal').style.display = 'none';
});

async function updateTotalValue() {
  try {
    const total = await ipcRenderer.invoke('portfolio:total');
    totalValueEl.textContent = `$${total.toLocaleString('ru-RU', { minimumFractionDigits: 2 })}`;
  } catch (err) {
    console.error('❌ Ошибка при подсчёте суммы:', err);
  }
}

function updateChart(assets) {
  const ctx = document.getElementById('portfolioChart').getContext('2d');
  const labels = assets.map(a => a.symbol);
  const data = assets.map(a => a.amount * a.price_usd);

  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56',
    '#4BC0C0', '#9966FF', '#FF9F40',
    '#8B0000', '#008000', '#800080'
  ];

  if (chart) chart.destroy();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: { size: 14 }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed;
            const total = data.reduce((a, b) => a + b, 0);
            const percent = ((value / total) * 100).toFixed(1);
            return `${context.label}: $${value.toLocaleString('ru-RU')} (${percent}%)`;
          }
        }
      }
    }
  };

  if (chartTypeSelect.value === 'bar-y') {
    options.indexAxis = 'y';
  }

  chart = new Chart(ctx, {
    type: currentChartType,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 1
      }]
    },
    options
  });
}

loadPortfolio();

const themeToggleBtn = document.getElementById('toggle-theme');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.body.classList.add('light');
}

themeToggleBtn?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const theme = document.body.classList.contains('light') ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
});

document.getElementById('username-placeholder').textContent = localStorage.getItem('username') || 'Пользователь';
const welcomeEl = document.getElementById('welcome-message');
const username = localStorage.getItem('username');
if (username) {
  welcomeEl.textContent = `Добро пожаловать, ${username}!`;
  setTimeout(() => {
    welcomeEl.textContent = '';
  }, 5000);
}
