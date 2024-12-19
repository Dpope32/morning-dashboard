class AddProjectTaskModal {
    constructor() {
        this.modal = null;
        this.projectId = null;
        this.createModal();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.id = 'addProjectTaskModal';
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
            backdrop-filter: blur(4px);
        `;

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            position: relative;
            background: rgba(13, 17, 23, 0.95);
            margin: 15% auto;
            padding: 25px;
            width: 90%;
            max-width: 500px;
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

        const title = document.createElement('h2');
        title.textContent = 'Add Task to Project';
        title.style.cssText = `
            color: #fff;
            margin-bottom: 20px;
            text-align: center;
        `;

        const form = document.createElement('form');
        form.className = 'add-task-form';
        form.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;

        const taskInput = document.createElement('input');
        taskInput.type = 'text';
        taskInput.id = 'taskDescription';
        taskInput.placeholder = 'Enter task description';
        taskInput.style.cssText = `
            padding: 12px 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgb(18, 20, 23);
            color: #ffffff;
            border-radius: 8px;
            font-size: 0.95em;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(5px);
        `;
        taskInput.onfocus = () => {
            taskInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            taskInput.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        };
        taskInput.onblur = () => {
            taskInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            taskInput.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        };

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Add Task';
        submitBtn.type = 'submit';
        submitBtn.style.cssText = `
            padding: 14px 20px;
            background: #4f46e5;
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95em;
            transition: all 0.2s ease;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);
        `;
        submitBtn.onmouseover = () => {
            submitBtn.style.background = '#4338ca';
            submitBtn.style.transform = 'translateY(-1px)';
            submitBtn.style.boxShadow = '0 6px 8px rgba(79, 70, 229, 0.3)';
        };
        submitBtn.onmouseout = () => {
            submitBtn.style.background = '#4f46e5';
            submitBtn.style.transform = 'translateY(0)';
            submitBtn.style.boxShadow = '0 4px 6px rgba(79, 70, 229, 0.2)';
        };

        form.onsubmit = (e) => this.handleSubmit(e);

        form.appendChild(taskInput);
        form.appendChild(submitBtn);

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(form);
        this.modal.appendChild(modalContent);

        document.body.appendChild(this.modal);
    }

    handleSubmit(e) {
        e.preventDefault();
        const taskDescription = document.getElementById('taskDescription').value;
        if (taskDescription && this.projectId) {
            const newTask = {
                task: taskDescription,
                category: this.projectId, // Use projectId as category
                improving: 'low' // Default priority
            };
            window.projectTaskStore.addTask(newTask);
            if (typeof updateProjectTasks === 'function') {
                updateProjectTasks();
            }
            this.hide();
        }
    }

    show(projectId) {
        this.projectId = projectId;
        this.modal.style.display = 'block';
    }

    hide() {
        this.modal.style.display = 'none';
        const form = this.modal.querySelector('form');
        if (form) form.reset();
        this.projectId = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.addProjectTaskModal = new AddProjectTaskModal();
});
