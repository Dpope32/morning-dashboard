// Add Project Modal
class AddProjectModal {
    constructor() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.id = 'addProjectModal';
        this.modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button modal-close">&times;</span>
                <h2>Add New Project</h2>
                <div class="modal-body">
                    <div class="input-group">
                        <label class="form-label" for="projectName">Project Name</label>
                        <input class="form-input" type="text" id="projectName" placeholder="Enter project name">
                    </div>
                    <div class="input-group">
                        <label class="form-label" for="projectColor">Project Color</label>
                        <input class="form-input" type="color" id="projectColor" value="#4169E1">
                    </div>
                    <button class="modal-button" id="addProject">Add Project</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);
        this.setupEventListeners();
        this.setupStyles();
    }

    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .success-message {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 12px 24px;
                background: #00C851;
                color: white;
                border-radius: 8px;
                font-size: 0.9em;
                z-index: 1002;
                animation: slideIn 0.3s ease-out;
            }
            .modal-button {
                padding: 12px 24px;
                background: #4f46e5;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.95em;
                font-weight: 500;
                width: 100%;
                margin-top: 20px;
                transition: all 0.2s ease;
            }
            .modal-button:hover {
                background: #4338ca;
                transform: translateY(-1px);
            }
            .form-input {
                padding: 10px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(0, 0, 0, 0.2);
                color: white;
                border-radius: 6px;
                width: 100%;
                margin-top: 5px;
                transition: all 0.2s ease;
            }
            .form-input:focus {
                border-color: #4f46e5;
                outline: none;
                box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
            }
            .form-label {
                color: rgba(255, 255, 255, 0.9);
                font-size: 0.9em;
                font-weight: 500;
            }
            .input-group {
                margin-bottom: 15px;
            }
            @keyframes slideIn {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Close button
        const closeButton = this.modal.querySelector('.close-button');
        closeButton.addEventListener('click', () => this.hide());

        // Add button
        const addButton = this.modal.querySelector('#addProject');
        addButton.addEventListener('click', () => this.addProject());

        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });

        // Enter key on project name input
        const nameInput = this.modal.querySelector('#projectName');
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addProject();
            }
        });

        // Remove validation styling on input
        nameInput.addEventListener('input', () => {
            nameInput.style.borderColor = '';
        });
    }

    show() {
        this.modal.style.display = 'flex';
        // Focus project name input
        setTimeout(() => {
            this.modal.querySelector('#projectName').focus();
        }, 100);
    }

    hide() {
        this.modal.style.display = 'none';
        // Clear inputs
        this.modal.querySelector('#projectName').value = '';
        this.modal.querySelector('#projectColor').value = '#4169E1';
        // Clear validation styling
        this.modal.querySelector('#projectName').style.borderColor = '';
    }

    showMessage(text, type = 'success') {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = text;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    addProject() {
        console.log('[AddProjectModal] Adding new project');
        const nameInput = this.modal.querySelector('#projectName');
        const colorInput = this.modal.querySelector('#projectColor');

        const projectName = nameInput.value.trim();
        const projectColor = colorInput.value;

        // Validation
        if (!projectName) {
            nameInput.style.borderColor = 'rgb(220, 53, 69)';
            return;
        }

        console.log('[AddProjectModal] Creating project:', { projectName, projectColor });
        
        // Add project to store
        const newProject = window.projectStore.addProject({
            name: projectName,
            category: projectName,
            color: projectColor,
            status: 'active',
            tasks: []
        });

        if (newProject) {
            // Show success message
            this.showMessage(`Project "${projectName}" created successfully!`);

            // Update UI
            if (typeof updateProjectTasks === 'function') {
                updateProjectTasks();
            }

            // If project manager modal is open, update it
            if (window.projectManagerModal && 
                window.projectManagerModal.modal.style.display === 'block') {
                window.projectManagerModal.updateProjectBoard(
                    window.projectManagerModal.modal.querySelector('.project-board')
                );
            }
        } else {
            this.showMessage(`Failed to create project "${projectName}"`, 'error');
        }

        this.hide();
    }
}

// Initialize modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.addProjectModal = new AddProjectModal();
});
