class Sidebar {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.todoList = document.getElementById('todoList');
        this.newTodoInput = document.getElementById('newTodo');
        this.isOpen = true; 
        this.setupCloseButton();
        this.setupToggleButton();
        this.loadTodos();
        this.setupEventListeners();
    }

    setupCloseButton() {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '☰';
        closeBtn.className = 'sidebar-close';
        this.sidebar.insertBefore(closeBtn, this.sidebar.firstChild);
        
        closeBtn.addEventListener('click', () => {
            this.closeSidebar();
        });
    }

    setupToggleButton() {
        const existingToggle = document.querySelector('.sidebar-toggle');
        if (existingToggle) {
            existingToggle.remove();
        }

        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = '☰';
        toggleBtn.className = 'sidebar-toggle';
        document.body.appendChild(toggleBtn);
        
        toggleBtn.style.display = 'none';
        
        toggleBtn.addEventListener('click', () => {
            this.toggleSidebar();
        });

        this.toggleBtn = toggleBtn;
    }

    closeSidebar() {
        this.sidebar.style.transform = 'translateX(-100%)';
        this.toggleBtn.style.display = 'flex';
        this.isOpen = false;
    }

    openSidebar() {
        this.sidebar.style.transform = 'translateX(0)';
        this.toggleBtn.style.display = 'none';
        this.isOpen = true;
    }

    toggleSidebar() {
        if (this.isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    setupEventListeners() {
        this.newTodoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.newTodoInput.value.trim() !== '') {
                this.addTodoItem(this.newTodoInput.value.trim());
                this.newTodoInput.value = '';
            }
        });

        const mediaQuery = window.matchMedia('(max-width: 1200px)');
        const handleMediaChange = (e) => {
            if (e.matches) {
                this.closeSidebar();
            } else {
                this.openSidebar();
            }
        };
        mediaQuery.addListener(handleMediaChange);
        handleMediaChange(mediaQuery);
    }

    addTodoItem(text) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" />
            <span>${text}</span>
            <button class="delete-todo">×</button>
        `;

        // Delete button handler
        const deleteBtn = li.querySelector('.delete-todo');
        deleteBtn.addEventListener('click', () => {
            li.remove();
            this.saveTodos();
        });

        // Checkbox handler
        const checkbox = li.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed', checkbox.checked);
            if (checkbox.checked) {
                li.style.background = 'var(--todo-item-completed)';
            } else {
                li.style.background = 'var(--todo-item-bg)';
            }
            this.saveTodos();
        });

        this.todoList.appendChild(li);
        this.saveTodos();
    }

    saveTodos() {
        const todos = Array.from(this.todoList.children).map(li => ({
            text: li.querySelector('span').textContent,
            checked: li.querySelector('.todo-checkbox').checked
        }));
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    loadTodos() {
        try {
            const todos = JSON.parse(localStorage.getItem('todos')) || [];
            todos.forEach(todo => {
                const li = document.createElement('li');
                li.className = 'todo-item' + (todo.checked ? ' completed' : '');
                li.style.background = todo.checked ? 'var(--todo-item-completed)' : 'var(--todo-item-bg)';
                li.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.checked ? 'checked' : ''} />
                    <span>${todo.text}</span>
                    <button class="delete-todo">×</button>
                `;

                // Delete button handler
                const deleteBtn = li.querySelector('.delete-todo');
                deleteBtn.addEventListener('click', () => {
                    li.remove();
                    this.saveTodos();
                });

                // Checkbox handler
                const checkbox = li.querySelector('.todo-checkbox');
                checkbox.addEventListener('change', () => {
                    li.classList.toggle('completed', checkbox.checked);
                    li.style.background = checkbox.checked ? 'var(--todo-item-completed)' : 'var(--todo-item-bg)';
                    this.saveTodos();
                });

                this.todoList.appendChild(li);
            });
        } catch (error) {
            console.error('Error loading todos:', error);
        }
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Sidebar();
});
