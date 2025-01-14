// src/dashboard/store/projectStore.js
console.log('[ProjectStore] Starting initialization');
console.log('[ProjectStore] DEFAULT_PROJECTS available?', !!window.DEFAULT_PROJECTS);

class ProjectStore {
    constructor() {
        console.log('[ProjectStore] Initializing...');
        console.log('[ProjectStore-Debug] DEFAULT_PROJECTS at start:', window.DEFAULT_PROJECTS);

        this.projects = [];
        this.categoryColors = {};
        this.initialized = false;
        
        // Load saved data OR use defaults
        try {
            const savedProjects = localStorage.getItem('projects');
            const savedColors = localStorage.getItem('projectCategoryColors');
            
            if (savedProjects) {
                this.projects = JSON.parse(savedProjects);
            } else if (window.DEFAULT_PROJECTS) {
                console.log('[ProjectStore-Debug] Found DEFAULT_PROJECTS:', window.DEFAULT_PROJECTS);
                this.projects = [...window.DEFAULT_PROJECTS]; // Create a copy
                console.log('[ProjectStore-Debug] Set this.projects to:', this.projects);
                this.save();
            }
            console.log('[ProjectStore] Loaded projects:', this.projects);
            
            if (savedColors) {
                this.categoryColors = JSON.parse(savedColors);
            }
        } catch (err) {
            console.error('[ProjectStore] Error loading saved data:', err);
            // Fallback to defaults on error
            if (window.DEFAULT_PROJECTS) {
                this.projects = window.DEFAULT_PROJECTS;
                this.save();
            }
        }
        // We'll initialize after DOM is loaded to ensure projectTaskStore is ready
        document.addEventListener('DOMContentLoaded', () => {
            console.log('[ProjectStore] DOM loaded, checking for migration...');
            this.initialize();
        });
    }

    initialize() {
        if (window.projectTaskStore) {
            console.log('[ProjectStore] Checking for new tasks to migrate...');
            this.migrateFromProjectTaskStore();
        }
        this.initialized = true;
    }

    migrateFromProjectTaskStore() {
        if (!window.projectTaskStore) {
            console.error('[ProjectStore] projectTaskStore not available');
            return;
        }

        const tasks = window.projectTaskStore.getTasks() || [];
        if (!tasks.length) {
            console.log('[ProjectStore] No tasks to migrate');
            return;
        }
        
        console.log('[ProjectStore] Found tasks to migrate:', tasks);

        // Get unique categories from tasks
        const categories = [...new Set(tasks.map(task => task.category || 'Uncategorized'))];
        console.log('[ProjectStore] Found categories:', categories);

        // Track migrated tasks to avoid duplicates
        const migratedTaskIds = new Set();
        this.projects.forEach(project => {
            project.tasks.forEach(task => migratedTaskIds.add(task.id));
        });

        // Process each category
        categories.forEach(category => {
            const categoryTasks = tasks.filter(task => 
                (task.category || 'Uncategorized') === category && 
                !migratedTaskIds.has(task.id)
            );

            if (!categoryTasks.length) {
                console.log(`[ProjectStore] No new tasks to migrate for category: ${category}`);
                return;
            }

            const color = window.projectTaskStore.getCategoryColor(category);
            const existingProject = this.projects.find(p => p.category === category);

            if (existingProject) {
                // Add new tasks to existing project
                console.log(`[ProjectStore] Adding ${categoryTasks.length} tasks to existing project:`, existingProject.name);
                existingProject.tasks.push(...categoryTasks.map(task => ({
                    ...task,
                    status: task.status || 'pending'
                })));
            } else {
                // Create new project
                const project = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    name: category,
                    category: category,
                    color: color,
                    status: 'active',
                    tasks: categoryTasks.map(task => ({
                        ...task,
                        status: task.status || 'pending'
                    }))
                };
                console.log('[ProjectStore] Creating new project:', project);
                this.projects.push(project);
            }

            // Mark these tasks as migrated
            categoryTasks.forEach(task => migratedTaskIds.add(task.id));
        });

