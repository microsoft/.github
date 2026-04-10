/**
 * MILEHIGH.WORLD: INTO THE VOID
 * Task Manager script implementing CRUD operations and theme toggling.
 * Follows ES6+ features and project coding guidelines.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Constants for configuration
    const STORAGE_KEYS = {
        TASKS: 'tasks',
        THEME: 'theme'
    };

    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterAll = document.getElementById('filter-all');
    const filterPending = document.getElementById('filter-pending');
    const filterCompleted = document.getElementById('filter-completed');
    const themeToggle = document.getElementById('theme-toggle');

    // Application State
    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || [];
    let currentFilter = 'all';

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
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'pending') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach((task) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;
            taskText.addEventListener('click', () => toggleTaskStatus(tasks.indexOf(task)));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent toggling task status when deleting
                deleteTask(tasks.indexOf(task));
            });

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
            text: trimmedText,
            completed: false
        });
        saveTasks();
        renderTasks();
    };

    /**
     * Deletes a task by index.
     * @param {number} index
     */
    const deleteTask = (index) => {
        if (index > -1) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }
    };

    /**
     * Toggles completion status of a task.
     * @param {number} index
     */
    const toggleTaskStatus = (index) => {
        if (tasks[index]) {
            tasks[index].completed = !tasks[index].completed;
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
    themeToggle.addEventListener('click', toggleTheme);

    // Initial Render
    renderTasks();
});
