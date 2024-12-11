// scripts/modules/weather.js

class WeatherModal {
    constructor() {
        this.createModal();
        this.setupEventListeners();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'weather-modal';

        this.overlay = document.createElement('div');
        this.overlay.className = 'weather-modal-overlay';

        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '×';
        closeButton.onclick = () => this.hide();

        const title = document.createElement('h2');
        title.className = 'modal-title';
        title.textContent = 'Weather Forecast';

        this.modal.appendChild(closeButton);
        this.modal.appendChild(title);
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.modal);
    }

    setupEventListeners() {
        this.overlay.addEventListener('click', () => this.hide());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.hide();
            }
        });
    }

    show() {
        this.modal.style.display = 'block';
        this.overlay.style.display = 'block';
        updateWeather();
    }

    hide() {
        this.modal.style.display = 'none';
        this.overlay.style.display = 'none';
    }
}

function getTemperatureColor(temp) {
    // Cold temperatures (below 32°F)
    if (temp < 32) {
        const percentage = (temp + 20) / 52; // Range from -20°F to 32°F
        return `linear-gradient(to top, #1a237e, #3949ab ${percentage * 100}%)`;
    }
    // Mild temperatures (32°F to 70°F)
    else if (temp < 70) {
        const percentage = (temp - 32) / 38;
        return `linear-gradient(to top, #039be5, #43a047 ${percentage * 100}%)`;
    }
    // Hot temperatures (70°F and above)
    else {
        const percentage = Math.min((temp - 70) / 30, 1);
        return `linear-gradient(to top, #fb8c00, #d32f2f ${percentage * 100}%)`;
    }
}

function updateTemperatureDisplay(highTemp, lowTemp, cell) {
    const date = new Date(cell.dataset.date);
    const dateDisplay = document.createElement('div');
    dateDisplay.className = 'weather-date';
    dateDisplay.textContent = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const barsContainer = document.createElement('div');
    barsContainer.className = 'temp-bars-container';

    // Low temperature column
    const lowBarWrapper = document.createElement('div');
    lowBarWrapper.className = 'temp-bar-wrapper';
    
    const lowBarContainer = document.createElement('div');
    lowBarContainer.className = 'temp-bar-container';
    const lowBar = document.createElement('div');
    lowBar.className = 'temp-bar low';
    const lowPercentage = ((lowTemp + 20) / 140) * 100;
    lowBar.style.height = Math.min(100, Math.max(0, lowPercentage)) + '%';
    lowBar.style.background = getTemperatureColor(lowTemp);
    lowBarContainer.appendChild(lowBar);

    const lowTempValue = document.createElement('div');
    lowTempValue.className = 'temp-value low';
    lowTempValue.textContent = `${Math.round(lowTemp)}°`;

    lowBarWrapper.appendChild(lowBarContainer);
    lowBarWrapper.appendChild(lowTempValue);

    // High temperature column
    const highBarWrapper = document.createElement('div');
    highBarWrapper.className = 'temp-bar-wrapper';
    
    const highBarContainer = document.createElement('div');
    highBarContainer.className = 'temp-bar-container';
    const highBar = document.createElement('div');
    highBar.className = 'temp-bar high';
    const highPercentage = ((highTemp + 20) / 140) * 100;
    highBar.style.height = Math.min(100, Math.max(0, highPercentage)) + '%';
    highBar.style.background = getTemperatureColor(highTemp);
    highBarContainer.appendChild(highBar);

    const highTempValue = document.createElement('div');
    highTempValue.className = 'temp-value high';
    highTempValue.textContent = `${Math.round(highTemp)}°`;

    highBarWrapper.appendChild(highBarContainer);
    highBarWrapper.appendChild(highTempValue);

    // Assemble the components
    barsContainer.appendChild(lowBarWrapper);
    barsContainer.appendChild(highBarWrapper);

    // Clear and update cell content
    cell.innerHTML = '';
    cell.appendChild(dateDisplay);
    cell.appendChild(barsContainer);
}

