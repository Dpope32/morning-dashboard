class ProjectManagerModal {
    constructor() {
        this.modal = null;
        this.createModal();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.id = 'projectManagerModal';
        this.modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            animation: fadeIn 0.2s ease-out;
            overflow-y: auto;
            backdrop-filter: blur(4px);
        `;

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            position: relative;
            background: rgba(13, 17, 23, 0.95);
            margin: 2% auto;
            padding: 25px;
            width: 95%;
            max-width: 1400px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: slideIn 0.3s ease-out;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.className = 'modal-close';
        closeBtn.style.cssText = `
            position: absolute;
            right: 15px;
            top: 15px;
            font-size: 28px;
            border: none;
            background: none;
            color: rgba(255, 255, 255, 0.4);
            cursor: pointer;
            padding: 5px 10px;
            transition: all 0.2s ease;
            border-radius: 6px;
            line-height: 1;
        `;
        closeBtn.onmouseover = () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            closeBtn.style.color = 'rgba(255, 255, 255, 0.9)';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.background = 'none';
            closeBtn.style.color = 'rgba(255, 255, 255, 0.4)';
        };
        closeBtn.onclick = () => this.hide();

        const header = document.createElement('div');
        header.className = 'project-manager-header';
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;

        const title = document.createElement('h2');
        title.textContent = 'Project Manager';
        title.style.cssText = `
            color: #fff;
            font-size: 1.5em;
            margin: 0;
        `;

        const newProjectBtn = document.createElement('button');
        newProjectBtn.className = 'new-project-btn';
        newProjectBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            New Project
        `;
        newProjectBtn.style.cssText = `
            padding: 8px 16px;
            background: #4f46e5;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            margin-right: 20px;
            gap: 8px;
            font-size: 0.9em;
            font-weight: 500;
            transition: all 0.2s ease;
        `;
        newProjectBtn.onmouseover = () => {
            newProjectBtn.style.background = '#4338ca';
            newProjectBtn.style.transform = 'translateY(-1px)';
        };
        newProjectBtn.onmouseout = () => {
            newProjectBtn.style.background = '#4f46e5';
            newProjectBtn.style.transform = 'translateY(0)';
        };
        newProjectBtn.onclick = () => {
            this.hide();
            window.addProjectModal.show();
        };

        header.appendChild(title);
        header.appendChild(newProjectBtn);

        const projectBoard = document.createElement('div');
        projectBoard.className = 'project-board';
        projectBoard.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 30px;
            padding: 10px;
        `;

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(header);
        modalContent.appendChild(projectBoard);
        this.modal.appendChild(modalContent);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .empty-projects {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 50px;
                text-align: center;
                color: rgba(255, 255, 255, 0.6);
            }
            .empty-projects p {
                font-size: 1.1em;
                margin-bottom: 20px;
            }
            .empty-projects button {
                padding: 10px 20px;
                background: #4f46e5;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9em;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            .empty-projects button:hover {
                background: #4338ca;
                transform: translateY(-1px);
            }
            .project-board-item {
                background: rgba(255, 255, 255, 0.03);
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .project-board-header {
                padding: 20px;
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }
            .project-header-content {
                flex: 1;
            }
            .project-board-header h3 {
                margin: 0;
                font-size: 1.2em;
            }
            .project-board-meta {
                display: flex;
                gap: 15px;
                margin-top: 8px;
                font-size: 0.9em;
                opacity: 0.8;
            }
            .project-columns {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                padding: 20px;
                background: rgba(0, 0, 0, 0.2);
            }
            .project-column {
                background: rgba(255, 255, 255, 0.03);
                border-radius: 8px;
                padding: 15px;
                min-height: 200px;
            }
            .project-column h4 {
                margin: 0 0 15px 0;
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.9em;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .project-task {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 10px;
                cursor: move;
                transition: all 0.2s ease;
            }
            .project-task:hover {
                background: rgba(255, 255, 255, 0.08);
                transform: translateY(-2px);
            }
            .project-task.dragging {
                opacity: 0.5;
            }
            .project-column.drag-over {
                background: rgba(255, 255, 255, 0.08);
            }
            .empty-column {
                color: rgba(255, 255, 255, 0.4);
                text-align: center;
                padding: 20px;
                font-size: 0.9em;
            }
            .priority {
                display: inline-block;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.8em;
                text-transform: capitalize;
            }
            .priority.high { background: rgba(220, 53, 69, 0.2); color: #ff4444; }
            .priority.medium { background: rgba(255, 193, 7, 0.2); color: #ffbb33; }
            .priority.low { background: rgba(40, 167, 69, 0.2); color: #00C851; }
            .delete-project-btn {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                cursor: pointer;
                padding: 8px;
                border-radius: 4px;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .delete-project-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.9);
            }
            .confirmation-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(13, 17, 23, 0.95);
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.1);
                z-index: 1002;
                min-width: 300px;
                text-align: center;
            }
            .confirmation-modal h3 {
                margin: 0 0 15px 0;
                color: #fff;
            }
            .confirmation-modal p {
                margin: 0 0 20px 0;
                color: rgba(255, 255, 255, 0.7);
            }
            .confirmation-buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
            }
            .confirm-delete-btn {
                padding: 8px 16px;
                background: #dc3545;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9em;
                transition: all 0.2s ease;
            }
            .confirm-delete-btn:hover {
                background: #c82333;
            }
            .cancel-delete-btn {
                padding: 8px 16px;
                background: transparent;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9em;
                transition: all 0.2s ease;
            }
            .cancel-delete-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(this.modal);
    }

    updateProjectBoard(board) {
        const projects = window.projectStore?.getProjects() || [];
        console.log('Current projects:', projects);

        if (!projects.length) {
            board.innerHTML = `
                <div class="empty-projects">
                    <p>No projects yet</p>
                    <button onclick="window.projectManagerModal.hide(); window.addProjectModal.show()">
                        Create Your First Project
                    </button>
                </div>
            `;
            return;
        }

        board.innerHTML = projects.map(project => `
            <div class="project-board-item" data-project-id="${project.id}">
                <div class="project-board-header" style="background-color: ${project.color || '#666'}">
                    <div class="project-header-content">
                        <h3>${project.name}</h3>
                        <div class="project-board-meta">
                            <span class="project-category">${project.category}</span>
                            <span class="project-task-count">${project.tasks.length} tasks</span>
                        </div>
                    </div>
                    <button class="delete-project-btn" onclick="window.projectManagerModal.confirmDeleteProject('${project.id}', '${project.name}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
                <div class="project-columns">
                    <div class="project-column active" ondrop="window.projectManagerModal.handleDrop(event, '${project.id}', 'pending')" ondragover="event.preventDefault()">
                        <h4>Active</h4>
                        ${this.renderTasks(project.tasks.filter(t => t.status === 'pending'), project.id)}
                    </div>
                    <div class="project-column testing" ondrop="window.projectManagerModal.handleDrop(event, '${project.id}', 'testing')" ondragover="event.preventDefault()">
                        <h4>Testing</h4>
                        ${this.renderTasks(project.tasks.filter(t => t.status === 'testing'), project.id)}
                    </div>
                    <div class="project-column completed" ondrop="window.projectManagerModal.handleDrop(event, '${project.id}', 'completed')" ondragover="event.preventDefault()">
                        <h4>Completed</h4>
                        ${this.renderTasks(project.tasks.filter(t => t.status === 'completed'), project.id)}
                    </div>
                </div>
            </div>
        `).join('');

        this.setupDragAndDrop();
    }

    renderTasks(tasks, projectId) {
        if (!tasks.length) {
            return '<div class="empty-column">No tasks</div>';
        }

        return tasks.map(task => `
            <div class="project-task" draggable="true" data-task-id="${task.id}" data-project-id="${projectId}">
                <div class="project-task-content">
                    <div class="project-task-title">${task.task}</div>
                    <div class="project-task-meta">
                        <span class="priority ${task.improving || 'medium'}">${task.improving || 'medium'}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupDragAndDrop() {
        const tasks = this.modal.querySelectorAll('.project-task');
        tasks.forEach(task => {
            task.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    taskId: task.dataset.taskId,
                    projectId: task.dataset.projectId
                }));
                task.classList.add('dragging');
            });

            task.addEventListener('dragend', () => {
                task.classList.remove('dragging');
            });
        });

        const columns = this.modal.querySelectorAll('.project-column');
        columns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                column.classList.add('drag-over');
            });

            column.addEventListener('dragleave', () => {
                column.classList.remove('drag-over');
            });

            column.addEventListener('drop', () => {
                column.classList.remove('drag-over');
            });
        });
    }

    confirmDeleteProject(projectId, projectName) {
        const confirmationModal = document.createElement('div');
        confirmationModal.className = 'confirmation-modal';
        confirmationModal.innerHTML = `
            <h3>Delete Project</h3>
            <p>Are you sure you want to delete "${projectName}"? This action cannot be undone.</p>
            <div class="confirmation-buttons">
                <button class="confirm-delete-btn" onclick="window.projectManagerModal.deleteProject('${projectId}')">
                    Delete Project
                </button>
                <button class="cancel-delete-btn" onclick="this.closest('.confirmation-modal').remove()">
                    Cancel
                </button>
            </div>
        `;
        document.body.appendChild(confirmationModal);
    }

    deleteProject(projectId) {
        // Remove the confirmation modal
        document.querySelector('.confirmation-modal').remove();

        // Get the project details before deleting
        const project = window.projectStore.getProjects().find(p => p.id === projectId);
        if (project) {
            const category = project.category;
            
            // Delete from projectStore
            window.projectStore.deleteProject(projectId);

            // Check if any other projects use this category
            const otherProjectsWithCategory = window.projectStore.getProjects().some(p => p.category === category);
            
            if (!otherProjectsWithCategory) {
                // Remove the category from projectTaskStore's categories array
                const categories = window.projectTaskStore.getCategories();
                const updatedCategories = categories.filter(c => c !== category);
                
                // Update localStorage with the new categories
                localStorage.setItem('projectCategories', JSON.stringify(updatedCategories));
                
                // Force a refresh of the projectTaskStore
                window.location.reload();
            }
        }

        // Update the board
        this.updateProjectBoard(this.modal.querySelector('.project-board'));
        
        // Show success message
        this.showMessage(`Project deleted successfully`);
    }

    handleDrop(e, projectId, newStatus) {
        e.preventDefault();
        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data.taskId && data.projectId === projectId) {
                window.projectStore.updateTaskStatus(projectId, data.taskId, newStatus);
                this.updateProjectBoard(this.modal.querySelector('.project-board'));
                
                // Show success message
                this.showMessage('Task status updated successfully!', 'success');
            }
        } catch (err) {
            console.error('Error handling drop:', err);
            this.showMessage('Failed to update task status', 'error');
        }
    }

    showMessage(text, type = 'success') {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-size: 0.9em;
            z-index: 1002;
            animation: slideIn 0.3s ease-out;
            background: ${type === 'success' ? '#00C851' : '#ff4444'};
        `;
        document.body.appendChild(message);
        setTimeout(() => {
            message.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    show() {
        this.modal.style.display = 'block';
        this.updateProjectBoard(this.modal.querySelector('.project-board'));
    }

    hide() {
        this.modal.style.display = 'none';
    }
}

// Initialize global modal instance
window.projectManagerModal = new ProjectManagerModal();
