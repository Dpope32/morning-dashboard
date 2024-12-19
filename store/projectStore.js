class ProjectStore {
    constructor() {
        console.log('[ProjectStore] Initializing...');
        this.projects = [];
        this.categoryColors = {};
        this.initialized = false;
        
        // Load saved data
        try {
            const savedProjects = localStorage.getItem('projects');
            const savedColors = localStorage.getItem('projectCategoryColors');
            
            if (savedProjects) {
                this.projects = JSON.parse(savedProjects);
                console.log('[ProjectStore] Loaded saved projects:', this.projects);
            }
            
            if (savedColors) {
                this.categoryColors = JSON.parse(savedColors);
                console.log('[ProjectStore] Loaded saved colors:', this.categoryColors);
            }
        } catch (err) {
            console.error('[ProjectStore] Error loading saved data:', err);
        }

        // We'll initialize after DOM is loaded to ensure projectTaskStore is ready
        document.addEventListener('DOMContentLoaded', () => {
            console.log('[ProjectStore] DOM loaded, checking for migration...');
            this.initialize();
        });
    }

    initialize() {
        // Check if any project has tasks
        const projectsHaveTasks = this.projects.some(project => project.tasks && project.tasks.length > 0);
        if (!projectsHaveTasks && window.projectTaskStore) {
            console.log('[ProjectStore] Projects have no tasks, migrating from projectTaskStore');
            this.migrateFromProjectTaskStore();
        } else {
            console.log('[ProjectStore] Projects have tasks, no migration needed');
        }
        this.initialized = true;
    }

    migrateFromProjectTaskStore() {
        if (!window.projectTaskStore) {
            console.error('[ProjectStore] projectTaskStore not available');
            return;
        }

        const tasks = window.projectTaskStore.getTasks() || [];
        // Access categoryColors directly from projectTaskStore's debug state
        const storeState = {};
        window.projectTaskStore.debug();  // This will log the state
        const colors = window.projectTaskStore?.categoryColors || {};
        
        console.log('[ProjectStore] Migration data:', {
            tasks: tasks,
            colors: colors
        });

        // Group tasks by category
        const tasksByCategory = tasks.reduce((acc, task) => {
            const category = task.category || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(task);
            return acc;
        }, {});

        console.log('[ProjectStore] Tasks grouped by category:', tasksByCategory);

        // Create projects from categories
        Object.entries(tasksByCategory).forEach(([category, tasks]) => {
            // Get color from projectTaskStore directly
            const color = window.projectTaskStore.getCategoryColor(category);
            
            const existingProject = this.projects.find(p => p.category === category);
            if (existingProject) {
                // Merge tasks into existing project
                existingProject.tasks = existingProject.tasks.concat(tasks.map(task => ({
                    ...task,
                    status: task.status || 'pending'
                })));
                console.log('[ProjectStore] Merged tasks into existing project:', existingProject);
            } else {
                // Create new project
                const project = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    name: category,
                    category: category,
                    color: color,
                    status: 'active',
                    tasks: tasks.map(task => ({
                        ...task,
                        status: task.status || 'pending'
                    }))
                };
                console.log('[ProjectStore] Creating new project:', project);
                this.projects.push(project);
            }
        });

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
            localStorage.setItem('projects', JSON.stringify(this.projects));
            console.log('[ProjectStore] Saved projects to localStorage');
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
