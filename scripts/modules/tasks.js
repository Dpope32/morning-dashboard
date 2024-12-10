// TasksByDay functionality with completion tracking
function updateDailyTasks() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const tasksContainer = document.getElementById('dailyTasks');
    const todaysTasks = window.tasksByDay[today] || [];

    // Get completed tasks from localStorage
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    const todayStr = new Date().toISOString().split('T')[0];

    // Clear old completed tasks (from previous days)
    const updatedCompletedTasks = completedTasks.filter(task => task.date === todayStr);
    localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks));

    tasksContainer.innerHTML = '';
    
    todaysTasks.forEach((task, index) => {
        const taskElement = document.createElement('li');
        taskElement.className = 'task-item';
        
        // Check if task is completed
        const isCompleted = updatedCompletedTasks.some(t => 
            t.task === task.task && t.date === todayStr
        );
        
        taskElement.innerHTML = `
            <div class="task-priority priority-${task.priority}"></div>
            <div class="task-text ${isCompleted ? 'completed' : ''}">${task.task}</div>
            <div class="task-actions">
                <label class="checkbox-container">
                    <input type="checkbox" ${isCompleted ? 'checked' : ''}>
                    <span class="checkmark"></span>
                </label>
            </div>
        `;

        // Add click handler for checkbox
        const checkbox = taskElement.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
            const taskText = taskElement.querySelector('.task-text');
            if (e.target.checked) {
                taskText.classList.add('completed');
                // Add to completed tasks
                updatedCompletedTasks.push({
                    task: task.task,
                    date: todayStr
                });
            } else {
                taskText.classList.remove('completed');
                // Remove from completed tasks
                const index = updatedCompletedTasks.findIndex(t => 
                    t.task === task.task && t.date === todayStr
                );
                if (index > -1) {
                    updatedCompletedTasks.splice(index, 1);
                }
            }
            localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks));
            
            // Add completion animation
            if (e.target.checked) {
                taskElement.style.animation = 'taskComplete 0.5s ease-out';
                setTimeout(() => {
                    taskElement.style.animation = '';
                }, 500);
            }

            // Update the tasks header with new completion count
            const completedCount = updatedCompletedTasks.length;
            const totalCount = todaysTasks.length;
            document.getElementById('taskCount').textContent = `(${completedCount}/${totalCount})`;

            // Update the progress bar
            if (typeof updateTaskProgress === 'function') {
                updateTaskProgress();
            }
        });

        tasksContainer.appendChild(taskElement);
    });

    // Update the tasks header with completion status
    const completedCount = updatedCompletedTasks.length;
    const totalCount = todaysTasks.length;
    document.getElementById('taskCount').textContent = `(${completedCount}/${totalCount})`;

    // Update the progress bar initially
    if (typeof updateTaskProgress === 'function') {
        updateTaskProgress();
    }
}

// Initialize tasks when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateDailyTasks();
    // Update tasks every minute in case day changes
    setInterval(updateDailyTasks, 60000);
});
