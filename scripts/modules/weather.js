// scripts/modules/weather.js

function getTemperatureColor(temp) {
    const colors = [
        { temp: -16, color: '#1a237e' }, // Deep blue
        { temp: -8, color: '#283593' },  // Darker blue
        { temp: 0, color: '#3949ab' },   // Dark blue
        { temp: 8, color: '#1e88e5' },   // Medium blue
        { temp: 16, color: '#039be5' },  // Light blue
        { temp: 24, color: '#00acc1' },  // Cyan
        { temp: 32, color: '#00897b' },  // Teal
        { temp: 40, color: '#43a047' },  // Light green
        { temp: 48, color: '#7cb342' },  // Lime green
        { temp: 56, color: '#c0ca33' },  // Yellow green
        { temp: 64, color: '#fdd835' },  // Yellow
        { temp: 72, color: '#ffb300' },  // Amber
        { temp: 80, color: '#fb8c00' },  // Orange
        { temp: 88, color: '#f4511e' },  // Deep orange
        { temp: 96, color: '#e53935' },  // Red
        { temp: 104, color: '#d32f2f' }, // Dark red
        { temp: 112, color: '#c62828' }  // Deep red
    ];

    // Find the appropriate color range
    for (let i = 0; i < colors.length - 1; i++) {
        if (temp <= colors[i + 1].temp) {
            return colors[i].color;
        }
    }
    return colors[colors.length - 1].color;
}

function updateTemperatureDisplay(temp, displayId, barId) {
    const tempDisplay = document.getElementById(displayId);
    const tempBar = document.getElementById(barId);
    if (!tempDisplay || !tempBar) return;
    
    const color = getTemperatureColor(temp);
    
    tempDisplay.textContent = `${temp}°F`;
    tempDisplay.style.color = color;
    
    const percentage = ((temp + 16) / (112 + 16)) * 100;
    tempBar.style.height = `${Math.min(100, Math.max(0, percentage))}%`;
    tempBar.style.backgroundColor = color;
}

function getDayName(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

async function updateWeather() {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${ENV.apiKey}&q=${ENV.zipCode}&days=3&aqi=no`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update current temperature
        const currentTemp = Math.round(data.current.temp_f);
        updateTemperatureDisplay(currentTemp, 'currentTemp', 'tempBar');
        
        // Update tomorrow's temperature and day name
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowTemp = Math.round(data.forecast.forecastday[1].day.avgtemp_f);
        updateTemperatureDisplay(tomorrowTemp, 'tomorrowTemp', 'tomorrowBar');
        const tomorrowDayElement = document.getElementById('tomorrowDay');
        if (tomorrowDayElement) {
            tomorrowDayElement.textContent = getDayName(tomorrow);
        }
        
        // Update next day's temperature and day name
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 2);
        const nextDayTemp = Math.round(data.forecast.forecastday[2].day.avgtemp_f);
        updateTemperatureDisplay(nextDayTemp, 'nextDayTemp', 'nextDayBar');
        const nextDayNameElement = document.getElementById('nextDayName');
        if (nextDayNameElement) {
            nextDayNameElement.textContent = getDayName(nextDay);
        }
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        ['currentTemp', 'tomorrowTemp', 'nextDayTemp'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = 'Error';
            }
        });
    }
}
