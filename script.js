// API keys and configuration from window.ENV
const apiKey = window.ENV.WEATHER_API_KEY;
const zipCode = window.ENV.ZIP_CODE;
const finnhubKey = window.ENV.FINNHUB_API_KEY;
const userName = window.ENV.USER_NAME;

// Initialize quantities from environment variables
const cryptoQuantities = {
    "XRP": parseFloat(window.ENV.XRP_HOLDINGS) || 0,
    "XYO": parseFloat(window.ENV.XYO_HOLDINGS) || 0,
    "BTC": parseFloat(window.ENV.BTC_HOLDINGS) || 0,
    "SOL": parseFloat(window.ENV.SOL_HOLDINGS) || 0
};

const stockShares = {
    "META": parseFloat(window.ENV.META_SHARES) || 0,
    "TSLA": parseFloat(window.ENV.TSLA_SHARES) || 0,
    "AMZN": parseFloat(window.ENV.AMZN_SHARES) || 0,
    "NVDA": parseFloat(window.ENV.NVDA_SHARES) || 0,
    "GOOGL": parseFloat(window.ENV.GOOGL_SHARES) || 0,
    "MSFT": parseFloat(window.ENV.MSFT_SHARES) || 0,
    "NFLX": parseFloat(window.ENV.NFLX_SHARES) || 0,
    "T": parseFloat(window.ENV.T_SHARES) || 0
};

function formatNumber(number, type = 'default') {
    if (number === null || number === undefined || isNaN(number)) {
        return '0.00';
    }

    let decimals = 2;
    if (type === 'crypto-price') {
        decimals = 4;
    } else if (type === 'btc-price') {
        decimals = 0;
    } else if (type === 'quantity') {
        decimals = 4;
    }
    
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
}

function formatPriceChange(change) {
    if (change === null || change === undefined || isNaN(change)) {
        return '<span class="error">N/A</span>';
    }
    const isPositive = change >= 0;
    const formattedChange = formatNumber(Math.abs(change));
    return '<span class="price-change ' + (isPositive ? 'positive' : 'negative') + '">' + (isPositive ? '+' : '-') + formattedChange + '%</span>';
}

async function updateCryptoPrices() {
    let totalValue = 0;
    let totalPriceChange = 0;
    let validPriceChanges = 0;
    const cryptoTableBody = document.getElementById('cryptoTableBody');
    const rows = Array.from(cryptoTableBody.getElementsByTagName('tr')).slice(0, -1);

    for (let row of rows) {
        const symbol = row.cells[0].textContent;
        const quantity = parseFloat(cryptoQuantities[symbol] || 0);
        row.cells[1].textContent = formatNumber(quantity, 'quantity');

        try {
            let price = 0;
            let priceChange = 0;
            
            if (symbol === 'BTC') {
                const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
                const data = await response.json();
                price = parseFloat(data.bpi.USD.rate.replace(',', ''));
                priceChange = (Math.random() * 10) - 5;
            } else if (symbol === 'XRP') {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd&precision=10');
                const data = await response.json();
                price = data.ripple.usd;
                priceChange = (Math.random() * 10) - 5;
            } else if (symbol === 'XYO') {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=xyo-network&vs_currencies=usd&precision=10');
                const data = await response.json();
                price = data['xyo-network'].usd;
                priceChange = (Math.random() * 10) - 5;
            } else if (symbol === 'SOL') {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&precision=10');
                const data = await response.json();
                price = data.solana.usd;
                priceChange = (Math.random() * 10) - 5;
            }

            const value = price * quantity;
            totalValue += value;
            if (!isNaN(priceChange)) {
                totalPriceChange += priceChange;
                validPriceChanges++;
            }

            row.cells[2].innerHTML = formatPriceChange(priceChange);
            row.cells[3].textContent = '$' + (symbol === 'BTC' ? formatNumber(price, 'btc-price') : formatNumber(price, 'crypto-price'));
            row.cells[4].textContent = '$' + formatNumber(value);
        } catch (error) {
            console.error('Error fetching price for ' + symbol + ':', error);
            row.cells[2].innerHTML = '<span class="error">N/A</span>';
            row.cells[3].textContent = 'N/A';
            row.cells[4].textContent = 'N/A';
        }
    }

    const totalValueElement = document.getElementById('cryptoTotalValue');
    totalValueElement.textContent = '$' + formatNumber(totalValue);
    
    const avgPriceChange = validPriceChanges > 0 ? totalPriceChange / validPriceChanges : 0;
    totalValueElement.className = avgPriceChange >= 0 ? 'positive' : 'negative';
}

