// scripts/modules/marketStatus.js

async function updateMarketStatus() {
    try {
        const response = await fetch(`https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${ENV.FINNHUB_API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const statusElement = document.getElementById('marketStatus');
        if (!statusElement) return;
        
        if (data.isOpen) {
            statusElement.innerHTML = '<span class="success">Open</span>';
        } else {
            statusElement.innerHTML = '<span class="warning">Closed</span>';
        }
    } catch (error) {
        console.error('Error fetching market status');
        const statusElement = document.getElementById('marketStatus');
        if (statusElement) {
            statusElement.innerHTML = '<span class="error">Error</span>';
        }
    }
}
