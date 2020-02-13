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
  addTodo: function (todoText) {
    this.list.push({
      todoText: todoText,
      completed: false
    });
  },
  updateTodo: function (todoText, index) {
    this.list[index].todoText = todoText;
  },

  toggleCompleted: function (index) {
    this.list[index].completed = !this.list[index].completed;
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

    this.list.forEach(elem => {
      if (isAllCompleted) elem.completed = false;
      else elem.completed = true;
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
  },

  deleteCompleted: function () {
    this.list = this.list.filter(elem => {
      return elem.completed == false;
    });
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


const handlers = {
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
      console.log("display-text focused");
    }
    view.displayAllTodos();
  }
};


// ********************************************************


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
    const closeButElem = document.createElement("span");
    closeButElem.textContent = "+";
    closeButElem.className = "del-but";
    return closeButElem;
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


// ******************************************************
//test
todos.addTodo("Make hoework");
todos.addTodo("Learn JS");
todos.addTodo("Make grocery shopping");
todos.updateTodo("Make homework properly", 0);
todos.toggleCompleted(1);
