document.addEventListener('DOMContentLoaded', function () {
    const toggleThemeIcon = document.getElementById('toggleTheme');
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const searchBar = document.getElementById('searchBar');
    const filterSelect = document.getElementById('filterSelect');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskModal = document.getElementById('taskModal');
    const closeModal = document.getElementById('closeModal');

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} > 
            <span class=${task.completed ? 'completed' : ''}>${task.text}</span>
            <button class="delete">Delete</button>
        `;
        taskList.appendChild(li);

        li.querySelector('input[type="checkbox"]').addEventListener('change', function () {
            task.completed = this.checked;
            saveTasks(getTasksFromDOM());
        });

        li.querySelector('.delete').addEventListener('click', function () {
            removeTaskFromDOM(task);
            saveTasks(getTasksFromDOM());
        });
    }

    function getTasksFromDOM() {
        return Array.from(taskList.children).map(li => {
            return {
                text: li.querySelector('span').textContent,
                completed: li.querySelector('input[type="checkbox"]').checked
            };
        });
    }

    function removeTaskFromDOM(taskToRemove) {
        const tasks = getTasksFromDOM();
        const filteredTasks = tasks.filter(task => task.text !== taskToRemove.text);
        taskList.innerHTML = '';
        filteredTasks.forEach(task => addTaskToDOM(task));
    }

    function filterTasks() {
        const searchTerm = searchBar.value.toLowerCase();
        const filter = filterSelect.value;

        Array.from(taskList.children).forEach(li => {
            const taskText = li.querySelector('span').textContent.toLowerCase();
            const checkbox = li.querySelector('input[type="checkbox"]');
            const showByFilter = filter === 'all' || (filter === 'completed' && checkbox.checked) || (filter === 'pending' && !checkbox.checked);
            const showBySearch = taskText.includes(searchTerm);

            li.style.display = showByFilter && showBySearch ? 'flex' : 'none';
        });
    }

    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            const newTask = { text: taskText, completed: false };
            addTaskToDOM(newTask);
            const tasks = getTasksFromDOM();
            tasks.push(newTask);
            saveTasks(tasks);
            taskInput.value = '';
            taskModal.classList.add('hidden'); // Hide modal after adding task
        }
    });

    filterSelect.addEventListener('change', filterTasks);
    searchBar.addEventListener('input', filterTasks);

    addTaskButton.addEventListener('click', function () {
        taskModal.classList.remove('hidden'); // Show modal
    });

    closeModal.addEventListener('click', function () {
        taskModal.classList.add('hidden'); // Hide modal
    });

    // Close modal if clicking outside
    window.addEventListener('click', function (event) {
        if (event.target === taskModal) {
            taskModal.classList.add('hidden'); // Hide modal
        }
    });

    // toggleThemeIcon.addEventListener('click', function () {
    //     document.body.classList.toggle('dark-mode');
    // });

    loadTasks();
});
// todo.js

document.getElementById('toggleTheme').addEventListener('click', function () {
    var headerRow = document.getElementById('headerRow');
    headerRow.classList.toggle('dark-mode');
});

