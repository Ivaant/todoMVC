const todos = ["item 1", "item 2", "item 3"];

const displayTodos = todoList => {
    console.log("My todos: ", todoList);
}

const addTodo = todoItem => {
    todos.push(todoItem);
    console.log("addTodo() result");
    displayTodos(todos);
}

const updateTodo = (newValue, index) => {
    todos[index] = newValue;
    console.log("updateTodo() result");
    displayTodos(todos);
}

const deleteTodo = index => {
    todos.splice(index, 1);
    console.log("deleteTodo() result");
    displayTodos(todos);
}

//test

displayTodos(todos);
addTodo("new item");
updateTodo("new item 1", 0);
deleteTodo(2);