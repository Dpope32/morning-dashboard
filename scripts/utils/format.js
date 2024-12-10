// scripts/utils/format.js

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
