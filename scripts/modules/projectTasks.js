function updateProjectTasks() {
    console.log('[ProjectTasks] Starting update');
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) {
        console.warn('[ProjectTasks] Projects grid not found');
        return;
    }

    const tasks = window.projectTaskStore?.getTasks() || [];
    console.log('[ProjectTasks] Retrieved tasks:', tasks);

    // Show empty state if no tasks
    if (!tasks.length) {
        projectsGrid.innerHTML = `
            <div class="empty-state">
                <h3>No Project Tasks</h3>
                <p>Get started by creating a new project or adding tasks</p>
                <div class="projects-quick-actions">
                    <button class="quick-action-button" onclick="window.addProjectModal.show()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        New Project
                    </button>
                    <button class="quick-action-button" onclick="window.projectsModal.show()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        Add Task
                    </button>
                </div>
            </div>
        `;
        updateProjectProgress([]);
        return;
    }

    // Add quick actions bar before the grid
    const quickActionsHTML = `
        <div class="projects-quick-actions">
            <button class="quick-action-button" onclick="window.addProjectModal.show()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                New Project
            </button>
            <button class="quick-action-button" onclick="window.projectsModal.show()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Add Task
            </button>
        </div>
    `;

    // Insert quick actions before the grid
    const quickActionsContainer = document.querySelector('.projects-quick-actions');
    if (!quickActionsContainer) {
        projectsGrid.insertAdjacentHTML('beforebegin', quickActionsHTML);
    }

    // Group tasks by category
    const tasksByCategory = tasks.reduce((acc, task) => {
        const category = task.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(task);
        return acc;
    }, {});

    // Create grid HTML
    let gridHTML = '';

    // Add task categories
    gridHTML += Object.entries(tasksByCategory)
        .map(([category, tasks]) => {
            const categoryColor = window.projectTaskStore.getCategoryColor(category);
            // Calculate a darker shade for gradient
            const categoryColorDark = categoryColor.replace(')', ', 0.8)').replace('rgb', 'rgba');
            
            return `
                <div class="project-category" style="--category-color: ${categoryColor}; --category-color-dark: ${categoryColorDark}">
                    <div class="project-header">
                        <div class="project-header-content">
                            <h3>${category}</h3>
                            <span class="task-count">${tasks.length} task${tasks.length === 1 ? '' : 's'}</span>
                        </div>
                        <button class="add-task-button" onclick="event.stopPropagation(); window.addProjectTaskModal.show('${category}')">
                            +
                        </button>
                    </div>
                    <div class="project-tasks">
                        ${tasks.map(task => createProjectTaskElement(task)).join('')}
                    </div>
                </div>
            `;
        })
        .join('');

    projectsGrid.innerHTML = gridHTML;
    // Add click handlers for task status toggle
    console.log('[ProjectTasks] Adding click handlers');
    projectsGrid.querySelectorAll('.task-item').forEach(taskElement => {
        taskElement.addEventListener('click', () => {
            const taskId = taskElement.dataset.taskId;
            if (taskId) {
                console.log('[ProjectTasks] Task clicked:', taskId);
                const task = window.projectTaskStore.getTasks().find(t => t.id === taskId);
                if (task) {
                    if (confirm(`Would you like to complete the task "${task.task}"?`)) {
                        // Add task to project store before completing it
                        const project = window.projectStore.addProject({
                            category: task.category,
                            name: task.task,
                            status: 'active'
                        });
                        
                        // Add the task to the project
                        window.projectStore.addTaskToProject(project.id, {
                            ...task,
                            status: 'completed'
                        });
                        
                        // Complete the task in project task store
                        window.projectTaskStore.completeTask(taskId);
                        updateProjectTasks(); // Refresh the view
                    }
                }
            }
        });
    });

    updateProjectProgress(tasks);
}

function createProjectTaskElement(task) {
    console.log('[ProjectTasks] Creating task element:', task);
    
    const taskText = task.task || 'Unnamed Task';
    const priority = task.improving || 'medium';

    return `
        <div class="task-item" data-task-id="${task.id}">
            <div class="task-content">
                <span class="task-text">${taskText}</span>
                <div class="task-info">
                    <span class="${priority.toLowerCase()}-priority">${priority}</span>
                </div>
            </div>
        </div>
    `;
}

function updateProjectProgress(tasks) {
    console.log('[ProjectTasks] Updating progress with tasks:', tasks);
    const totalCount = tasks.length;

    // Update project count
    const projectCount = document.getElementById('projectCount');
    if (projectCount) {
        projectCount.textContent = totalCount > 0 ? `(${totalCount} task${totalCount === 1 ? '' : 's'})` : '';
    }

    // Update progress bar
    const progressBar = document.querySelector('.projects-progress .progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('[ProjectTasks] DOM loaded, initializing');
    
    // Initial update
    updateProjectTasks();

    // Add click handler for projects header to toggle collapse
    const projectsSection = document.querySelector('.projects-section');
    const projectsHeader = document.querySelector('.projects-header');
    
    projectsHeader?.addEventListener('click', () => {
        console.log('[ProjectTasks] Projects header clicked, toggling collapse');
        projectsSection?.classList.toggle('collapsed');
    });

    // Debug store state
    window.projectTaskStore.debug();
});
