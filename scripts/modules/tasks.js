// TasksByDay functionality with completion tracking
function updateDailyTasks() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const tasksContainer = document.getElementById('dailyTasks');
    const todayData = window.tasksByDay[today] || { active: [], completed: [] };

    // Sort active tasks by time if present
    if (window.tasksByDay.settings.sortBy === 'time') {
        todayData.active.sort((a, b) => {
            if (!a.time) return 1;
            if (!b.time) return -1;
            return a.time.localeCompare(b.time);
        });
    }

    tasksContainer.innerHTML = '';
    
    // Create tasks list
    const tasksList = document.createElement('div');
    tasksList.className = 'tasks-list';
    
    // Get all tasks and their statuses
    const allTasks = todayData.active.map(task => ({
        task: task,
        status: window.taskStore ? window.taskStore.getTaskStatus(today, task.task) : task.status
    }));

    // Sort tasks so completed ones are at the bottom
    allTasks.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return 0;
    });

    // Add all tasks to the list
    allTasks.forEach(({ task }) => {
        const taskElement = createTaskElement(task, today);
        tasksList.appendChild(taskElement);
    });
    
    tasksContainer.appendChild(tasksList);
    updateProgress(today, todayData.active);
}

function updateProgress(today, allTasks) {
    const completedCount = allTasks.filter(task => {
        const status = window.taskStore ? window.taskStore.getTaskStatus(today, task.task) : task.status;
        return status === 'completed';
    }).length;
    const totalCount = allTasks.length;

    // Update task count
    document.getElementById('taskCount').textContent = `(${completedCount}/${totalCount})`;

    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);

        // Handle collapsible state when all tasks are completed
        const tasksSection = document.querySelector('.tasks-section');
        if (percentage === 100) {
            tasksSection.classList.add('completed');
            if (!tasksSection.classList.contains('collapsed')) {
                tasksSection.classList.add('collapsed');
            }
        } else {
            tasksSection.classList.remove('completed', 'collapsed');
        }
    }
}

function formatTime(timeStr) {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function createTaskElement(task, dayOfWeek) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    
    const taskStatus = window.taskStore ? window.taskStore.getTaskStatus(dayOfWeek, task.task) : task.status;
    const isActionable = taskStatus === 'pending';
    const formattedTime = formatTime(task.time);
    
    taskElement.innerHTML = `
        <div class="task-priority priority-${task.priority}"></div>
        <div class="task-content">
            <div class="task-main">
                <div class="task-text ${taskStatus}">${task.task}</div>
                ${formattedTime ? `<div class="task-time">${formattedTime}</div>` : ''}
            </div>
            <div class="task-metadata">
                <span class="task-category category-${task.category}">${task.category}</span>
                <span class="task-improving">${task.improving}</span>
                <span class="task-status status-${taskStatus}">${taskStatus}</span>
            </div>
        </div>
        ${isActionable ? `
        <div class="task-actions">
            <label class="checkbox-container">
                <input type="checkbox" class="complete-checkbox">
                <span class="checkmark"></span>
            </label>
            <button class="skip-btn" title="Skip Task">↪️</button>
        </div>
        ` : ''}
    `;

    if (isActionable) {
        const checkbox = taskElement.querySelector('.complete-checkbox');
        const skipBtn = taskElement.querySelector('.skip-btn');

        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                taskElement.style.animation = 'taskComplete 0.5s ease-out';
                setTimeout(() => {
                    if (window.taskStore) {
                        window.taskStore.completeTask(dayOfWeek, task.task);
                    } else {
                        task.status = 'completed';
                    }
                    updateDailyTasks();
                }, 500);
            }
        });

        skipBtn.addEventListener('click', () => {
            if (window.taskStore) {
                window.taskStore.skipTask(dayOfWeek, task.task);
            } else {
                task.status = 'skipped';
            }
            updateDailyTasks();
        });
    }

    return taskElement;
}

// Initialize tasks when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a short moment to ensure taskStore is initialized
    setTimeout(() => {
        updateDailyTasks();
        
        // Add click handler for tasks header to toggle collapse
        const tasksSection = document.querySelector('.tasks-section');
        const tasksHeader = document.querySelector('.tasks-header');
        
        tasksHeader.addEventListener('click', () => {
            if (tasksSection.classList.contains('completed')) {
                tasksSection.classList.toggle('collapsed');
            }
        });

        // Update tasks every minute in case day changes
        setInterval(updateDailyTasks, 60000);
        // Subscribe to store changes if taskStore is available
        if (window.taskStore) {
            window.taskStore.subscribe(() => {
                updateDailyTasks();
            });
        }
    }, 100);
});
