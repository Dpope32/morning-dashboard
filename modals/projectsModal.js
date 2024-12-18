// Projects Modal
class ProjectsModal {
    constructor() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.id = 'projectsModal';
        this.modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button modal-close">&times;</span>
                <h2>Project Tasks</h2>
                <div class="modal-body">
                    <div class="input-group">
                        <label class="form-label" for="projectTask">Task Description</label>
                        <input class="form-input" type="text" id="projectTask" placeholder="What needs to be done?">
                    </div>
                    <div class="input-group">
                        <label class="form-label" for="projectCategory">Project Category</label>
                        <select class="form-select" id="projectCategory">
                            ${this.getProjectCategories()}
                        </select>
                    </div>
                    <div class="input-group">
                        <label class="form-label" for="projectPriority">Priority Level</label>
                        <select class="form-select" id="projectPriority">
                            <option value="high">High Priority</option>
                            <option value="medium" selected>Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                    </div>
                    <button class="modal-button" id="addProjectTask">Add Task</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);
        this.setupEventListeners();
    }

    getProjectCategories() {
        const defaultCategories = ['Personal Project', 'Work Project', 'Health Goals', 'Development'];
        let categories;
        
        try {
            categories = window.ENV?.PROJECT_CATEGORIES || defaultCategories;
        } catch (error) {
            console.warn('Failed to load project categories, using defaults:', error);
            categories = defaultCategories;
        }

        return categories
            .map(category => `<option value="${category}">${category}</option>`)
            .join('');
    }

    setupEventListeners() {
        // Close button
        const closeButton = this.modal.querySelector('.close-button');
        closeButton.addEventListener('click', () => this.hide());

        // Add button
        const addButton = this.modal.querySelector('#addProjectTask');
        addButton.addEventListener('click', () => this.addProjectTask());

        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });

        // Enter key on task input
        const taskInput = this.modal.querySelector('#projectTask');
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addProjectTask();
            }
        });

        // Remove validation styling on input
        const inputs = this.modal.querySelectorAll('.form-input, .form-select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.style.borderColor = '';
            });
        });
    }

    show() {
        this.modal.style.display = 'flex';
        // Focus task input
        setTimeout(() => {
            this.modal.querySelector('#projectTask').focus();
        }, 100);
    }

    hide() {
        this.modal.style.display = 'none';
        // Clear inputs
        this.modal.querySelector('#projectTask').value = '';
        this.modal.querySelector('#projectCategory').selectedIndex = 0;
        this.modal.querySelector('#projectPriority').selectedIndex = 1;
        // Clear validation styling
        this.modal.querySelectorAll('.form-input, .form-select').forEach(input => {
            input.style.borderColor = '';
        });
    }

    addProjectTask() {
        console.log('[ProjectsModal] Adding new project task');
        const taskInput = this.modal.querySelector('#projectTask');
        const categorySelect = this.modal.querySelector('#projectCategory');
        const prioritySelect = this.modal.querySelector('#projectPriority');

        const taskText = taskInput.value.trim();
        const category = categorySelect.value;
        const priority = prioritySelect.value;

        // Validation
        let isValid = true;
        if (!taskText) {
            taskInput.style.borderColor = 'rgb(220, 53, 69)';
            isValid = false;
        }
        if (!category) {
            categorySelect.style.borderColor = 'rgb(220, 53, 69)';
            isValid = false;
        }
        if (!isValid) return;

        console.log('[ProjectsModal] Creating task with:', { taskText, category, priority });
        
        // Add task to store
        window.projectTaskStore.addTask({
            task: taskText,
            category: category,
            improving: priority
        });

        // Update UI
        if (typeof updateProjectTasks === 'function') {
            updateProjectTasks();
        }

        this.hide();
    }
}

// Initialize modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.projectsModal = new ProjectsModal();
});
