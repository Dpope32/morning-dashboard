class RightSidebar {
    constructor() {
        this.sidebar = document.getElementById('rightSidebar');
        this.isOpen = true;
        this.setupCloseButton();
        this.setupToggleButton();
        this.setupEventListeners();
        this.removeHeader();
        this.loadData();
        this.setupTaskStoreMonitor();
        this.setupWeatherButton();
    }

    removeHeader() {
        const header = this.sidebar.querySelector('h3');
        if (header) {
            header.remove();
        }
    }

    loadData() {
        setTimeout(() => {
            const cpuElement = this.sidebar.querySelector('.cpu-section');
            const ramElement = this.sidebar.querySelector('.ram-section');
            if (cpuElement) {
                cpuElement.innerHTML = 'CPU: 45%';
            }
            if (ramElement) {
                ramElement.innerHTML = 'RAM: 60%';
            }
        }, 1000);
    }

    setupWeatherButton() {
        const weatherSection = document.createElement('div');
        weatherSection.style.cssText = `
            margin-top: 20px;
            padding: 0 15px;
        `;

        const weatherButton = document.createElement('button');
        weatherButton.className = 'weather-button';
        weatherButton.style.cssText = `
            width: 100%;
            padding: 10px 15px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-secondary);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9em;
            transition: all 0.2s ease;
            text-align: left;
        `;

        // Create icon container
        const iconSpan = document.createElement('span');
        iconSpan.textContent = '🌤️';
        iconSpan.style.fontSize = '1.1em';

        // Create text container
        const textSpan = document.createElement('span');
        textSpan.textContent = 'Weather Forecast';

        weatherButton.appendChild(iconSpan);
        weatherButton.appendChild(textSpan);

        weatherButton.addEventListener('mouseover', () => {
            weatherButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            weatherButton.style.color = 'var(--text-primary)';
        });

        weatherButton.addEventListener('mouseout', () => {
            weatherButton.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            weatherButton.style.color = 'var(--text-secondary)';
        });

        weatherButton.addEventListener('click', () => {
            if (window.weatherModal) {
                window.weatherModal.show();
            }
        });

        weatherSection.appendChild(weatherButton);
        this.sidebar.appendChild(weatherSection);
    }

    setupTaskStoreMonitor() {
        // Create store monitor section
        const monitorSection = document.createElement('div');
        monitorSection.className = 'store-monitor';
        monitorSection.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
        `;

        // Create header
        const header = document.createElement('div');
        header.style.cssText = `
            font-weight: 600;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <span>Task Store</span>
            <span class="store-status-indicator" style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #00C851;
            "></span>
        `;
        monitorSection.appendChild(header);

        // Create content
        const content = document.createElement('div');
        content.className = 'store-monitor-content';
        content.style.cssText = `
            font-size: 0.9em;
            color: var(--text-secondary);
        `;
        monitorSection.appendChild(content);

        // Add storage meter
        const storageMeter = document.createElement('div');
        storageMeter.className = 'storage-meter';
        storageMeter.style.cssText = `
            margin-top: 10px;
            background: rgba(255, 255, 255, 0.1);
            height: 4px;
            border-radius: 2px;
            overflow: hidden;
        `;
        const storageUsed = document.createElement('div');
        storageUsed.className = 'storage-used';
        storageUsed.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #00C851, #007E33);
            width: 0%;
            transition: width 0.3s ease;
        `;
        storageMeter.appendChild(storageUsed);
        monitorSection.appendChild(storageMeter);

        // Add to sidebar
        this.sidebar.appendChild(monitorSection);

        // Update monitor data
        const updateMonitor = () => {
            if (window.taskStore) {
                const status = window.taskStore.getStoreStatus();
                content.innerHTML = `
                    <div style="margin-bottom: 4px;">Week ${status.currentWeek}</div>
                    <div style="margin-bottom: 4px;">Tasks: ${status.taskCount}</div>
                    <div style="margin-bottom: 4px;">Storage: ${(status.storageUsed / 1024).toFixed(1)}KB used</div>
                    <div style="font-size: 0.8em;">Last Reset: ${new Date(status.lastReset).toLocaleString()}</div>
                `;
                storageUsed.style.width = `${status.storagePercentage}%`;
            }
        };

        // Initial update
        updateMonitor();

        // Subscribe to store changes
        if (window.taskStore) {
            window.taskStore.subscribe(updateMonitor);
        }
    }

    setupCloseButton() {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '☰';
        closeBtn.className = 'right-sidebar-close';
        this.sidebar.insertBefore(closeBtn, this.sidebar.firstChild);
        
        closeBtn.addEventListener('click', () => {
            this.closeSidebar();
        });
    }

    setupToggleButton() {
        const existingToggle = document.querySelector('.right-sidebar-toggle');
        if (existingToggle) {
            existingToggle.remove();
        }

        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = '☰';
        toggleBtn.className = 'right-sidebar-toggle';
        document.body.appendChild(toggleBtn);
        
        toggleBtn.style.display = 'none';
        
        toggleBtn.addEventListener('click', () => {
            this.toggleSidebar();
        });

        this.toggleBtn = toggleBtn;
    }

    closeSidebar() {
        this.sidebar.style.transform = 'translateX(100%)';
        this.toggleBtn.style.display = 'flex';
        this.isOpen = false;
    }

    openSidebar() {
        this.sidebar.style.transform = 'translateX(0)';
        this.toggleBtn.style.display = 'none';
        this.isOpen = true;
    }

    toggleSidebar() {
        if (this.isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    setupEventListeners() {
        const mediaQuery = window.matchMedia('(max-width: 1200px)');
        const handleMediaChange = (e) => {
            if (e.matches) {
                this.closeSidebar();
            } else {
                this.openSidebar();
            }
        };
        mediaQuery.addListener(handleMediaChange);
        handleMediaChange(mediaQuery);

        this.adjustLayoutSpacing();
    }

    adjustLayoutSpacing() {
        const buttons = this.sidebar.querySelectorAll('.button-class');
        const cards = this.sidebar.querySelectorAll('.card-class');

        if (buttons.length && cards.length) {
            cards.forEach(card => {
                card.style.marginTop = '10px';
            });
        }
    }
}

// Initialize right sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RightSidebar();
});
