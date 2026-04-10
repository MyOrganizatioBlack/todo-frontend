// Aún no lo enlazaremos en la nube, experimentaremos una falla común apuntando erróneamente de forma externa
const API_URL = 'https://todo-backend-kw3v.onrender.com/api/todos';
let currentTodos = [];
let selectedId = null;

async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        currentTodos = await response.json();
        renderTaskList();
    } catch (error) {
        console.error("Fallo general conectando con el backend externo:", error);
    }
}

function renderTaskList() {
    const container = document.getElementById('taskList');
    container.innerHTML = '';

    currentTodos.forEach(task => {
        const id = task._id; // MongoDB usa _id
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;
        div.innerHTML = `
<input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleStatus(event, '${id}')">
<span>${task.title}</span>
`;
        div.onclick = () => showDetail(id);
        container.appendChild(div);
    });
}

function showDetail(id) {
    const task = currentTodos.find(t => t._id === id);
    if (!task) return;
    selectedId = id;
    document.getElementById('taskId').value = id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDesc').value = task.description || '';
    document.getElementById('taskDate').value = task.date || '';
    document.getElementById('taskCompleted').checked = task.completed;
    document.getElementById('emptyMessage').classList.add('hidden');
    document.getElementById('detailPanel').style.display = 'flex';
}

function createNewTask() {
    selectedId = null;
    document.getElementById('taskId').value = '';
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDesc').value = '';
    document.getElementById('taskDate').value = '';
    document.getElementById('taskCompleted').checked = false;
    document.getElementById('emptyMessage').classList.add('hidden');
    document.getElementById('detailPanel').style.display = 'flex';
}

async function saveTask() {
    const data = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDesc').value,
        date: document.getElementById('taskDate').value,
        completed: document.getElementById('taskCompleted').checked,
    };
    const method = selectedId ? 'PUT' : 'POST';
    const url = selectedId ? `${API_URL}/${selectedId}` : API_URL;
    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    loadTasks();
}

async function toggleStatus(event, id) {
    event.stopPropagation();
    event.stopPropagation();
    const task = currentTodos.find(t => t._id === id);
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed: !task.completed })
    });
    loadTasks();
}

async function deleteTask() {
    if (!selectedId) return;
    await fetch(`${API_URL}/${selectedId}`, { method: 'DELETE' });
    document.getElementById('emptyMessage').classList.remove('hidden');
    document.getElementById('detailPanel').style.display = 'none';
    loadTasks();
}

loadTasks();
