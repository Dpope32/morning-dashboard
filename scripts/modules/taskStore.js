// Task persistence and state management
(function() {
    // Helper to get current week number
    function getWeekNumber(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    // Create persistent store with weekly reset
    function createTaskStore() {
        const STORE_KEY = 'taskStore';
        const currentWeek = getWeekNumber(new Date());
        let subscribers = [];
        
        // Load stored data
        function loadStore() {
            try {
                const stored = localStorage.getItem(STORE_KEY);
                if (stored) {
                    return JSON.parse(stored);
                }
            } catch (e) {
                console.error('[TaskStore] Error loading store:', e);
            }
            return null;
        }

        // Initialize store
        function initStore() {
            const stored = loadStore();
            const currentWeek = getWeekNumber(new Date());
            
            // Check if we need to reset for new week
            if (!stored || stored.week !== currentWeek) {
                console.log('[TaskStore] Initializing new week');
                return {
                    week: currentWeek,
                    tasks: {},
                    metadata: {
                        lastReset: new Date().toISOString(),
                        version: '1.0.0'
                    }
                };
            }
            return stored;
        }

        // Save store state
        function saveStore(state) {
            try {
                localStorage.setItem(STORE_KEY, JSON.stringify(state));
                subscribers.forEach(callback => callback(state));
            } catch (e) {
                console.error('[TaskStore] Error saving store:', e);
            }
        }

        // Initialize store
        let state = initStore();
        console.log('[TaskStore] Initialized with state:', state);

        return {
            completeTask(day, taskId) {
                console.log(`[TaskStore] Completing task: ${taskId} for ${day}`);
                state.tasks[day] = state.tasks[day] || {};
                state.tasks[day][taskId] = 'completed';
                saveStore(state);
            },

            skipTask(day, taskId) {
                console.log(`[TaskStore] Skipping task: ${taskId} for ${day}`);
                state.tasks[day] = state.tasks[day] || {};
                state.tasks[day][taskId] = 'skipped';
                saveStore(state);
            },

            resetTask(day, taskId) {
                console.log(`[TaskStore] Resetting task: ${taskId} for ${day}`);
                if (state.tasks[day]) {
                    delete state.tasks[day][taskId];
                    saveStore(state);
                }
            },

            getTaskStatus(day, taskId) {
                return state.tasks[day]?.[taskId] || 'pending';
            },

            getDayTasks(day) {
                return state.tasks[day] || {};
            },

            getStoreStatus() {
                const storeSize = new Blob([JSON.stringify(state)]).size;
                const availableSpace = 5 * 1024 * 1024; // 5MB localStorage limit
                
                return {
                    isInitialized: true,
                    currentWeek: state.week,
                    lastReset: state.metadata.lastReset,
                    version: state.metadata.version,
                    taskCount: Object.keys(state.tasks).reduce((acc, day) => 
                        acc + Object.keys(state.tasks[day]).length, 0
                    ),
                    storageUsed: storeSize,
                    storageAvailable: availableSpace,
                    storagePercentage: ((storeSize / availableSpace) * 100).toFixed(2)
                };
            },

            subscribe(callback) {
                subscribers.push(callback);
                return () => {
                    subscribers = subscribers.filter(cb => cb !== callback);
                };
            }
        };
    }

    // Create and expose global instance
    window.taskStore = createTaskStore();
    console.log('[TaskStore] Setup complete');
})();
