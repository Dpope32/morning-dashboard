// scripts/modules/ping.js

async function checkPing() {
    const pingStatusElement = document.getElementById('pingStatus');
    if (!pingStatusElement) return;
    
    try {
        const startTime = performance.now();
        const response = await fetch('https://www.google.com/favicon.ico', {
            mode: 'no-cors',
            cache: 'no-cache'
        });
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);
        
        if (latency < 100) {
            pingStatusElement.innerHTML = `<span class="success">${latency}ms</span>`;
        } else if (latency < 300) {
            pingStatusElement.innerHTML = `<span class="success">${latency}ms</span>`;
        } else {
            pingStatusElement.innerHTML = `<span class="warning">${latency}ms</span>`;
        }
    } catch (error) {
        pingStatusElement.innerHTML = '<span class="error">Failed</span>';
    }
}

async function checkNetworkStatus() {
    const networkStatusElement = document.getElementById('networkStatus');
    if (!networkStatusElement) return;
    
    try {
        const startTime = performance.now();
        const response = await fetch('https://api.coingecko.com/api/v3/ping', {
            mode: 'cors',
            headers: {
                'Accept': 'application/json'
            }
        });
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

// Make functions globally available
window.checkPing = checkPing;
window.checkNetworkStatus = checkNetworkStatus;
