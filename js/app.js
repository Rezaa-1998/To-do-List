const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const filterButtons = document.getElementsByClassName("filter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
const generatorId = () => {
  return (id = Math.round(Math.random() * Math.random() * Math.pow(10, 15)));
};
const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);
  setTimeout(() => (alert.style.display = "none"), 1000);
};
const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const displayTodos = (data) => {
  const todoList = data || todos;
  todosBody.innerHTML = "";
  if (!todoList.length) {
    todosBody.innerHTML = "<tr><td colspan='4'>No task found!</td></tr>";
    return;
  }
  todoList.forEach((todo) => {
    todosBody.innerHTML += `
    <tr>
      <td>${todo.task}</td>
      <td>${todo.date || "No date"}</td>
      <td>${todo.completed ? "Completed" : "Pending"}</td>
      <td>
          <button onclick="editHandler(${todo.id})">Edit</button>
          <button onclick="toggleHandler(${todo.id})">${
      !todo.completed ? "Do" : "Undo"
    }</button>
          <button onclick="deleteHandler(${todo.id})" >Delete</button>
      </td>
    </tr>
    `;
  });
};

const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    id: generatorId(),
    task,
    date,
    completed: false,
  };
  if (task) {
    todos.push(todo);
    saveToLocalStorage();
    displayTodos();
    taskInput.value = "";
    dateInput.value = "";
    console.log(todos);
    showAlert("Todo added successfully", "success");
  } else {
    showAlert("Please enter a todo!", "error");
  }
};

const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("All todos cleard successfully", "success");
  } else {
    showAlert("No todos to clear", "error");
  }
};

const deleteHandler = (id) => {
  console.log(todos);
  const newTodos = todos.filter((todo) => todo.id !== id);
  console.log(newTodos);
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo deleted successfully", "success");
};

const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id == id);
  todo.completed = !todo.completed;
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo status changed successfully", "success");
};

const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id == id);
  console.log(todo);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

const applyEditHandler = (event) => {
  const todo = todos.find((todo) => todo.id == event.target.dataset.id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo edited successfully", "success");
  addButton.style.display = "inline-block";
  editButton.style.display = "none";
};

window.addEventListener("load", () => displayTodos());
addButton.addEventListener("click", addHandler);
editButton.addEventListener("click", applyEditHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);

const filterHandler = (event) => {
  const filter = event.target.dataset.filter;
  let filteredTodos = null;
  switch (filter) {
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed == true);
      break;
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed == false);
      break;
    default:
      filteredTodos = todos;
      break;
  }
  displayTodos(filteredTodos);
};

// filterButtons.forEach((button) =>
//   button.addEventListener("click", filterHandler)
// );
for (button of filterButtons) {
  button.addEventListener("click", filterHandler);
}
// console.log(filterButtons);
