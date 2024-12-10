// scripts/modules/clock.js

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const clockElement = document.getElementById('clock');
    
    if (!clockElement) return;

    // Format time in 12-hour format with seconds
    const displayHours = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
    
    // Update clock display
    clockElement.textContent = timeString;
}

function initializeClock() {
    updateClock();
    setInterval(updateClock, 1000);
}
