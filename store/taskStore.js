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
        let state = null;
        
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
            try {
                const stored = loadStore();
                const currentWeek = getWeekNumber(new Date());
                
                // Check if we need to reset for new week
                if (!stored || stored.week !== currentWeek) {
                    console.log('[TaskStore] Initializing new week');
                    
                    // If we have stored data, preserve pending one-time tasks
                    const preservedTasks = {};
                    if (stored && stored.tasks) {
                        Object.entries(stored.tasks).forEach(([day, tasks]) => {
                            const pendingOneTimeTasks = {};
                            Object.entries(tasks).forEach(([taskId, status]) => {
                                // Find the task in tasksByDay to check if it's one-time
                                const task = window.tasksByDay[day]?.active.find(t => t.task === taskId);
                                if (task?.oneTime && status === 'pending') {
                                    pendingOneTimeTasks[taskId] = status;
                                }
                            });
                            if (Object.keys(pendingOneTimeTasks).length > 0) {
                                preservedTasks[day] = pendingOneTimeTasks;
                            }
                        });
                    }

                    return {
                        week: currentWeek,
                        tasks: preservedTasks,
                        metadata: {
                            lastReset: new Date().toISOString(),
                            version: '1.0.0'
                        }
                    };
                }
                return stored;
            } catch (e) {
                console.error('[TaskStore] Failed to initialize:', e);
                return null;
            }
        }

        // Save store state
        function saveStore(newState) {
            try {
                localStorage.setItem(STORE_KEY, JSON.stringify(newState));
                notifySubscribers(newState);
            } catch (e) {
                console.error('[TaskStore] Error saving store:', e);
                // Attempt to clear old data if storage is full
                if (e.name === 'QuotaExceededError') {
                    handleStorageQuotaExceeded();
                }
            }
        }

        // Handle storage quota exceeded
        function handleStorageQuotaExceeded() {
            try {
                // Clear tasks from previous weeks, preserving pending one-time tasks
                const currentWeek = getWeekNumber(new Date());
                if (state.week !== currentWeek) {
                    state = initStore();
                    saveStore(state);
                }
            } catch (e) {
                console.error('[TaskStore] Error handling storage quota:', e);
            }
        }

        // Notify subscribers of state change
        function notifySubscribers(newState) {
            subscribers.forEach(callback => {
                try {
                    callback(newState);
                } catch (e) {
                    console.error('[TaskStore] Error in subscriber:', e);
                }
            });
        }

        // Initialize state
        state = initStore();
        if (!state) {
            console.error('[TaskStore] Failed to initialize');
            return null;
        }
        
        console.log('[TaskStore] Initialized with state:', state);

        return {
            completeTask(day, taskId) {
                try {
                    console.log(`[TaskStore] Completing task: ${taskId} for ${day}`);
                    state.tasks[day] = state.tasks[day] || {};
                    state.tasks[day][taskId] = 'completed';
                    
                    // Find task in tasksByDay and update its status
                    const taskIndex = window.tasksByDay[day].active.findIndex(t => t.task === taskId);
                    if (taskIndex !== -1) {
                        const task = window.tasksByDay[day].active[taskIndex];
                        task.status = 'completed';
                        
                        // If it's a one-time task, move it to completed array
                        if (task.oneTime) {
                            window.tasksByDay[day].completed.push(task);
                            window.tasksByDay[day].active.splice(taskIndex, 1);
                        }
                    }
                    
                    saveStore(state);
                } catch (e) {
                    console.error('[TaskStore] Error completing task:', e);
                }
            },

            skipTask(day, taskId) {
                try {
                    console.log(`[TaskStore] Skipping task: ${taskId} for ${day}`);
                    state.tasks[day] = state.tasks[day] || {};
                    state.tasks[day][taskId] = 'skipped';
                    
                    // Find task in tasksByDay and update its status
                    const taskIndex = window.tasksByDay[day].active.findIndex(t => t.task === taskId);
                    if (taskIndex !== -1) {
                        const task = window.tasksByDay[day].active[taskIndex];
                        task.status = 'skipped';
                        window.tasksByDay[day].completed.push(task);
                        window.tasksByDay[day].active.splice(taskIndex, 1);
                    }
                    
                    saveStore(state);
                } catch (e) {
                    console.error('[TaskStore] Error skipping task:', e);
                }
            },

            resetTask(day, taskId) {
                try {
                    console.log(`[TaskStore] Resetting task: ${taskId} for ${day}`);
                    if (state.tasks[day]) {
                        delete state.tasks[day][taskId];
                        saveStore(state);
                    }
                } catch (e) {
                    console.error('[TaskStore] Error resetting task:', e);
                }
            },

            getTaskStatus(day, taskId) {
                try {
                    return state.tasks[day]?.[taskId] || 'pending';
                } catch (e) {
                    console.error('[TaskStore] Error getting task status:', e);
                    return 'pending';
                }
            },

            getDayTasks(day) {
                try {
                    return state.tasks[day] || {};
                } catch (e) {
                    console.error('[TaskStore] Error getting day tasks:', e);
                    return {};
                }
            },

            getStoreStatus() {
                try {
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
                } catch (e) {
                    console.error('[TaskStore] Error getting store status:', e);
                    return {
                        isInitialized: false,
                        error: e.message
                    };
                }
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
