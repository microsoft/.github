/**
 * Task Manager script implementing CRUD operations and theme toggling.
 * Follows ES6+ features and project coding guidelines.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Constants for configuration
    const STORAGE_KEYS = {
        TASKS: 'tasks',
        THEME: 'theme',
        FILTER: 'filter'
    };

    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterAll = document.getElementById('filter-all');
    const filterPending = document.getElementById('filter-pending');
    const filterCompleted = document.getElementById('filter-completed');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const taskCount = document.getElementById('task-count');
    const themeToggle = document.getElementById('theme-toggle');

    // Application State
    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || [];
    let currentFilter = localStorage.getItem(STORAGE_KEYS.FILTER) || 'all';

    /**
     * Persists tasks to localStorage.
     */
    const saveTasks = () => {
        try {
            localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
        }
    };

    /**
     * Renders the task list based on the current filter.
     */
    const renderTasks = () => {
        taskList.innerHTML = '';
        updateTaskCount();
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'pending') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach((task) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `task-${task.id}`;
            checkbox.checked = task.completed;
            checkbox.className = 'task-checkbox';
            checkbox.addEventListener('change', () => toggleTaskStatus(task.id));

            const taskText = document.createElement('label');
            taskText.setAttribute('for', `task-${task.id}`);
            taskText.className = 'task-text';
            taskText.textContent = task.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.setAttribute('aria-label', `Delete task "${task.text}"`);
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            li.appendChild(checkbox);
            li.appendChild(taskText);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    };

    /**
     * Adds a new task after validation.
     * @param {string} text
     */
    const addTask = (text) => {
        const trimmedText = text.trim();
        if (trimmedText === '') {
            return;
        }

        tasks.push({
            id: Date.now().toString(),
            text: trimmedText,
            completed: false
        });
        saveTasks();
        renderTasks();
    };

    /**
     * Deletes a task by id.
     * @param {string} id
     */
    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    /**
     * Updates the tasks remaining count in the UI.
     */
    const updateTaskCount = () => {
        const remainingTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${remainingTasks} task${remainingTasks !== 1 ? 's' : ''} remaining`;
    };

    /**
     * Clears all completed tasks.
     */
    const clearCompletedTasks = () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    };

    /**
     * Toggles completion status of a task.
     * @param {string} id
     */
    const toggleTaskStatus = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    };

    /**
     * Sets the active filter and updates UI.
     * @param {string} filter
     */
    const setFilter = (filter) => {
        currentFilter = filter;
        localStorage.setItem(STORAGE_KEYS.FILTER, filter);
        document.querySelectorAll('.task-filters button').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(`filter-${filter}`);
        if (activeBtn) activeBtn.classList.add('active');
        renderTasks();
    };

    /**
     * Toggles between light and dark themes.
     */
    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
        themeToggle.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    };

    // Initialize Theme
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? 'Light Mode' : 'Dark Mode';

    // Event Listeners
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value);
        taskInput.value = '';
    });

    filterAll.addEventListener('click', () => setFilter('all'));
    filterPending.addEventListener('click', () => setFilter('pending'));
    filterCompleted.addEventListener('click', () => setFilter('completed'));
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    themeToggle.addEventListener('click', toggleTheme);

    // Initial Render
    setFilter(currentFilter);
    renderTasks();
});
