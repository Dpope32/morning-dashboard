// scripts/modules/cryptoPrices.js

async function updateCryptoPrices() {
    let totalValue = 0;
    let totalPriceChange = 0;
    let validPriceChanges = 0;
    const cryptoTableBody = document.getElementById('cryptoTableBody');
    if (!cryptoTableBody) return;
    
    const rows = Array.from(cryptoTableBody.getElementsByTagName('tr')).slice(0, -1);

    for (let row of rows) {
        const symbol = row.cells[0].textContent;
        const quantity = parseFloat(ENV.cryptoQuantities[symbol] || 0);
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
                try {
                    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd&precision=10', {
                        mode: 'cors',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    const data = await response.json();
                    price = data.ripple.usd;
                    
                    const cachedData = await localforage.getItem('xrp-price');
                    
                    if (cachedData) {
                        priceChange = ((price - cachedData.price) / cachedData.price) * 100;
                    }
                    
                    await localforage.setItem('xrp-price', {
                        price: price,
                        timestamp: Date.now()
                    });
                } catch (error) {
                    console.error('Error fetching XRP price');
                    const cachedData = await localforage.getItem('xrp-price');
                    if (cachedData) {
                        price = cachedData.price;
                        priceChange = null;
                    }
                }
            } else if (symbol === 'XYO') {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=xyo-network&vs_currencies=usd&precision=10', {
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const data = await response.json();
                price = data['xyo-network'].usd;
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
            console.error('Error fetching price data');
            row.cells[2].innerHTML = '<span class="error">N/A</span>';
            row.cells[3].textContent = 'N/A';
            row.cells[4].textContent = 'N/A';
        }
    }

    const totalValueElement = document.getElementById('cryptoTotalValue');
    if (totalValueElement) {
        totalValueElement.textContent = '$' + formatNumber(totalValue);
        const avgPriceChange = validPriceChanges > 0 ? totalPriceChange / validPriceChanges : 0;
        totalValueElement.className = avgPriceChange >= 0 ? 'positive' : 'negative';
    }
}
