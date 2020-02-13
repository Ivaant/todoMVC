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

  getNumberOfLeft: function () {
    return this.list.reduce((acc, elem) => {
      if (!elem.completed) acc++;
      return acc;
    }, 0);
  },

  deleteTodo: function (index) {
    this.list.splice(index, 1);
  }
};



const handlers = {
  addTodo: function (event) {
    // if (event.key === "Enter") {
    //   console.log("Enter");
    // }
    const inputElem = document.querySelector("#inputTodoText");
    const inputText = inputElem.value;
    if (inputText) {
      todos.addTodo(inputText);
      inputElem.value = "";
    }
    view.displayTodos();
  },
  updateTodo: function (newText, position) {
    if (newText != false) {
      todos.updateTodo(newText, position);
    }
    view.displayTodos();
  },
  toggleAll: function () {
    todos.toggleAll();
    view.displayTodos();
  },
  toggleCompleted: function () {
    const PositionInput = document.querySelector("#toggleTodoPositionInput");
    const position = +PositionInput.value;
    if (position != null) {
      todos.toggleCompleted(position);
      PositionInput.value = null;
    }
    view.displayTodos();
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
    view.displayTodos();
  }
};

const view = {
  displayTodos: function () {
    const ulElem = document.querySelector("#display");
    while (ulElem.lastChild) {
      ulElem.removeChild(ulElem.lastChild);
    }
    todos.list.forEach((elem, index) => {
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
  updateFooter: function () {
    const footerElem = document.querySelector(".footer");

    const todoCountElem = document.querySelector("#todo-count");
    const numberLeft = todos.getNumberOfLeft();
    todoCountElem.textContent = "";
    todoCountElem.textContent = numberLeft + " items left";

    const filtersElem = document.createElement("ul");


    const clearCompletedButton = document.createElement("button");

    //footerElem.appendChild(todoCountElem);
  }
};

//test
todos.addTodo("Make hoework");
todos.addTodo("Learn JS");
todos.addTodo("Have a rest");
todos.updateTodo("Make homework properly", 0);
todos.toggleCompleted(1);