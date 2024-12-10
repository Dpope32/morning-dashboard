// scripts/main.js

document.addEventListener('DOMContentLoaded', () => {
    updateDateAndGreeting();
    updateMarketStatus();
    checkNetworkStatus();
    checkPing();
    updateStockPrices();
    updateCryptoPrices();
    updateWeather();
    initializeTaskProgress();
    
    // Initialize clock
    initializeClock();
});
