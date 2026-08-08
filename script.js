const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const validationMessage = document.getElementById("validation-message");
const totalCount = document.getElementById("total-count");
const activeCount = document.getElementById("active-count");
const clearCompletedButton = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter");
const emptyState = document.getElementById("empty-state");

let tasks = [];
let activeFilter = "all";

// Load tasks from localStorage if it exists.
const savedTasks = localStorage.getItem("taskTrackerTasks");
if (savedTasks) {
  try {
    tasks = JSON.parse(savedTasks);
  } catch (error) {
    tasks = [];
  }
}

function saveTasks() {
  // Saving is optional, but it keeps tasks after a refresh.
  localStorage.setItem("taskTrackerTasks", JSON.stringify(tasks));
}

function setValidationMessage(message) {
    validationMessage.textContent = message;
}

function getFilteredTasks() {
    if (activeFilter === "active") {
      return tasks.filter((task) => !task.completed);
    }
    if(activeFilter === "completed") {
        return tasks.filter((task) => task.completed);
    }
    return tasks;
}

function updateCounts() {
    totalCount.textContent = tasks.length;
    const remaining = tasks.filter((task) => !task.completed).length;
    activeCount.textContent = remaining;
}

function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = getFilteredTasks();

    filteredTasks.forEach((task) => {
        const listItem = document.createElement("li");
        listItem.className = "task-item";
        if (task.completed) {
          listItem.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("arial-label", "Mark task complete");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", "Delete task");

        deleteButton.addEventListener("click", () =>{
            tasks = tasks.filter((item) => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        listItem.append(checkbox,text,deleteButton);
        taskList.appendChild(listItem);
        });

        updateCounts();
        emptyState.style.display = tasks.length === 0 ? "block" : "none";
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = taskInput.value.trim();

    if (!text){
        setValidationMessage("Please enter a task.");
        return;
    }

    const newTask ={
        id:Date.now().toString(),
        text,
        completed: false,
    };

    tasks.unshift(newTask);
    taskInput.value = "";
    setValidationMessage("");
    saveTasks();
    renderTasks();
    taskInput.focus();
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () =>{
        filterButtons.forEach((btn) => btn.classList.remove("is-active"));
        button.classList.add("is-active");
        activeFilter = button.dataset.filter;
        renderTasks();
    });
});

clearCompletedButton.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
});

taskInput.addEventListener("input",() =>{
    if(taskInput.value.trim()) {
        setValidationMessage("");
    }
});

renderTasks();