function createCalendarHeader() {
    const header = document.createElement('div');
    header.className = 'weather-header';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    days.forEach(day => {
        const cell = document.createElement('div');
        cell.className = 'weather-header-cell';
        cell.textContent = day;
        header.appendChild(cell);
    });
    
    return header;
}

function createEmptyCell() {
    const cell = document.createElement('div');
    cell.className = 'weather-cell empty';
    return cell;
}

async function getCoordinatesFromZip() {
    try {
        const storedEnv = localStorage.getItem('dashboardEnv');
        if (storedEnv) {
            const parsedEnv = JSON.parse(storedEnv);
            window.ENV.ZIP_CODE = parsedEnv.ZIP_CODE || window.ENV.ZIP_CODE;
        }

        const zipCode = window.ENV?.ZIP_CODE;
        console.log('Using ZIP code:', zipCode);
        
        if (!zipCode) {
            console.error('No ZIP code found in window.ENV');
            return { latitude: 0, longitude: 0 };
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        const url = `https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&country=USA&format=json`;
        console.log('Geocoding URL:', url);
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'WeatherDashboard/1.0'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Geocoding request failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('Geocoding response:', data);
        
        if (data && data.length > 0) {
            const coords = {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon)
            };
            console.log('Found coordinates:', coords);
            return coords;
        } else {
            console.error('No coordinates found for ZIP code:', zipCode);
            return { latitude: 0, longitude: 0 };
        }
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return { latitude: 0, longitude: 0 };
    }
}

async function updateWeather() {
    try {
        console.log('Starting weather update...');
        console.log('Current ENV:', window.ENV);
        
        const coords = await getCoordinatesFromZip();
        console.log('Using coordinates for weather:', coords);
        
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&daily=temperature_2m_max,temperature_2m_min&forecast_days=16&temperature_unit=fahrenheit&timezone=auto`;
        console.log('Weather API URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Weather API request failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('Weather data:', data);

        const dates = data.daily.time;
        const maxTemps = data.daily.temperature_2m_max;
        const minTemps = data.daily.temperature_2m_min;

        const modal = document.querySelector('.weather-modal');
        const existingGrid = modal.querySelector('.weather-grid');
        const existingHeader = modal.querySelector('.weather-header');
        
        if (existingGrid) existingGrid.remove();
        if (existingHeader) existingHeader.remove();

        const header = createCalendarHeader();
        const grid = document.createElement('div');
        grid.className = 'weather-grid';

        const firstDate = new Date(dates[0]);
        const firstDayOfWeek = firstDate.getDay();

        for (let i = 0; i < firstDayOfWeek; i++) {
            grid.appendChild(createEmptyCell());
        }

        for (let i = 0; i < dates.length; i++) {
            const cell = document.createElement('div');
            cell.className = 'weather-cell';
            cell.dataset.date = dates[i];
            
            if (i === 0) {
                cell.classList.add('today');
            }

            grid.appendChild(cell);
            updateTemperatureDisplay(maxTemps[i], minTemps[i], cell);
        }

        modal.appendChild(header);
        modal.appendChild(grid);

        localStorage.setItem('dashboardEnv', JSON.stringify({
            WEATHER_API_KEY: window.ENV.WEATHER_API_KEY,
            ZIP_CODE: window.ENV.ZIP_CODE,
            FINNHUB_API_KEY: window.ENV.FINNHUB_API_KEY,
            USER_NAME: window.ENV.USER_NAME
        }));

    } catch (error) {
        console.error('Error updating weather:', error);
        const modal = document.querySelector('.weather-modal');
        modal.innerHTML += `
            <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                Unable to load weather data. Please try again later.
            </div>
        `;
    }
}

// Initialize weather modal
const weatherModal = new WeatherModal();

// Export for use in right-sidebar.js
window.weatherModal = weatherModal;
