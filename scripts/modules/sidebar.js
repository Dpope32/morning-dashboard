class Sidebar {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.todoList = document.getElementById('todoList');
        this.newTodoInput = document.getElementById('newTodo');
        this.isOpen = false;
        this.closeSidebar();
        this.setupCloseButton();
        this.setupToggleButton();
        this.loadTodos();
        this.setupEventListeners();
        this.setupDragAndDrop();
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
        
        toggleBtn.addEventListener('click', () => {
            this.toggleSidebar();
        });

        this.toggleBtn = toggleBtn;
        this.toggleBtn.style.display = 'flex';
    }

    setupDragAndDrop() {
        this.todoList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('todo-item')) {
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', e.target.querySelector('span').textContent);
            }
        });

        this.todoList.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('todo-item')) {
                e.target.classList.remove('dragging');
            }
        });

        this.todoList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingItem = this.todoList.querySelector('.dragging');
            if (!draggingItem) return;

            const siblings = [...this.todoList.querySelectorAll('.todo-item:not(.dragging)')];
            const nextSibling = siblings.find(sibling => {
                const box = sibling.getBoundingClientRect();
                const offset = e.clientY - box.top - box.height / 2;
                return offset < 0;
            });

            this.todoList.insertBefore(draggingItem, nextSibling);
        });

        this.todoList.addEventListener('drop', (e) => {
            e.preventDefault();
        });
    }

    closeSidebar() {
        this.sidebar.style.transform = 'translateX(-100%)';
        this.isOpen = false;
    }

    openSidebar() {
        this.sidebar.style.transform = 'translateX(0)';
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
        mediaQuery.addListener((e) => {
            if (e.matches) {
                this.closeSidebar();
            }
        });
    }

    addTodoItem(text) {
        const newTodo = window.todoStore.addTodo(text);
        this.renderTodoItem(newTodo, this.todoList.children.length - 1);
    }

    renderTodoItem(todo, index) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.draggable = true;
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.checked ? 'checked' : ''} />
            <span>${todo.text}</span>
            <button class="delete-todo">×</button>
        `;

        // Delete button handler
        const deleteBtn = li.querySelector('.delete-todo');
        deleteBtn.addEventListener('click', () => {
            window.todoStore.removeTodo(index);
            li.remove();
        });

        // Checkbox handler
        const checkbox = li.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => {
            window.todoStore.toggleTodo(index);
            li.classList.toggle('completed', checkbox.checked);
            li.style.background = checkbox.checked ? 'var(--todo-item-completed)' : 'var(--todo-item-bg)';
        });

        this.todoList.appendChild(li);
    }

    loadTodos() {
        const todos = window.todoStore.getTodos();
        todos.forEach((todo, index) => {
            this.renderTodoItem(todo, index);
        });
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Sidebar();
});
