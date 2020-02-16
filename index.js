//************************************************ */
//*******************STORAGE********************** */
//*********************************************** */

const storage = {
  todoKeysArray: [],
  getTodoKeysArray: function () {
    let todoKeysArray = localStorage.getItem("todoKeysArray");
    if (!todoKeysArray) {
      todoKeysArray = [];
      localStorage.setItem("todoKeysArray", JSON.stringify(todoKeysArray));
    } else {
      todoKeysArray = JSON.parse(todoKeysArray);
    }
    this.todoKeysArray = todoKeysArray;
    return this.todoKeysArray;
  },
  getTodosFromStorage: function () {
    const todoKeysArray = this.getTodoKeysArray();
    return todoKeysArray.map(key => {
      return JSON.parse(localStorage[key]);
    });
  },
  addTodoToStorage: function (todoElem) {
    const key = "todo_" + new Date().getTime();
    localStorage.setItem(key, JSON.stringify(todoElem));
    this.todoKeysArray.push(key);
    localStorage.setItem("todoKeysArray", JSON.stringify(this.todoKeysArray));
  },
  updateTodoToStorage: function (todoElem, index) {
    const key = this.todoKeysArray[index];
    localStorage.setItem(key, JSON.stringify(todoElem));
  },
  deleteTodoFromStorage: function (index) {
    const key = this.todoKeysArray[index];
    localStorage.removeItem(key);
    this.todoKeysArray.splice(index, 1);
    localStorage.setItem("todoKeysArray", JSON.stringify(this.todoKeysArray));
  },
  delCompletedFromStorage: function (delIndexes) {
    this.todoKeysArray.forEach((elem, index) => {
      if (delIndexes.includes(index)) {
        this.deleteTodoFromStorage(index);
      }
    });
  }
};




//*************************************************
//***************MODEL*****************************
//*************************************************

const todos = {
  list: [],
  displayTodos: function () {
    if (this.list.length > 0) {
      console.log("My todos: ");
      for (item of this.list) {
        if (item.completed) console.log("(x) ", item.todoText);
        else console.log("( ) ", item.todoText);
      }
    } else console.log("Todos is empty");
  },

  initTodos: function () {
    this.list = storage.getTodosFromStorage();
  },
  addTodo: function (todoText) {
    const todoElem = {
      todoText: todoText,
      completed: false
    }
    this.list.push(todoElem);
    storage.addTodoToStorage(todoElem);
  },
  updateTodo: function (todoText, index) {
    const todoElem = this.list[index];
    todoElem.todoText = todoText;
    this.list[index] = todoElem;
    storage.updateTodoToStorage(todoElem, index);
  },

  toggleCompleted: function (index) {
    this.list[index].completed = !this.list[index].completed;
    storage.updateTodoToStorage(this.list[index], index);
  },

  toggleAll: function () {
    let isAllCompleted = false;
    const counter = this.list.reduce((acc, elem) => {
      if (elem.completed) acc++;
      return acc;
    }, 0);
    if (counter === this.list.length) {
      isAllCompleted = true;
    }

    this.list.forEach((elem, index) => {
      if (isAllCompleted) elem.completed = false;
      else elem.completed = true;
      storage.updateTodoToStorage(elem, index);
    });
  },

  getNumberOfActive: function () {
    return this.list.reduce((acc, elem) => {
      if (!elem.completed) acc++;
      return acc;
    }, 0);
  },

  getNumberOfCompleted: function () {
    return this.list.reduce((acc, elem) => {
      if (elem.completed) acc++;
      return acc;
    }, 0);
  },

  deleteTodo: function (index) {
    this.list.splice(index, 1);
    storage.deleteTodoFromStorage(index);
  },

  deleteCompleted: function () {
    const delIndexes = this.list.map((elem, index) => {
      if (elem.completed) return index;
    });
    this.list = this.list.filter(elem => {
      return elem.completed == false;
    });
    storage.delCompletedFromStorage(delIndexes);
  },
  getAllTodos: function () {
    return this.list;
  },
  getActiveTodos: function () {
    return this.list.filter(elem => {
      return elem.completed == false;
    });
  },
  getCompletedTodos: function () {
    return this.list.filter(elem => {
      return elem.completed == true;
    });
  }
};


// *******************************************************
//***************CONTROLLER**************************** */
//***************************************************** */

