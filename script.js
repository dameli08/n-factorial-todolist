let tasks = {
  todo: [],
  done: [],
  trash: []
};

const todoTasksEl = document.getElementById('todoTasks');
const doneTasksEl = document.getElementById('doneTasks');
const trashTasksEl = document.getElementById('trashTasks');
const newTaskTextEl = document.getElementById('newTaskText');
const modalEl = document.getElementById('modal');

// Function to show the add task modal
function showAddTaskModal() {
  modalEl.classList.remove('hidden');
  newTaskTextEl.value = '';
  newTaskTextEl.focus();
}

// Function to close the modal
function closeModal() {
  modalEl.classList.add('hidden');
}

// Function to add a new task
function addTask() {
  const taskText = newTaskTextEl.value.trim();
  if (taskText) {
    tasks.todo.push(taskText);
    newTaskTextEl.value = '';
    closeModal();
    renderTasks();
  }
}

// Function to render tasks in the respective lists
function renderTasks() {
  // Clear current tasks
  todoTasksEl.innerHTML = '';
  doneTasksEl.innerHTML = '';
  trashTasksEl.innerHTML = '';

  // Render todo tasks
  tasks.todo.forEach((task, index) => {
    todoTasksEl.innerHTML += createTaskHTML(task, 'todo', index);
  });

  // Render done tasks
  tasks.done.forEach((task, index) => {
    doneTasksEl.innerHTML += createTaskHTML(task, 'done', index);
  });

  // Render trash tasks
  tasks.trash.forEach((task, index) => {
    trashTasksEl.innerHTML += createTaskHTML(task, 'trash', index);
  });

  // Add click event listeners to task actions
  addTaskActions();
}

// Function to create HTML for a task
function createTaskHTML(task, list, index) {
  return `
    <div class="task">
      <span>${task}</span>
      <div class="actions">
        ${list === 'todo' ? '<button onclick="markAsDone(' + index + ')">✓</button>' : ''}
        ${list === 'done' ? '<button onclick="restoreFromDone(' + index + ')">↩</button>' : ''}
        <button onclick="moveToTrash('${list}', ${index})">🗑</button>
      </div>
    </div>
  `;
}

// Function to add tasks to done
function markAsDone(index) {
  tasks.done.push(tasks.todo[index]);
  tasks.todo.splice(index, 1);
  renderTasks();
}

// Function to move tasks to trash
function moveToTrash(list, index) {
  tasks.trash.push(tasks[list][index]);
  tasks[list].splice(index, 1);
  renderTasks();
}

// Function to restore tasks from done
function restoreFromDone(index) {
  tasks.todo.push(tasks.done[index]);
  tasks.done.splice(index, 1);
  renderTasks();
}

// Function to switch between task lists
function showList(listName) {
  todoTasksEl.parentElement.classList.toggle('hidden', listName !== 'todo');
  doneTasksEl.parentElement.classList.toggle('hidden', listName !== 'done');
  trashTasksEl.parentElement.classList.toggle('hidden', listName !== 'trash');

  // Update tab button classes
  document.querySelectorAll('.tab-button').forEach(btn => {
    if (btn.textContent.toLowerCase() === listName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Function to add click event listeners to task action buttons
function addTaskActions() {
  document.querySelectorAll('.task').forEach((taskEl, index) => {
    taskEl.querySelector('.actions').addEventListener('click', (e) => {
      const action = e.target.textContent.trim();
      const taskIndex = Array.from(taskEl.parentElement.children).indexOf(taskEl);
      const listName = taskEl.parentElement.id.replace('Tasks', '');
      if (action === '✓') {
        markAsDone(taskIndex);
      } else if (action === '🗑') {
        moveToTrash(listName, taskIndex);
      } else if (action === '↩') {
        restoreFromDone(taskIndex);
      }
    });
  });
}

// Initial rendering of tasks
renderTasks();