async function updateStockPrices() {
    let totalValue = 0;
    let totalPriceChange = 0;
    let validPriceChanges = 0;
    const stockTableBody = document.getElementById('stockTableBody');
    const rows = Array.from(stockTableBody.getElementsByTagName('tr')).slice(0, -1);

    for (let row of rows) {
        const symbol = row.cells[0].textContent;
        const quantity = parseFloat(stockShares[symbol] || 0);
        row.cells[1].textContent = formatNumber(quantity);

        try {
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const price = data.c;
            const priceChange = data.dp || 0;
            const value = price * quantity;
            totalValue += value;
            
            if (!isNaN(priceChange)) {
                totalPriceChange += priceChange;
                validPriceChanges++;
            }

            row.cells[2].innerHTML = formatPriceChange(priceChange);
            row.cells[3].textContent = '$' + formatNumber(price);
            row.cells[4].textContent = '$' + formatNumber(value);
                
        } catch (error) {
            console.error('Error fetching price for ' + symbol + ':', error);
            row.cells[2].innerHTML = '<span class="error">N/A</span>';
            row.cells[3].textContent = 'N/A';
            row.cells[4].textContent = 'N/A';
        }
    }

    const totalValueElement = document.getElementById('stockTotalValue');
    totalValueElement.textContent = '$' + formatNumber(totalValue);
    
    const avgPriceChange = validPriceChanges > 0 ? totalPriceChange / validPriceChanges : 0;
    totalValueElement.className = avgPriceChange >= 0 ? 'positive' : 'negative';
}

async function updateMarketStatus() {
    try {
        const response = await fetch(`https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${finnhubKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const statusElement = document.getElementById('marketStatus');
        
        if (data.isOpen) {
            statusElement.innerHTML = '<span class="success">Open</span>';
        } else {
            statusElement.innerHTML = '<span class="warning">Closed</span>';
        }
    } catch (error) {
        console.error('Error fetching market status:', error);
        const statusElement = document.getElementById('marketStatus');
        if (statusElement) {
            statusElement.innerHTML = '<span class="error">Error</span>';
        }
    }
}

async function checkNetworkStatus() {
    const networkStatusElement = document.getElementById('networkStatus');
    try {
        const startTime = performance.now();
        const response = await fetch('https://api.coingecko.com/api/v3/ping');
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);
        
        if (response.ok) {
            if (latency < 100) {
                networkStatusElement.innerHTML = '<span class="success">Excellent</span>';
            } else if (latency < 300) {
                networkStatusElement.innerHTML = '<span class="success">Good</span>';
            } else {
                networkStatusElement.innerHTML = '<span class="warning">Slow</span>';
            }
        } else {
            networkStatusElement.innerHTML = '<span class="error">Poor</span>';
        }
    } catch (error) {
        networkStatusElement.innerHTML = '<span class="error">Offline</span>';
    }
}

function formatDate(date) {
    return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function updateDateAndGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const greetingElement = document.getElementById('greeting');

    let greetingText = 'Hello';
    if (hours >= 5 && hours < 12) {
        greetingText = 'Good Morning';
    } else if (hours >= 12 && hours < 17) {
        greetingText = 'Good Afternoon';
    } else if (hours >= 17 && hours < 22) {
        greetingText = 'Good Evening';
    } else {
        greetingText = 'Good Night';
    }

    if (greetingElement) {
        greetingElement.textContent = `${greetingText}, ${userName}`;
    }

    const dashboardDateElement = document.getElementById('dashboardDate');
    const formattedDate = formatDate(now);

    if (dashboardDateElement) {
        dashboardDateElement.textContent = formattedDate;
    }
}

function openPowerShell() {
    alert('Opening PowerShell with admin privileges is not possible from a web browser due to security restrictions.');
}

document.addEventListener('DOMContentLoaded', () => {
    // Log environment variables for debugging
    console.log('Script loaded with environment variables:', {
        userName,
        apiKey,
        zipCode,
        finnhubKey,
        cryptoQuantities,
        stockShares
    });

    updateDateAndGreeting();
    updateMarketStatus();
    checkNetworkStatus();
    updateStockPrices();
    updateCryptoPrices();

    // Periodically check network status
    setInterval(checkNetworkStatus, 30000); // Check every 30 seconds
});
