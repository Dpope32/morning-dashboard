// Project Task Store
(function() {
    function createProjectTaskStore() {
        const TASKS_KEY = 'projectTasks';
        const COLORS_KEY = 'projectCategoryColors';
        const CATEGORIES_KEY = 'projectCategories';
        
        // Predefined category colors
        const CATEGORY_COLORS = [
            '#2196F3', // Royal Blue
            '#6C3FB5', // Obsidian Software Purple
            '#2ECC40', // Bright Green
            '#FF851B', // Orange
            '#AAAAAA', // Light Gray
            '#39CCCC'  // Teal
        ];
        
        let state = {
            tasks: [],
            categories: ['Personal Project', 'Work Project', 'Health Goals', 'Development'],
            categoryColors: {},
            nextColorIndex: 0
        };

        // Load stored data
        try {
            const storedTasks = localStorage.getItem(TASKS_KEY);
            const storedColors = localStorage.getItem(COLORS_KEY);
            const storedCategories = localStorage.getItem(CATEGORIES_KEY);
            
            if (storedTasks) {
                state.tasks = JSON.parse(storedTasks);
                console.log('[ProjectTaskStore] Loaded tasks:', state.tasks);
            }
            if (storedColors) {
                state.categoryColors = JSON.parse(storedColors);
                console.log('[ProjectTaskStore] Loaded category colors:', state.categoryColors);
            }
            if (storedCategories) {
                state.categories = JSON.parse(storedCategories);
                console.log('[ProjectTaskStore] Loaded categories:', state.categories);
            }
        } catch (e) {
            console.error('[ProjectTaskStore] Error loading store:', e);
            state = { 
                tasks: [], 
                categories: ['Personal Project', 'Work Project', 'Health Goals', 'Development'],
                categoryColors: {}, 
                nextColorIndex: 0 
            };
        }

        // Save store state
        function saveStore() {
            try {
                localStorage.setItem(TASKS_KEY, JSON.stringify(state.tasks));
                localStorage.setItem(COLORS_KEY, JSON.stringify(state.categoryColors));
                localStorage.setItem(CATEGORIES_KEY, JSON.stringify(state.categories));
                console.log('[ProjectTaskStore] State saved successfully');
                console.log('[ProjectTaskStore] Current tasks:', state.tasks);
                console.log('[ProjectTaskStore] Current colors:', state.categoryColors);
                console.log('[ProjectTaskStore] Current categories:', state.categories);
            } catch (e) {
                console.error('[ProjectTaskStore] Error saving store:', e);
            }
        }

        // Get next color from predefined list
        function getNextColor() {
            const color = CATEGORY_COLORS[state.nextColorIndex];
            state.nextColorIndex = (state.nextColorIndex + 1) % CATEGORY_COLORS.length;
            return color;
        }

        // Get or assign color for category
        function getCategoryColor(category) {
            if (!category) {
                console.warn('[ProjectTaskStore] No category provided, using Uncategorized');
                category = 'Uncategorized';
            }
            
            if (!state.categoryColors[category]) {
                state.categoryColors[category] = getNextColor();
                console.log(`[ProjectTaskStore] Assigned color for category ${category}:`, state.categoryColors[category]);
                saveStore();
            }
            return state.categoryColors[category];
        }

        // Validate task object
        function validateTask(taskData) {
            console.log('[ProjectTaskStore] Validating task data:', taskData);
            
            // If it's a string, convert it to a task object
            if (typeof taskData === 'string') {
                console.log('[ProjectTaskStore] Converting string to task object');
                taskData = {
                    task: taskData,
                    category: 'Uncategorized',
                    improving: 'medium'
                };
            }
            
            if (!taskData || typeof taskData !== 'object') {
                console.error('[ProjectTaskStore] Task data must be an object or string');
                return false;
            }
            
            if (typeof taskData.task !== 'string' || !taskData.task.trim()) {
                console.error('[ProjectTaskStore] Task must have a non-empty text description');
                return false;
            }

            if (taskData.improving && !['high', 'medium', 'low'].includes(taskData.improving)) {
                console.warn('[ProjectTaskStore] Invalid priority level, defaulting to medium:', taskData.improving);
                taskData.improving = 'medium';
            }

            console.log('[ProjectTaskStore] Task validation successful');
            return true;
        }

        return {
            addTask(taskData) {
                console.log('[ProjectTaskStore] Adding task with data:', taskData);
                
                if (!validateTask(taskData)) {
                    console.error('[ProjectTaskStore] Task validation failed, not adding task');
                    return null;
                }

                // Add task with unique ID and timestamp
                const newTask = {
                    task: typeof taskData === 'string' ? taskData : taskData.task.trim(),
                    category: taskData.category?.trim() || 'Uncategorized',
                    improving: taskData.improving || 'medium',
                    id: Date.now().toString(),
                    status: 'pending',
                    createdAt: new Date().toISOString()
                };

                console.log('[ProjectTaskStore] Created new task:', newTask);

                state.tasks.push(newTask);
                
                // Ensure category has a color
                getCategoryColor(newTask.category);
                
                // Save changes
                saveStore();
                
                return newTask;
            },

            addCategory(name, color) {
                console.log('[ProjectTaskStore] Adding category:', name, color);
                if (!name || typeof name !== 'string') {
                    console.error('[ProjectTaskStore] Invalid category name');
                    return false;
                }

                name = name.trim();
                if (!state.categories.includes(name)) {
                    state.categories.push(name);
                    state.categoryColors[name] = color;
                    saveStore();
                    return true;
                }
                return false;
            },

            getCategories() {
                return state.categories;
            },

            getCategoryColor,

            completeTask(taskId) {
                console.log('[ProjectTaskStore] Completing task:', taskId);
                
                const taskIndex = state.tasks.findIndex(t => t.id === taskId);
                console.log('[ProjectTaskStore] Found task at index:', taskIndex);
                
                if (taskIndex !== -1) {
                    const task = state.tasks[taskIndex];
                    console.log('[ProjectTaskStore] Removing task:', task);
                    // Remove the completed task
                    state.tasks.splice(taskIndex, 1);
                    saveStore();
                } else {
                    console.warn('[ProjectTaskStore] No task found with id:', taskId);
                }
            },

            getTasks() {
                console.log('[ProjectTaskStore] Getting all tasks:', state.tasks);
                return state.tasks;
            },

            // Debug method to check store state
            debug() {
                console.log('[ProjectTaskStore] Current state:', {
                    tasks: state.tasks,
                    categories: state.categories,
                    categoryColors: state.categoryColors,
                    nextColorIndex: state.nextColorIndex
                });
            }
        };
    }

    // Create and expose global instance
    window.projectTaskStore = createProjectTaskStore();
    console.log('[ProjectTaskStore] Setup complete');
})();
