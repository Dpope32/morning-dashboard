class RightSidebar {
    constructor() {
        this.sidebar = document.getElementById('rightSidebar');
        this.isOpen = false;
        this.closeSidebar();
        this.setupCloseButton();
        this.setupToggleButton();
        this.setupEventListeners();
        this.removeHeader();
        this.setupWeatherButton();
        this.setupTaskManagerButton();
        this.setupProjectManagerButton();
        this.setupCryptoButton();
        this.setupStocksButton();
        this.setupPomodoroButton();
        this.loadData();
        this.setupTaskStoreMonitor();
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
            margin-top: 15px;
            padding: 0 15px;
        `;

        const weatherButton = document.createElement('button');
        weatherButton.className = 'weather-button';
        weatherButton.style.cssText = `
            width: 100%;
            padding: 10px 15px;
            background: rgb(32, 35, 36);
            border: 1px solid rgb(52, 54, 55);
            border-radius: 20px;
            color: rgb(232, 230, 227);
            cursor: pointer;
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            gap: 8px;
            font-size: 0.85em;
            transition: all 0.2s ease;
            position: relative;
        `;

        // Create icon container
        const iconSpan = document.createElement('span');
        iconSpan.textContent = '🌤️';
        iconSpan.style.cssText = `
            font-size: 1.1em;
            justify-self: start;
        `;

        // Create text container
        const textSpan = document.createElement('span');
        textSpan.textContent = 'Weather';
        textSpan.style.cssText = `
            text-align: center;
            color: rgb(232, 230, 227);
            margin-left: -24px;
        `;

        weatherButton.appendChild(iconSpan);
        weatherButton.appendChild(textSpan);

        weatherButton.addEventListener('mouseover', () => {
            weatherButton.style.backgroundColor = 'rgb(35, 38, 40)';
            weatherButton.style.color = 'rgb(232, 230, 227)';
        });

        weatherButton.addEventListener('mouseout', () => {
            weatherButton.style.backgroundColor = 'rgb(32, 35, 36)';
        });

        weatherButton.addEventListener('click', () => {
            if (window.weatherModal) {
                window.weatherModal.show();
            }
        });

        weatherSection.appendChild(weatherButton);
        
        // Insert after the button-group
        const buttonGroup = this.sidebar.querySelector('.button-group');
        if (buttonGroup) {
            buttonGroup.insertAdjacentElement('afterend', weatherSection);
        }
    }

    setupTaskManagerButton() {
        const taskSection = document.createElement('div');
        taskSection.style.cssText = `
            margin-top: 15px;
            padding: 0 15px;
        `;

        const taskButton = document.createElement('button');
        taskButton.className = 'task-manager-button';
        taskButton.style.cssText = `
            width: 100%;
            padding: 10px 15px;
            background: rgb(32, 35, 36);
            border: 1px solid rgb(52, 54, 55);
            border-radius: 20px;
            color: rgb(232, 230, 227);
            cursor: pointer;
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            gap: 8px;
            font-size: 0.85em;
            transition: all 0.2s ease;
            position: relative;
        `;

        // Create icon container
        const iconSpan = document.createElement('span');
        iconSpan.textContent = '📋';
        iconSpan.style.cssText = `
            font-size: 1.1em;
            justify-self: start;
        `;

        // Create text container
        const textSpan = document.createElement('span');
        textSpan.textContent = 'Task';
        textSpan.style.cssText = `
            text-align: center;
            margin-left: -24px;
            color: rgb(232, 230, 227);
        `;

        taskButton.appendChild(iconSpan);
        taskButton.appendChild(textSpan);

        taskButton.addEventListener('mouseover', () => {
            taskButton.style.backgroundColor = 'rgb(35, 38, 40)';
        });

        taskButton.addEventListener('mouseout', () => {
            taskButton.style.backgroundColor = 'rgb(32, 35, 36)';
        });

        taskButton.addEventListener('click', () => {
            if (window.taskModal) {
                window.taskModal.show();
            }
        });

        taskSection.appendChild(taskButton);
        
        // Insert after the weather button
        const weatherButton = this.sidebar.querySelector('.weather-button');
        if (weatherButton) {
            const weatherSection = weatherButton.closest('div');
            weatherSection.insertAdjacentElement('afterend', taskSection);
        }
    }

    setupProjectManagerButton() {
        const projectSection = document.createElement('div');
        projectSection.style.cssText = `
            margin-top: 15px;
            padding: 0 15px;
        `;

        const projectButton = document.createElement('button');
        projectButton.className = 'project-manager-button';
        projectButton.style.cssText = `
            width: 100%;
            padding: 10px 15px;
            background: rgb(32, 35, 36);
            border: 1px solid rgb(52, 54, 55);
            border-radius: 20px;
            color: rgb(232, 230, 227);
            cursor: pointer;
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            gap: 8px;
            font-size: 0.85em;
            transition: all 0.2s ease;
            position: relative;
        `;

        // Create icon container
        const iconSpan = document.createElement('span');
        iconSpan.textContent = '☗';
        iconSpan.style.cssText = `
            font-size: 1.1em;
            justify-self: start;
        `;

        // Create text container
        const textSpan = document.createElement('span');
        textSpan.textContent = 'Projects';
         textSpan.style.cssText = `
            text-align: center;
            color: rgb(232, 230, 227);
            margin-left: -24px;
        `;

        projectButton.appendChild(iconSpan);
        projectButton.appendChild(textSpan);

        projectButton.addEventListener('mouseover', () => {
            projectButton.style.backgroundColor = 'rgb(35, 38, 40)';
        });

        projectButton.addEventListener('mouseout', () => {
            projectButton.style.backgroundColor = 'rgb(32, 35, 36)';
        });

       projectButton.addEventListener('click', () => {
            if (window.projectManagerModal) {
                window.projectManagerModal.show();
            }
        });

        projectSection.appendChild(projectButton);
        
        // Insert after the task button
        const taskButton = this.sidebar.querySelector('.task-manager-button');
        if (taskButton) {
            const taskSection = taskButton.closest('div');
            taskSection.insertAdjacentElement('afterend', projectSection);
        }
    }

    setupCryptoButton() {
        const cryptoSection = document.createElement('div');
        cryptoSection.style.cssText = `
            margin-top: 15px;
            padding: 0 15px;
        `;

        const cryptoButton = document.createElement('button');
        cryptoButton.className = 'crypto-button';
        cryptoButton.style.cssText = `
            width: 100%;
            padding: 10px 15px;
            background: rgb(32, 35, 36);
            border: 1px solid rgb(52, 54, 55);
            border-radius: 20px;
            color: rgb(232, 230, 227);
            cursor: pointer;
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            gap: 8px;
            font-size: 0.85em;
            transition: all 0.2s ease;
            position: relative;
        `;

        // Create icon container
        const iconSpan = document.createElement('span');
        iconSpan.textContent = '₿';
        iconSpan.style.cssText = `
            font-size: 1.1em;
            justify-self: start;
        `;

        // Create text container
        const textSpan = document.createElement('span');
        textSpan.textContent = 'Crypto';
        textSpan.style.cssText = `
            text-align: center;
            margin-left: -24px;
            color: rgb(232, 230, 227);
        `;

        cryptoButton.appendChild(iconSpan);
        cryptoButton.appendChild(textSpan);

        cryptoButton.addEventListener('mouseover', () => {
            cryptoButton.style.backgroundColor = 'rgb(35, 38, 40)';
        });

        cryptoButton.addEventListener('mouseout', () => {
            cryptoButton.style.backgroundColor = 'rgb(32, 35, 36)';
        });

        cryptoButton.addEventListener('click', () => {
            if (window.cryptoModal) {
                window.cryptoModal.show();
            }
        });

        cryptoSection.appendChild(cryptoButton);
        
        // Insert after the task button
        const taskButton = this.sidebar.querySelector('.project-manager-button');
        if (taskButton) {
            const taskSection = taskButton.closest('div');
            taskSection.insertAdjacentElement('afterend', cryptoSection);
        }
    }

    setupStocksButton() {
        const stocksSection = document.createElement('div');
        stocksSection.style.cssText = `
            margin-top: 15px;
            padding: 0 15px;
        `;

        const stocksButton = document.createElement('button');
        stocksButton.className = 'stocks-button';
        stocksButton.style.cssText = `
            width: 100%;
            padding: 10px 15px;
            background: rgb(32, 35, 36);
            border: 1px solid rgb(52, 54, 55);
            border-radius: 20px;
            color: rgb(232, 230, 227);
            cursor: pointer;
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            gap: 8px;
            font-size: 0.85em;
            transition: all 0.2s ease;
            position: relative;
        `;

        // Create icon container
        const iconSpan = document.createElement('span');
        iconSpan.textContent = '📈';
        iconSpan.style.cssText = `
            font-size: 1.1em;
            justify-self: start;
        `;

        // Create text container
        const textSpan = document.createElement('span');
        textSpan.textContent = 'Stocks';
        textSpan.style.cssText = `
            text-align: center;
            margin-left: -24px;
        `;

        stocksButton.appendChild(iconSpan);
        stocksButton.appendChild(textSpan);

        stocksButton.addEventListener('mouseover', () => {
            stocksButton.style.backgroundColor = 'rgb(35, 38, 40)';
        });

        stocksButton.addEventListener('mouseout', () => {
            stocksButton.style.backgroundColor = 'rgb(32, 35, 36)';
        });

        stocksButton.addEventListener('click', () => {
            if (window.stocksModal) {
                window.stocksModal.show();
            }
        });

        stocksSection.appendChild(stocksButton);
        
        // Insert after the crypto button
        const cryptoButton = this.sidebar.querySelector('.crypto-button');
        if (cryptoButton) {
            const cryptoSection = cryptoButton.closest('div');
            cryptoSection.insertAdjacentElement('afterend', stocksSection);
        }
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
        
        toggleBtn.addEventListener('click', () => {
            this.toggleSidebar();
        });

        this.toggleBtn = toggleBtn;
        this.toggleBtn.style.display = 'flex';
    }

    closeSidebar() {
        this.sidebar.style.transform = 'translateX(100%)';
        this.isOpen = false;
    }

    openSidebar() {
        this.sidebar.style.transform = 'translateX(0)';
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
        mediaQuery.addListener((e) => {
            if (e.matches) {
                this.closeSidebar();
            }
        });

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
    setupPomodoroButton() {
        const pomodoroSection = document.createElement('div');
        pomodoroSection.style.cssText = `
            margin-top: 15px;
            padding: 0 15px;
        `;

        const pomodoroButton = document.createElement('button');
        pomodoroButton.className = 'pomodoro-button';
        pomodoroButton.style.cssText = `
            width: 100%;
            padding: 10px 15px;
            background: rgb(32, 35, 36);
            border: 1px solid rgb(52, 54, 55);
            border-radius: 20px;
            color: rgb(232, 230, 227);
            cursor: pointer;
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            gap: 8px;
            font-size: 0.85em;
            transition: all 0.2s ease;
            position: relative;
        `;

        // Create icon container
        const iconSpan = document.createElement('span');
        iconSpan.textContent = '⏱️';
        iconSpan.style.cssText = `
            font-size: 1.1em;
            justify-self: start;
        `;

        // Create text container
        const textSpan = document.createElement('span');
        textSpan.textContent = 'Pomodoro';
        textSpan.style.cssText = `
            text-align: center;
            margin-left: -24px;
            color: rgb(232, 230, 227);
        `;

        pomodoroButton.appendChild(iconSpan);
        pomodoroButton.appendChild(textSpan);

        pomodoroButton.addEventListener('mouseover', () => {
            pomodoroButton.style.backgroundColor = 'rgb(35, 38, 40)';
        });

        pomodoroButton.addEventListener('mouseout', () => {
            pomodoroButton.style.backgroundColor = 'rgb(32, 35, 36)';
        });

        pomodoroButton.addEventListener('click', () => {
            if (window.pomodoroModal) {
                window.pomodoroModal.show();
            }
        });

        pomodoroSection.appendChild(pomodoroButton);
        
        // Insert after the stocks button
        const stocksButton = this.sidebar.querySelector('.stocks-button');
        if (stocksButton) {
            const stocksSection = stocksButton.closest('div');
            stocksSection.insertAdjacentElement('afterend', pomodoroSection);
        }
    }
}

// Initialize right sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RightSidebar();
});
