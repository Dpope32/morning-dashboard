// scripts/modules/stockPrices.js

async function updateStockPrices() {
    let totalValue = 0;
    let totalPriceChange = 0;
    let validPriceChanges = 0;
    const stockTableBody = document.getElementById('stockTableBody');
    if (!stockTableBody) return;
    
    const rows = Array.from(stockTableBody.getElementsByTagName('tr')).slice(0, -1);

    for (let row of rows) {
        const symbol = row.cells[0].textContent;
        const quantity = parseFloat(ENV.stockShares[symbol] || 0);
        row.cells[1].textContent = formatNumber(quantity);

        try {
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${ENV.finnhubKey}`);
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
            console.error('Error fetching stock price data');
            row.cells[2].innerHTML = '<span class="error">N/A</span>';
            row.cells[3].textContent = 'N/A';
            row.cells[4].textContent = 'N/A';
        }
    }

    const totalValueElement = document.getElementById('stockTotalValue');
    if (totalValueElement) {
        totalValueElement.textContent = '$' + formatNumber(totalValue);
        const avgPriceChange = validPriceChanges > 0 ? totalPriceChange / validPriceChanges : 0;
        totalValueElement.className = avgPriceChange >= 0 ? 'positive' : 'negative';
    }
}