        // Only clear old tasks that were successfully migrated
        const remainingTasks = tasks.filter(task => !migratedTaskIds.has(task.id));
        if (remainingTasks.length > 0) {
            console.log('[ProjectStore] Some tasks could not be migrated:', remainingTasks);
            localStorage.setItem('projectTasks', JSON.stringify(remainingTasks));
        } else {
            console.log('[ProjectStore] All tasks migrated successfully');
            localStorage.removeItem('projectTasks');
        }

        this.save();
        console.log('[ProjectStore] Migration complete, final projects:', this.projects);
    }

    generateColor() {
        return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    }

    getProjects() {
        console.log('[ProjectStore] Getting projects:', this.projects);
        // If not initialized and we have projectTaskStore, try migration
        if (!this.initialized && window.projectTaskStore) {
            console.log('[ProjectStore] Late initialization triggered');
            this.initialize();
        }
        return this.projects;
    }

    addProject(project) {
        console.log('[ProjectStore] Adding project:', project);
        if (!project.id) {
            project.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        }
        if (!project.status) {
            project.status = 'active';
        }
        if (!project.tasks) {
            project.tasks = [];
        }
        if (!project.color) {
            project.color = this.getCategoryColor(project.category);
        }
        
        this.projects.push(project);
        this.save();
        console.log('[ProjectStore] Project added, current projects:', this.projects);
        return project;
    }

    updateProject(projectId, updates) {
        console.log('[ProjectStore] Updating project:', projectId, updates);
        const index = this.projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
            this.projects[index] = { ...this.projects[index], ...updates };
            this.save();
            return this.projects[index];
        }
        return null;
    }

    deleteProject(projectId) {
        console.log('[ProjectStore] Deleting project:', projectId);
        this.projects = this.projects.filter(p => p.id !== projectId);
        this.save();
    }

    addTaskToProject(projectId, task) {
        console.log('[ProjectStore] Adding task to project:', projectId, task);
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            if (!task.id) {
                task.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            }
            if (!task.status) {
                task.status = 'pending';
            }
            project.tasks.push(task);
            this.save();
            return task;
        }
        return null;
    }

    updateTaskStatus(projectId, taskId, status) {
        console.log('[ProjectStore] Updating task status:', { projectId, taskId, status });
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const task = project.tasks.find(t => t.id === taskId);
            if (task) {
                task.status = status;
                this.save();
                return task;
            }
        }
        return null;
    }

    getCategoryColor(category) {
        if (!this.categoryColors[category]) {
            // Try to get color from projectTaskStore first
            if (window.projectTaskStore) {
                this.categoryColors[category] = window.projectTaskStore.getCategoryColor(category);
            } else {
                this.categoryColors[category] = this.generateColor();
            }
            this.saveCategoryColors();
        }
        return this.categoryColors[category];
    }

    setCategoryColor(category, color) {
        this.categoryColors[category] = color;
        this.saveCategoryColors();
    }

    save() {
        try {
            console.log('[ProjectStore-Debug] Saving projects:', this.projects);
            localStorage.setItem('projects', JSON.stringify(this.projects));
            const saved = localStorage.getItem('projects');
            console.log('[ProjectStore-Debug] Verification - read back:', JSON.parse(saved));
        } catch (err) {
            console.error('[ProjectStore] Error saving projects:', err);
        }
    }

    saveCategoryColors() {
        try {
            localStorage.setItem('projectCategoryColors', JSON.stringify(this.categoryColors));
            console.log('[ProjectStore] Saved category colors to localStorage');
        } catch (err) {
            console.error('[ProjectStore] Error saving category colors:', err);
        }
    }

    debug() {
        console.log('[ProjectStore] Debug state:', {
            initialized: this.initialized,
            projects: this.projects,
            categoryColors: this.categoryColors
        });
    }
}

// Initialize global store
window.projectStore = new ProjectStore();
