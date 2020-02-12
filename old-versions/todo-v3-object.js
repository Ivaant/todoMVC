const todos = {
  list: ["item 1", "item 2", "item 3"],
  displayTodos: function() {
    console.log("My todos: ", this.list.toString());
  },
  addTodo: function(todoItem) {
    if (typeof todoItem === 'object') {
      this.list.push(todoItem);
      console.log("addTodo() result");
      this.displayTodos();
    }
   
  },
  updateTodo: function(newValue, index) {
    this.list[index] = newValue;
    console.log("updateTodo() result");
    this.displayTodos();
  },

  deleteTodo: function(index) {
    this.list.splice(index, 1);
    console.log("deleteTodo() result");
    this.displayTodos();
  }
};


//test

todos.displayTodos();
todos.addTodo("new item");
todos.updateTodo("new item 1", 0);
todos.deleteTodo(2);