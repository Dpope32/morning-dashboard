// scripts/modules/stockPrices.js

async function updateStockPrices() {
    let totalValue = 0;
    let totalPrincipal = 0;
    const stockTableBody = document.getElementById('stockTableBody');
    if (!stockTableBody) return;
    
    // Hide principal column in table header
    const headerRow = stockTableBody.parentElement.querySelector('thead tr');
    if (headerRow) {
        headerRow.children[5].style.display = 'none'; // Hide "Principal" header
    }
    
    const rows = Array.from(stockTableBody.getElementsByTagName('tr')).slice(0, -1);

    for (let row of rows) {
        const symbol = row.cells[0].textContent;
        const quantity = parseFloat(ENV.stockShares[symbol] || 0);
        const principal = parseFloat(ENV.stockPrincipals[symbol] || 0);
        row.cells[1].textContent = formatNumber(quantity);
        
        // Hide principal cell
        row.cells[5].style.display = 'none';

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
            totalPrincipal += principal;

            row.cells[2].innerHTML = formatPriceChange(priceChange);
            row.cells[3].textContent = '$' + formatNumber(price);
            row.cells[4].textContent = '$' + formatNumber(value);
            
            // Calculate P/L
            const pl = value - principal;
            row.cells[6].textContent = '$' + formatNumber(pl);
            row.cells[6].style.color = pl >= 0 ? '#00C851' : '#ff4444';
                
        } catch (error) {
            console.error('Error fetching stock price data:', error);
            row.cells[2].innerHTML = '<span class="error">N/A</span>';
            row.cells[3].textContent = 'N/A';
            row.cells[4].textContent = 'N/A';
            row.cells[6].textContent = 'N/A';
        }
    }

    // Update total row
    const totalRow = stockTableBody.querySelector('.total-row');
    if (totalRow) {
        const totalPL = totalValue - totalPrincipal;
        totalRow.cells[4].textContent = '$' + formatNumber(totalValue);
        totalRow.cells[5].style.display = 'none'; // Hide principal cell in total row
        totalRow.cells[6].textContent = '$' + formatNumber(totalPL);
        totalRow.cells[6].style.color = totalPL >= 0 ? '#00C851' : '#ff4444';
    }

    const totalValueElement = document.getElementById('stockTotalValue');
    if (totalValueElement) {
        totalValueElement.textContent = '$' + formatNumber(totalValue);
        totalValueElement.className = totalValue >= totalPrincipal ? 'positive' : 'negative';
    }
}
