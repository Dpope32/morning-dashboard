// scripts/modules/taskProgress.js

function updateTaskProgress() {
    const tasksList = document.getElementById('dailyTasks');
    if (!tasksList) return;

    const tasks = tasksList.getElementsByTagName('li');
    const totalTasks = tasks.length;
    const completedTasks = Array.from(tasks).filter(task => 
        task.querySelector('input[type="checkbox"]')?.checked
    ).length;

    // Update task count
    const taskCount = document.getElementById('taskCount');
    if (taskCount) {
        taskCount.textContent = `(${completedTasks}/${totalTasks})`;
    }

    // Update progress bar
    const progressBar = document.getElementById('taskProgress');
    if (progressBar) {
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        progressBar.style.width = `${progressPercentage}%`;
    }
}

function initializeTaskProgress() {
    updateTaskProgress();
    
    // Add event listener for task changes
    const tasksList = document.getElementById('dailyTasks');
    if (tasksList) {
        tasksList.addEventListener('change', updateTaskProgress);
    }
}
