// Task Modal Component
class TaskModal {
    constructor() {
        this.modal = null;
        this.selectedDays = new Set();
        this.confirmationModal = null;
        this.createModal();
    }

    createConfirmationModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1001;
            animation: fadeIn 0.2s ease-out;
            backdrop-filter: blur(4px);
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            position: relative;
            background: rgba(13, 17, 23, 0.95);
            margin: 15% auto;
            padding: 25px;
            width: 90%;
            max-width: 400px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: slideIn 0.3s ease-out;
            text-align: center;
        `;

        const message = document.createElement('p');
        message.textContent = 'Are you sure you want to delete this task?';
        message.style.cssText = `
            color: #fff;
            font-size: 1.1em;
            margin-bottom: 20px;
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 15px;
        `;

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'Yes, Delete';
        confirmBtn.style.cssText = `
            padding: 10px 20px;
            background: transparent;
            color: #ff4444;
            border: 2px solid #ff4444;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s ease;
        `;

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `
            padding: 10px 20px;
            background: transparent;
            color: #fff;
            border: 2px solid #666;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s ease;
        `;

        [confirmBtn, cancelBtn].forEach(btn => {
            btn.onmouseover = () => {
                btn.style.background = 'rgba(255, 255, 255, 0.1)';
                btn.style.transform = 'translateY(-1px)';
            };
            btn.onmouseout = () => {
                btn.style.background = 'transparent';
                btn.style.transform = 'translateY(0)';
            };
        });

        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        content.appendChild(message);
        content.appendChild(buttonContainer);
        modal.appendChild(content);

        return {
            element: modal,
            show: (onConfirm) => {
                modal.style.display = 'block';
                confirmBtn.onclick = () => {
                    onConfirm();
                    modal.style.display = 'none';
                };
                cancelBtn.onclick = () => {
                    modal.style.display = 'none';
                };
            },
            hide: () => {
                modal.style.display = 'none';
            }
        };
    }

    createTaskList(day) {
        const taskList = document.createElement('div');
        taskList.style.marginTop = '20px';
        taskList.style.paddingTop = '20px';

        const tasks = window.tasksByDay[day].active;
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.className = 'modal-task-item';

            const taskInfo = document.createElement('div');
            taskInfo.className = 'modal-task-info';

            const taskName = document.createElement('div');
            taskName.className = 'modal-task-name';
            taskName.textContent = task.task;

            const taskDetails = document.createElement('div');
            taskDetails.className = 'modal-task-details';
            taskDetails.textContent = `${task.category} • ${task.priority} priority${task.time ? ` • ${task.time}` : ''}${task.oneTime ? ' • One-time task' : ''}`;

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '×';
            deleteBtn.className = 'modal-task-delete';

            deleteBtn.onclick = () => {
                if (!this.confirmationModal) {
                    this.confirmationModal = this.createConfirmationModal();
                    document.body.appendChild(this.confirmationModal.element);
                }
                this.confirmationModal.show(() => {
                    window.taskManager.deleteTask(day, index);
                    
                    try {
                        localStorage.setItem('tasksByDay', JSON.stringify(window.tasksByDay));
                    } catch (e) {
                        console.error('Error saving tasks to localStorage:', e);
                    }
                    
                    taskItem.style.height = '0';
                    taskItem.style.opacity = '0';
                    taskItem.style.marginBottom = '0';
                    taskItem.style.padding = '0';
                    setTimeout(() => {
                        taskItem.remove();
                        if (taskList.children.length === 0) {
                            taskList.style.display = 'none';
                        }
                    }, 300);
                });
            };

            taskInfo.appendChild(taskName);
            taskInfo.appendChild(taskDetails);
            taskItem.appendChild(taskInfo);
            taskItem.appendChild(deleteBtn);
            taskList.appendChild(taskItem);
        });

        return taskList;
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.id = 'taskModal';
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
            margin: 5% auto;
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

        const columnsContainer = document.createElement('div');
        columnsContainer.style.cssText = `
            display: flex;
            gap: 30px;
            margin-top: 20px;
            height: calc(80vh - 100px);
            overflow: hidden;
        `;

        const leftColumn = document.createElement('div');
        leftColumn.style.cssText = `
        flex: 0 0 35%;
            padding: 20px;
            background: rgba(13, 17, 23, 0.95);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            overflow-y: auto;
            max-height: 100%;
        `;

        const addTaskHeader = document.createElement('h2');
        addTaskHeader.textContent = 'Add New Task';
            addTaskHeader.style.cssText = `
            margin: 0 0 20px 0;
            color: rgba(255, 255, 255, 0.95);
            font-size: 1.4em;
            font-weight: 600;
            letter-spacing: 0.5px;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
            text-align: center;
        `;

        const daySelector = document.createElement('div');
        daySelector.className = 'day-selector';
        daySelector.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 30px;
        `;

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        days.forEach(day => {
            const dayBtn = document.createElement('button');
            dayBtn.textContent = day.charAt(0).toUpperCase() + day.slice(1);
            dayBtn.className = 'day-button';
            dayBtn.style.cssText = `
                padding: 8px 15px;
                border: none;
                background: rgba(255, 255, 255, 0.03);
                color: #fff;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
                font-size: 0.9em;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(5px);
            `;

            dayBtn.onmouseover = () => {
                if (!this.selectedDays.has(day)) {
                    dayBtn.style.background = 'rgba(255, 255, 255, 0.07)';
                    dayBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                    dayBtn.style.transform = 'translateY(-1px)';
                }
            };

            dayBtn.onmouseout = () => {
                if (!this.selectedDays.has(day)) {
                    dayBtn.style.background = 'rgba(255, 255, 255, 0.03)';
                    dayBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                    dayBtn.style.transform = 'translateY(0)';
                }
            };

            dayBtn.onclick = () => this.toggleDay(day, dayBtn);
            daySelector.appendChild(dayBtn);
        });

