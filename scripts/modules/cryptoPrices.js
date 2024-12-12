// scripts/modules/cryptoPrices.js

// Map trading symbols to CoinGecko IDs
const COINGECKO_IDS = {
    'XRP': 'ripple',
    'XYO': 'xyo-network',
    'BTC': 'bitcoin'
};

async function updateCryptoPrices() {
    console.log('Updating crypto prices...');
    console.log('Current ENV:', window.ENV);
    console.log('Crypto quantities:', window.ENV.cryptoQuantities);
    console.log('Crypto principals:', window.ENV.cryptoPrincipals);

    let totalValue = 0;
    let totalPrincipal = 0;
    let totalPriceChange = 0;
    let validPriceChanges = 0;
    const cryptoTableBody = document.getElementById('cryptoTableBody');
    if (!cryptoTableBody) {
        console.error('Crypto table body not found');
        return;
    }
    
    const rows = Array.from(cryptoTableBody.getElementsByTagName('tr')).slice(0, -1);
    console.log('Found rows:', rows.length);

    for (let row of rows) {
        const symbol = row.cells[0].textContent;
        console.log('Processing symbol:', symbol);
        
        const quantity = parseFloat(window.ENV.cryptoQuantities[symbol] || 0);
        const principal = parseFloat(window.ENV.cryptoPrincipals[symbol] || 0);
        console.log(`${symbol} quantity:`, quantity);
        console.log(`${symbol} principal:`, principal);
        
        row.cells[1].textContent = formatNumber(quantity);

        try {
            const coinId = COINGECKO_IDS[symbol];
            if (!coinId) {
                throw new Error(`No CoinGecko ID mapping found for ${symbol}`);
            }

            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(`${symbol} price data:`, data);
            
            const price = data[coinId].usd;
            const priceChange = data[coinId].usd_24h_change;
            const value = price * quantity;
            console.log(`${symbol} calculated value:`, value);
            
            totalValue += value;
            totalPrincipal += principal;
            
            if (!isNaN(priceChange)) {
                totalPriceChange += priceChange;
                validPriceChanges++;
            }

            row.cells[2].innerHTML = formatPriceChange(priceChange);
            row.cells[3].textContent = '$' + formatNumber(price);
            row.cells[4].textContent = '$' + formatNumber(value);
            
            // Calculate and display P/L
            const pl = value - principal;
            row.cells[6].textContent = '$' + formatNumber(pl);
            row.cells[6].className = pl >= 0 ? 'positive' : 'negative';
                
        } catch (error) {
            console.error('Error fetching crypto price data:', error);
            row.cells[2].innerHTML = '<span class="error">N/A</span>';
            row.cells[3].textContent = 'N/A';
            row.cells[4].textContent = 'N/A';
            row.cells[6].textContent = 'N/A';
        }
    }

    console.log('Total value:', totalValue);
    console.log('Total principal:', totalPrincipal);

    const totalValueElement = document.getElementById('cryptoTotalValue');
    if (totalValueElement) {
        totalValueElement.textContent = '$' + formatNumber(totalValue);
        const avgPriceChange = validPriceChanges > 0 ? totalPriceChange / validPriceChanges : 0;
        totalValueElement.className = avgPriceChange >= 0 ? 'positive' : 'negative';
    }

    // Update total P/L
    const totalPLElement = document.getElementById('cryptoTotalPL');
    if (totalPLElement) {
        const totalPL = totalValue - totalPrincipal;
        totalPLElement.textContent = '$' + formatNumber(totalPL);
        totalPLElement.className = totalPL >= 0 ? 'positive' : 'negative';
    }

    // Hide principal column
    const headerRow = cryptoTableBody.parentElement.querySelector('thead tr');
    if (headerRow) {
        headerRow.children[5].style.display = 'none';
    }
    rows.forEach(row => {
        row.cells[5].style.display = 'none';
    });
    const totalRow = cryptoTableBody.querySelector('.total-row');
    if (totalRow) {
        totalRow.cells[5].style.display = 'none';
    }
}
