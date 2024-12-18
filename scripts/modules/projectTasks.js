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
        console.log('[ProjectTasks] No tasks found, showing empty state');
        projectsGrid.innerHTML = `
            <div class="empty-state">
                <button class="empty-state-button" onclick="window.addProjectModal.show()">
                    Create New Project
                </button>
                <div style="margin: 10px 0; color: var(--text-secondary);">  </div>
                <button class="empty-state-button secondary" onclick="window.projectsModal.show()">
                    Add Project Task
                </button>
            </div>
        `;
        updateProjectProgress([]);
        return;
    }

    // Group tasks by category
    console.log('[ProjectTasks] Grouping tasks by category');
    const tasksByCategory = tasks.reduce((acc, task) => {
        const category = task.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(task);
        return acc;
    }, {});

    console.log('[ProjectTasks] Tasks grouped by category:', tasksByCategory);

    // Create HTML for tasks
    let gridHTML = '';

    // Add quick add card
    gridHTML += `
        <div class="project-category quick-add-card">
            <button class="quick-add-project" onclick="window.addProjectModal.show()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>New Project</span>
            </button>
            <div class="quick-add-divider"></div>
            <button class="quick-add-project" onclick="window.projectsModal.show()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>New Task</span>
            </button>
        </div>
    `;

    // Add task categories
    gridHTML += Object.entries(tasksByCategory)
        .map(([category, tasks]) => {
            const categoryColor = window.projectTaskStore.getCategoryColor(category);
            // Store the color in projectStore for future use
            window.projectStore?.setCategoryColor(category, categoryColor);
            
            console.log(`[ProjectTasks] Creating category element: ${category} with ${tasks.length} tasks`);
            return `
                <div class="project-category">
                    <div class="project-header" style="background-color: ${categoryColor}">
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
    
    const priorityColors = {
        high: '#dc3545',
        medium: '#ffc107',
        low: '#28a745'
    };

    const statusLabels = {
        pending: 'To Do',
        completed: 'Done',
        skipped: 'Skipped'
    };

    const taskText = task.task || 'Unnamed Task';
    const priority = task.improving || 'medium';
    const status = task.status || 'pending';
    const category = task.category || 'Uncategorized';

    return `
        <div class="task-item ${category}" data-task-id="${task.id}" data-status="${status}">
            <div class="task-content">
                <div class="task-text">${taskText}</div>
                <div class="task-metadata">
                    <span class="task-chip priority" style="background: ${priorityColors[priority]}">
                        ${priority} Priority
                    </span>
                    <span class="task-chip status ${status}">
                        ${statusLabels[status]}
                    </span>
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
