class PomodoroModal {
    constructor() {
        this.modal = null;
        this.unsubscribe = null;
        this.createModal();
        this.setupStoreSubscription();
    }

    createModal() {
        // Create modal container
        this.modal = document.createElement('div');
        this.modal.className = 'modal pomodoro-modal';
        this.modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Pomodoro Timer</h2>
                    <button class="close-button">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="timer-display">
                        <div class="time">25:00</div>
                        <div class="mode">Work Time</div>
                    </div>
                    <div class="timer-controls">
                        <button class="start-pause">Start</button>
                        <button class="reset">Reset</button>
                    </div>
                    <div class="session-info">
                        <span class="sessions">Sessions completed: 0</span>
                    </div>
                </div>
            </div>
        `;

        // Add modal to document
        document.body.appendChild(this.modal);

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        const closeBtn = this.modal.querySelector('.close-button');
        const startPauseBtn = this.modal.querySelector('.start-pause');
        const resetBtn = this.modal.querySelector('.reset');

        closeBtn.addEventListener('click', () => this.hide());
        startPauseBtn.addEventListener('click', () => {
            if (window.pomodoroStore.state.isRunning) {
                window.pomodoroStore.pause();
                startPauseBtn.textContent = 'Start';
            } else {
                window.pomodoroStore.start();
                startPauseBtn.textContent = 'Pause';
            }
        });
        resetBtn.addEventListener('click', () => {
            window.pomodoroStore.reset();
            startPauseBtn.textContent = 'Start';
        });
    }

    setupStoreSubscription() {
        if (window.pomodoroStore) {
            this.unsubscribe = window.pomodoroStore.subscribe((state) => {
                const timeDisplay = this.modal.querySelector('.time');
                const modeDisplay = this.modal.querySelector('.mode');
                const sessionsDisplay = this.modal.querySelector('.sessions');
                const startPauseBtn = this.modal.querySelector('.start-pause');

                timeDisplay.textContent = window.pomodoroStore.getFormattedTime();
                modeDisplay.textContent = state.currentMode === 'work' ? 'Work Time' : 'Break Time';
                sessionsDisplay.textContent = `Sessions completed: ${state.completedSessions}`;
                startPauseBtn.textContent = state.isRunning ? 'Pause' : 'Start';
            });
        }
    }

    show() {
        this.modal.style.display = 'block';
    }

    hide() {
        this.modal.style.display = 'none';
    }
}

// Create a global instance
window.pomodoroModal = new PomodoroModal();
