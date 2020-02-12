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
    let counter = 0;
    for (let item of this.list) {
      if (item.completed) {
        counter++;
      }
    }
    if (counter === this.list.length) {
      isAllCompleted = true;
    }
    for (let item of this.list) {
      if (isAllCompleted) item.completed = false;
      else item.completed = true;
    }
  },

  deleteTodo: function (index) {
    this.list.splice(index, 1);
  }
};

//test
todos.addTodo("Make hoework");
todos.addTodo("Learn JS");
todos.addTodo("Have a rest");
todos.updateTodo("Make homework properly", 0);

const handlers = {
  addTodo: function () {
    const inputElem = document.querySelector("#inputTodoText");
    const inputText = inputElem.value;
    if (inputText) {
      todos.addTodo(inputText);
      inputElem.value = "";
    }
    view.displayTodos();
  },
  updateTodo: function () {
    const PositionInput = document.querySelector("#changeTodoPositionInput");
    const TextInput = document.querySelector("#changeTodoTextInput");
    const position = +PositionInput.value;
    const newText = TextInput.value;
    if (position != false && newText != false) {
      todos.updateTodo(newText, position);
      PositionInput.value = null;
      TextInput.value = null;
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
  deleteTodo: function () {
    const PositionInput = document.querySelector("#deleteTodoPositionInput");
    const position = +PositionInput.value;
    if (position != null) {
      todos.deleteTodo(position);
      PositionInput.value = null;
    }
    view.displayTodos();
  }
};

const view = {
  displayTodos: function() {
    const ulElem = document.querySelector("ul");
    while(ulElem.lastChild) {
      ulElem.removeChild(ulElem.lastChild);
    }
    for (let elem of todos.list) {
      const liElem = document.createElement("li");
      let displayText = elem.todoText;

      if (elem.completed) displayText = "(x)" + displayText;
      else displayText = "( )" + displayText;

      liElem.textContent = displayText;
      ulElem.appendChild(liElem);
    }
  }
}