const handlers = {
  loadTodoApp: function () {
    todos.initTodos();
    view.displayAllTodos();
  },
  addTodo: function (event) {
    const inputElem = event.target;
    const inputText = event.target.value;
    if (inputText) {
      todos.addTodo(inputText);
      inputElem.value = "";
    }
    view.displayAllTodos();
  },
  updateTodo: function (newText, position) {
    if (newText != false) {
      todos.updateTodo(newText, position);
    }
    view.displayAllTodos();
  },
  toggleAll: function () {
    todos.toggleAll();
    view.displayAllTodos();
  },
  toggleCompleted: function () {
    const PositionInput = document.querySelector("#toggleTodoPositionInput");
    const position = +PositionInput.value;
    if (position != null) {
      todos.toggleCompleted(position);
      PositionInput.value = null;
    }
    view.displayAllTodos();
  },

  deleteCompleted: function () {
    todos.deleteCompleted();
    view.displayAllTodos();
  },

  handleTodo: function (event) {
    if (event.target.className === "del-but") {
      const position = +event.target.parentNode.id;
      if (position != null) {
        todos.deleteTodo(position);
      }
    } else if (event.target.className === "toggle") {
      const position = +event.target.parentNode.id;
      if (position != null) {
        todos.toggleCompleted(position);
      }
    } else if (event.target.className === "display-text") {
      event.target.edit();
    }
    view.displayAllTodos();
  }
};


// ********************************************************
//*******************VIEW********************************* */
//******************************************************* */

const view = {
  displayAllTodos: function (event) {
    let selected = null;
    if (event !== undefined && event.type === "click") selected = event.target;
    else selected = document.querySelector("button#all");
    this._setSelectedButton(selected);
    this._displayTodos(todos.getAllTodos());
  },
  displayActiveTodos: function (event) {
    const selected = event.target;
    this._setSelectedButton(selected);
    this._displayTodos(todos.getActiveTodos());
  },
  displayCompletedTodos: function (event) {
    const selected = event.target;
    this._setSelectedButton(selected);
    this._displayTodos(todos.getCompletedTodos());
  },
  _displayTodos: function (list) {
    const ulElem = document.querySelector("#display");
    while (ulElem.lastChild) {
      ulElem.removeChild(ulElem.lastChild);
    }
    list.forEach((elem, index) => {
      const liElem = document.createElement("li");
      liElem.className = "display-row";
      liElem.id = index;

      const checkBoxElem = document.createElement('input');
      checkBoxElem.type = "checkbox";
      checkBoxElem.className = "toggle";
      if (elem.completed) {
        checkBoxElem.setAttribute("checked", "");
        liElem.classList.add("completed");
      } else {
        checkBoxElem.removeAttribute("checked");
        liElem.classList.remove("completed");
      }


      const displayText = elem.todoText;
      const textElem = this.createTextElem(displayText, liElem.id, elem.completed);
      const delButElem = this.createDelButton();

      liElem.appendChild(checkBoxElem);
      liElem.appendChild(textElem)
      liElem.appendChild(delButElem);
      ulElem.appendChild(liElem);
    });
    this.updateFooter();
  },
  createTextElem: function (text, parentId, isCompleted) {
    const textElem = document.createElement("p");
    textElem.textContent = text;
    if (!isCompleted) {
      textElem.setAttribute("contenteditable", "true");
    } else textElem.removeAttribute("contenteditable");

    textElem.className = "display-text";
    textElem.onclick = function (event) {
      event.stopPropagation();
    }
    textElem.onblur = function (event) {
      handlers.updateTodo(event.target.textContent, parentId);
    }
    return textElem;
  },
  createDelButton: function () {
    const delButElem = document.createElement("span");
    delButElem.textContent = "+";
    delButElem.className = "del-but";
    return delButElem;
  },
  _setSelectedButton: function (selected) {
    const filterButtons = document.querySelectorAll("#filters li button");
    filterButtons.forEach(elem => {
      if (elem === selected) elem.classList.add("selected");
      else elem.classList.remove("selected");
    });
  },
  updateFooter: function () {
    const footerElem = document.querySelector(".footer");
    if (todos.list.length > 0) {
      footerElem.style.visibility = "visible";
      const todoCountElem = document.querySelector("#todo-count");
      const numberLeft = todos.getNumberOfActive();
      todoCountElem.textContent = "";
      todoCountElem.textContent = numberLeft + " items left";
    } else {
      footerElem.style.visibility = "hidden";
    }
    const clearCompletedButElem = document.querySelector("#clear-completed");
    if (todos.getNumberOfCompleted() > 0)
      clearCompletedButElem.style.visibility = "visible";
    else clearCompletedButElem.style.visibility = "hidden";
  }
};

window.onload = handlers.loadTodoApp;