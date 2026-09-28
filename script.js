const API_URL = "https://todo-backend-o6jo.onrender.com";

// Toast
function showToast(message, color) {
    Toastify({
        text: message,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: { background: color }
    }).showToast();
}

// Load tasks
async function loadTasks(){
    let display = document.getElementById('displayContainer');
    display.innerHTML = "Loading tasks...";

    try {
        let res = await fetch(`${API_URL}/tasks`);
        let data = await res.json();
        displayTask(data);
    } catch (error) {
        display.innerHTML = "<h2>❌ Failed to load tasks</h2>";
        console.error(error);
    }
}

// Add Task
window.addTask = async function (){
    let task = document.getElementById('task').value;
    let priority = document.getElementById('priority').value;

    if(task.trim() === ""){
        showToast("Enter task first", "orange");
        return;
    }

    try {
        await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ task, priority })
        });

        showToast("Task Added", "#4CAF50");

        document.getElementById('task').value = "";
        loadTasks();

    } catch (error) {
        showToast("❌ Failed to add task", "red");
        console.error(error);
    }
};

// Display Tasks (🔥 FIXED UI)
function displayTask(tasks){
    let display = document.getElementById('displayContainer');
    display.innerHTML = "";

    if(tasks.length === 0){
        display.innerHTML = "<h2>No tasks yet...</h2>";
        return;
    }

    tasks.forEach(t => {
        display.innerHTML += `
        <div class="task-card">
            <h3>${t.task}</h3>
            <span class="priority">${t.priority}</span>
            <button class="btn2" onclick="deleteTask(${t.id})">✔ Complete</button>
        </div>`;
    });
}

// Delete Task
window.deleteTask = async function(id){
    try {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: "DELETE"
        });

        showToast("🎉 Task Completed", "#2196f3");
        loadTasks();

    } catch (error) {
        showToast("❌ Delete failed", "red");
        console.error(error);
    }
};

// Init
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();

    document.getElementById("task").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            addTask();
        }
    });
});