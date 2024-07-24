document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const newTaskInput = document.getElementById('new-task');
    const filterTasks = document.getElementById('filter-tasks');
    const sortTasksBtn = document.getElementById('sort-tasks-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        let filteredTasks = tasks.filter(task => {
            if (filterTasks.value === 'completed') return task.completed;
            if (filterTasks.value === 'pending') return !task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            if (task.completed) taskItem.classList.add('completed');
            
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            taskList.appendChild(taskItem);

            const completeBtn = taskItem.querySelector('.complete-btn');
            const deleteBtn = taskItem.querySelector('.delete-btn');
            const editBtn = taskItem.querySelector('.edit-btn');

            completeBtn.addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            deleteBtn.addEventListener('click', () => {
                tasks = tasks.filter(t => t !== task);
                saveTasks();
                renderTasks();
            });

            editBtn.addEventListener('click', () => {
                const newTaskText = prompt('Edit Task', task.text);
                if (newTaskText !== null) {
                    task.text = newTaskText.trim();
                    saveTasks();
                    renderTasks();
                }
            });
        });
    }

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText === '') return;

        const newTask = { text: taskText, completed: false };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        newTaskInput.value = '';
    }

    addTaskBtn.addEventListener('click', addTask);

    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    filterTasks.addEventListener('change', renderTasks);

    sortTasksBtn.addEventListener('click', () => {
        tasks.sort((a, b) => a.text.localeCompare(b.text));
        saveTasks();
        renderTasks();
    });

    renderTasks();
});