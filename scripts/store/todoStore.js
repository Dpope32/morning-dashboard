(function() {
    function createTodoStore() {
        const STORE_KEY = 'todoStore';
        let todos = loadTodos();

        function loadTodos() {
            try {
                return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
            } catch (error) {
                console.error('Error loading todos:', error);
                return [];
            }
        }

        function saveTodos() {
            localStorage.setItem(STORE_KEY, JSON.stringify(todos));
        }

        return {
            addTodo(text) {
                const newTodo = { text, checked: false };
                todos.push(newTodo);
                saveTodos();
                return newTodo;
            },

            removeTodo(index) {
                todos.splice(index, 1);
                saveTodos();
            },

            toggleTodo(index) {
                const todo = todos[index];
                if (todo) {
                    todo.checked = !todo.checked;
                    saveTodos();
                }
            },

            getTodos() {
                return todos;
            }
        };
    }

    window.todoStore = createTodoStore();
})();
