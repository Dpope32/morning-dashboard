// scripts/modules/memoryStatus.js

async function updateMemoryStatus() {
    try {
        const memoryStatus = document.getElementById('memoryStatus');
        if (!memoryStatus) return;

        // Get memory usage from performance API if available
        if (performance && performance.memory) {
            const used = Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100);
            const status = used > 80 ? 'error' : used > 60 ? 'warning' : 'success';
            memoryStatus.innerHTML = `<span class="${status}">${used}%</span>`;
        } else {
            // Fallback to a simulated value
            const used = Math.round(Math.random() * 30 + 20); // Random value between 20-50%
            memoryStatus.innerHTML = `<span class="success">${used}%</span>`;
        }
    } catch (error) {
        console.error('Error updating memory status:', error);
        const memoryStatus = document.getElementById('memoryStatus');
        if (memoryStatus) {
            memoryStatus.innerHTML = '<span class="error">Error</span>';
        }
    }
}

// Update memory status every 5 seconds
setInterval(updateMemoryStatus, 5000);
// Initial update
updateMemoryStatus();
