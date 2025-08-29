const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    // --- Guardar en localStorage ---
    function saveTasks(tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasks() {
      return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    // --- Crear elemento de tarea ---
    function createTaskElement(task) {
      const listItem = document.createElement('li');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;

      const span = document.createElement('span');
      span.textContent = task.text;
      span.className = "taskText";
      if (task.completed) span.classList.add('completed');

      const deleteButton = document.createElement('span');
      deleteButton.textContent = "X";
      deleteButton.className = "deleteButton";

      listItem.appendChild(checkbox);
      listItem.appendChild(span);
      listItem.appendChild(deleteButton);

      // ✅ Checkbox: marcar como completado
      checkbox.addEventListener('change', () => {
        span.classList.toggle('completed');
        updateTaskStatus(task.id, checkbox.checked);
      });

      // ✏️ Editar con doble clic
      span.addEventListener('dblclick', () => {
        const newText = prompt("Edit task:", span.textContent);
        if (newText && newText.trim() !== "") {
          updateTaskText(task.id, newText.trim());
          span.textContent = newText.trim();
        }
      });

      // ❌ Botón eliminar
      deleteButton.addEventListener('click', () => {
        listItem.remove();
        deleteTask(task.id);
      });

      return listItem;
    }

    // --- Agregar tarea ---
    function addTask() {
      const taskText = taskInput.value.trim();
      if (taskText === "") {
        alert("Please enter a task.");
        return;
      }

      const newTask = { id: Date.now(), text: taskText, completed: false };
      const tasks = getTasks();
      tasks.push(newTask);
      saveTasks(tasks);

      const listItem = createTaskElement(newTask);
      taskList.appendChild(listItem);

      taskInput.value = "";
    }

    // --- Actualizar estado de tarea ---
    function updateTaskStatus(id, completed) {
      const tasks = getTasks();
      const index = tasks.findIndex(t => t.id === id);
      if (index > -1) {
        tasks[index].completed = completed;
        saveTasks(tasks);
      }
    }

    // --- Actualizar texto de tarea ---
    function updateTaskText(id, newText) {
      const tasks = getTasks();
      const index = tasks.findIndex(t => t.id === id);
      if (index > -1) {
        tasks[index].text = newText;
        saveTasks(tasks);
      }
    }

    // --- Eliminar tarea ---
    function deleteTask(id) {
      let tasks = getTasks();
      tasks = tasks.filter(t => t.id !== id);
      saveTasks(tasks);
    }

    // --- Cargar tareas al iniciar ---
    function loadTasks() {
      const tasks = getTasks();
      tasks.forEach(t => {
        const listItem = createTaskElement(t);
        taskList.appendChild(listItem);
      });
    }
    window.onload = loadTasks;

    // --- Eventos ---
    addTaskButton.addEventListener('click', addTask);

    // ✅ También con Enter
    taskInput.addEventListener('keypress', function(e) {
      if (e.key === "Enter") {
        addTask();
      }
    });