        const form = document.createElement('form');
        form.className = 'task-form';
        form.style.cssText = `
            display: grid;
            gap: 20px;
        `;

        const formFields = [
            { label: 'Task Name', type: 'text', id: 'taskName', required: true },
            { label: 'Time (optional)', type: 'time', id: 'taskTime' },
            { 
                label: 'Priority', 
                type: 'select', 
                id: 'taskPriority',
                options: ['high', 'medium', 'low']
            },
            { 
                label: 'Category', 
                type: 'select', 
                id: 'taskCategory',
                options: window.tasksByDay.settings.categories
            },
            { 
                label: 'Improving', 
                type: 'select', 
                id: 'taskImproving',
                options: ['Health', 'Wealth', 'Relationships', 'Skills', 'Knowledge', 'Career', 'Personal Growth']
            },
            {
                label: 'One-time task',
                type: 'checkbox',
                id: 'taskOneTime',
                description: 'Check this for non-repeating tasks (e.g., appointments)'
            }
        ];

        formFields.forEach(field => {
            const fieldContainer = document.createElement('div');
            fieldContainer.style.cssText = `
                display: flex;
                flex-direction: ${field.type === 'checkbox' ? 'row' : 'column'};
                gap: ${field.type === 'checkbox' ? '12px' : '8px'};
                align-items: ${field.type === 'checkbox' ? 'center' : 'stretch'};
                background: ${field.type === 'checkbox' ? 'rgba(255, 255, 255, 0.03)' : 'transparent'};
                padding: ${field.type === 'checkbox' ? '15px 20px' : '0'};
                border-radius: ${field.type === 'checkbox' ? '12px' : '0'};
                border: ${field.type === 'checkbox' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};
                transition: all 0.2s ease;
            `;

            if (field.type === 'checkbox') {
                fieldContainer.onmouseover = () => {
                    fieldContainer.style.background = 'rgba(255, 255, 255, 0.05)';
                    fieldContainer.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                };
                fieldContainer.onmouseout = () => {
                    fieldContainer.style.background = 'rgba(255, 255, 255, 0.03)';
                    fieldContainer.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                };
            }

            const label = document.createElement('label');
            label.textContent = field.label;
            label.htmlFor = field.id;
            label.style.cssText = `
                color: rgba(255, 255, 255, ${field.type === 'checkbox' ? '0.9' : '0.8'});
                font-weight: 500;
                font-size: ${field.type === 'checkbox' ? '0.95em' : '0.9em'};
                ${field.type !== 'checkbox' ? 'margin-bottom: 4px;' : ''}
            `;

            let input;
            if (field.type === 'select') {
                input = document.createElement('select');
                input.id = field.id;
                input.required = field.required;
                input.style.cssText = `
                    padding: 12px 8px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgb(18, 20, 23) !important;
                    color: #ffffff !important;
                    border-radius: 8px;
                    font-size: 0.95em;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(5px);
                    appearance: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: right 10px center;
                    background-size: 16px;
                    padding-right: 40px;
                `;

                field.options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option;
                    opt.textContent = option.charAt(0).toUpperCase() + option.slice(1);
                    opt.style.cssText = `
                        background: rgb(18, 20, 23) !important;
                        color: #ffffff !important;
                        padding: 12px !important;
                    `;
                    input.appendChild(opt);
                });
            } else if (field.type === 'checkbox') {
                input = document.createElement('input');
                input.type = 'checkbox';
                input.id = field.id;
            } else {
                input = document.createElement('input');
                input.type = field.type;
                input.id = field.id;
                input.required = field.required;
                input.style.cssText = `
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
            }

            if (field.type !== 'checkbox') {
                input.onfocus = () => {
                    input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    input.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                };

                input.onblur = () => {
                    input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    input.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                };
            }

            if (field.type === 'checkbox') {
                fieldContainer.appendChild(input);
                fieldContainer.appendChild(label);
                if (field.description) {
                    const description = document.createElement('span');
                    description.textContent = field.description;
                    description.style.cssText = `
                        font-size: 0.8em;
                        color: rgba(255, 255, 255, 0.5);
                        margin-left: auto;
                    `;
                    fieldContainer.appendChild(description);
                }
            } else {
                fieldContainer.appendChild(label);
                fieldContainer.appendChild(input);
            }

            form.appendChild(fieldContainer);
        });

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
            margin-top: 20px;
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
        form.appendChild(submitBtn);

        const rightColumn = document.createElement('div');
        rightColumn.style.cssText = `
            flex: 1;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
            height: 100%;
        `;

        const midPoint = Math.ceil(days.length / 2);
        const leftDays = days.slice(0, midPoint);
        const rightDays = days.slice(midPoint);

        [leftDays, rightDays].forEach(columnDays => {
            const column = document.createElement('div');
            column.className = 'task-list-column';
            column.style.cssText = `
                background: rgba(13, 17, 23, 0.95);
                border-radius: 12px;
                padding: 25px;
                overflow-y: auto;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            `;

            columnDays.forEach(day => {
                if (day !== 'settings') {
                    const dayHeader = document.createElement('h3');
                    dayHeader.textContent = day.charAt(0).toUpperCase() + day.slice(1);
                    dayHeader.style.cssText = `
                        color: rgba(255, 255, 255, 0.9);
                        margin: 0 0 20px;
                        font-size: 1.2em;
                        padding: 15px 0;
                        border-bottom: 2px solid rgba(255, 255, 255, 0.1);
                    `;
                    column.appendChild(dayHeader);
                    column.appendChild(this.createTaskList(day));
                }
            });

            rightColumn.appendChild(column);
        });

        const style = document.createElement('style');
        style.textContent = `
            .task-list-column::-webkit-scrollbar {
                width: 8px;
            }
            .task-list-column::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 4px;
            }
            .task-list-column::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }
            .task-list-column::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        leftColumn.appendChild(addTaskHeader);
        leftColumn.appendChild(daySelector);
        leftColumn.appendChild(form);

        columnsContainer.appendChild(leftColumn);
        columnsContainer.appendChild(rightColumn);

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(columnsContainer);
        this.modal.appendChild(modalContent);

        document.body.appendChild(this.modal);
    }

    toggleDay(day, button) {
        if (this.selectedDays.has(day)) {
            this.selectedDays.delete(day);
            button.style.background = 'rgba(255, 255, 255, 0.03)';
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        } else {
            this.selectedDays.add(day);
            button.style.background = 'rgba(79, 70, 229, 0.15)';
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 4px 8px rgba(79, 70, 229, 0.3)';
            button.style.border = '1px solid rgba(79, 70, 229, 0.4)';
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.selectedDays.size === 0) {
            const errorMsg = document.createElement('div');
            errorMsg.textContent = 'Please select at least one day';
            errorMsg.style.cssText = `
                color: #ff4444;
                margin-top: 10px;
                font-size: 0.9em;
                text-align: center;
                animation: fadeIn 0.2s ease-out;
            `;
            e.target.appendChild(errorMsg);
            setTimeout(() => errorMsg.remove(), 3000);
            return;
        }

        const taskDetails = {
            task: document.getElementById('taskName').value,
            time: document.getElementById('taskTime').value || null,
            priority: document.getElementById('taskPriority').value,
            category: document.getElementById('taskCategory').value,
            improving: document.getElementById('taskImproving').value,
            status: 'pending',
            oneTime: document.getElementById('taskOneTime').checked
        };

        this.selectedDays.forEach(day => {
            window.taskManager.addCustomTask(day, taskDetails);
        });

        try {
            localStorage.setItem('tasksByDay', JSON.stringify(window.tasksByDay));
        } catch (e) {
            console.error('Error saving tasks to localStorage:', e);
        }

        if (typeof updateDailyTasks === 'function') {
            updateDailyTasks();
        }

        const successMsg = document.createElement('div');
        successMsg.textContent = 'Task(s) added successfully!';
        successMsg.style.cssText = `
            color: #00C851;
            margin-top: 10px;
            font-size: 0.9em;
            text-align: center;
            animation: fadeIn 0.2s ease-out;
        `;
        e.target.appendChild(successMsg);
        setTimeout(() => {
            e.target.reset();
            this.selectedDays.clear();
            document.querySelectorAll('.day-button').forEach(btn => {
                btn.style.background = 'rgba(255, 255, 255, 0.03)';
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                btn.style.border = 'none';
            });
            successMsg.remove();
            this.hide();
        }, 1500);
    }

    show() {
        this.modal.style.display = 'block';
    }

    hide() {
        this.modal.style.display = 'none';
        const form = this.modal.querySelector('form');
        if (form) form.reset();
        this.selectedDays.clear();
        document.querySelectorAll('.day-button').forEach(btn => {
            btn.style.background = 'rgba(255, 255, 255, 0.03)';
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            btn.style.border = 'none';
        });
        if (this.confirmationModal) {
            this.confirmationModal.hide();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        const savedTasks = localStorage.getItem('tasksByDay');
        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);
            const settings = window.tasksByDay.settings;
            window.tasksByDay = { ...parsedTasks, settings };
        }
    } catch (e) {
        console.error('Error loading tasks from localStorage:', e);
    }

    window.taskModal = new TaskModal();

    if (typeof updateDailyTasks === 'function') {
        updateDailyTasks();
    }
});
