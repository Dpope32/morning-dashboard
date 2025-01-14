// TasksByDay functionality with completion tracking

function updateDailyTasks() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const tasksContainer = document.querySelector('.tasks-grid');
    const todayData = window.tasksByDay[today] || { active: [], completed: [] };

    if (!tasksContainer) return;
    
    tasksContainer.innerHTML = '';
    
    // Sort tasks by completion status and time
    const allTasks = todayData.active.sort((a, b) => {
        const statusA = window.taskStore ? window.taskStore.getTaskStatus(today, a.task) : a.status;
        const statusB = window.taskStore ? window.taskStore.getTaskStatus(today, b.task) : b.status;
        
        // Move completed tasks to the end
        if (statusA === 'completed' && statusB !== 'completed') return 1;
        if (statusA !== 'completed' && statusB === 'completed') return -1;
        
        // For non-completed tasks, sort by time
        if (a.time && b.time) {
            return a.time.localeCompare(b.time);
        }
        if (a.time) return -1;
        if (b.time) return 1;
        
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    // Create task elements
    allTasks.forEach(task => {
        const taskElement = createTaskElement(task, today);
        tasksContainer.appendChild(taskElement);
    });

    updateProgress(today, todayData.active);
}

function updateProgress(today, allTasks) {
    // Filter out skipped tasks and count completed tasks
    const activeTasks = allTasks.filter(task => {
        const status = window.taskStore ? window.taskStore.getTaskStatus(today, task.task) : task.status;
        return status !== 'skipped';
    });

    const completedCount = activeTasks.filter(task => {
        const status = window.taskStore ? window.taskStore.getTaskStatus(today, task.task) : task.status;
        return status === 'completed';
    }).length;

    const totalCount = activeTasks.length;

    // Update task count
    const taskCount = document.getElementById('taskCount');
    if (taskCount) {
        taskCount.textContent = `(${completedCount}/${totalCount})`;
    }

    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage.toString());

        // Add celebration animation at 100%
        if (percentage === 100) {
            progressBar.style.animation = 'celebrate 0.5s ease-in-out';
            setTimeout(() => {
                progressBar.style.animation = '';
            }, 500);
        }
    }
}

function formatTime(timeStr) {
    if (!timeStr) return '';
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
        return timeStr;
    }
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function createTaskElement(task, dayOfWeek) {
    const taskElement = document.createElement('div');
    const taskStatus = window.taskStore ? window.taskStore.getTaskStatus(dayOfWeek, task.task) : task.status;
    taskElement.className = `task-item ${task.category} ${taskStatus}`;
    
    const isActionable = taskStatus === 'pending';
    const formattedTime = formatTime(task.time);
    
    taskElement.innerHTML = `
        <div class="task-content">
            <div class="task-main">
                <div class="task-left">
                    <div class="task-text ${taskStatus}">${task.task}</div>
                </div>
                <div class="task-time">${formattedTime}</div>
                ${isActionable ? `
                <div class="task-actions">
                    <label class="checkbox-container">
                        <input type="checkbox" class="complete-checkbox">
                        <span class="checkmark"></span>
                    </label>
                    <button class="skip-btn" title="Skip Task">↪️</button>
                </div>
                ` : ''}
            </div>
            <div class="task-metadata">
                <span class="task-chip ${task.improving}">${task.improving}</span>
                ${task.oneTime ? '<span class="task-chip one-time">One-time</span>' : ''}
                <span class="task-chip ${taskStatus}">${taskStatus}</span>
            </div>
        </div>
    `;

    if (isActionable) {
        setupTaskActions(taskElement, task, dayOfWeek);
    }

    return taskElement;
}

function setupTaskActions(taskElement, task, dayOfWeek) {
    const checkbox = taskElement.querySelector('.complete-checkbox');
    const skipBtn = taskElement.querySelector('.skip-btn');

    checkbox?.addEventListener('change', (e) => {
        if (e.target.checked) {
            taskElement.style.animation = 'taskComplete 0.5s ease-out';
            taskElement.classList.add('completed');
            
            // Update progress immediately
            const taskIndex = window.tasksByDay[dayOfWeek].active.findIndex(t => t.task === task.task);
            if (taskIndex !== -1) {
                task.status = 'completed';
                updateProgress(dayOfWeek, window.tasksByDay[dayOfWeek].active);
                
                // After animation, update store and refresh
                setTimeout(() => {
                    if (window.taskStore) {
                        window.taskStore.completeTask(dayOfWeek, task.task);
                    } else {
                        window.taskManager.completeTask(dayOfWeek, taskIndex);
                    }

                    try {
                        localStorage.setItem('tasksByDay', JSON.stringify(window.tasksByDay));
                    } catch (e) {
                        console.error('Error saving tasks to localStorage:', e);
                    }

                    updateDailyTasks();
                }, 500);
            }
        }
    });

    skipBtn?.addEventListener('click', () => {
        const taskIndex = window.tasksByDay[dayOfWeek].active.findIndex(t => t.task === task.task);
        if (taskIndex !== -1) {
            if (window.taskStore) {
                window.taskStore.skipTask(dayOfWeek, task.task);
            } else {
                window.taskManager.skipTask(dayOfWeek, taskIndex);
            }

            try {
                localStorage.setItem('tasksByDay', JSON.stringify(window.tasksByDay));
            } catch (e) {
                console.error('Error saving tasks to localStorage:', e);
            }

            updateDailyTasks();
        }
    });
}

// Initialize tasks when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a short moment to ensure taskStore is initialized
    setTimeout(() => {
        updateDailyTasks();
        
        // Add click handler for tasks header to toggle collapse
        const tasksSection = document.querySelector('.tasks-section');
        const tasksHeader = document.querySelector('.tasks-header');
        
        tasksHeader?.addEventListener('click', () => {
            tasksSection?.classList.toggle('collapsed');
        });

        // Update tasks every minute in case day changes
        setInterval(updateDailyTasks, 60000);
    }, 100);
});
