# 🗃️ Lazy DB

A simple wrapper for broswer's builtin indexedDB API with simplied methods and enhancements for building local first apps or web apps with offline mode capabilities.

Sometimes local storage is not enough and you need more and more is complicated if your to do it in broswer, this library aims to simplify common usage patterns so that you don't have to.

> Warning: Work in progress, not stable yet for usage!

## Features

- Simple API compared to IndexedDB
- Capacity checking before attempting to store data
- Cross broswer compatibility
- Zero dependencies just native broswer primitives
- Files like image handling utilities
- Configurable options to sutie your needs

## Resources And Links

- [MDN Docs - Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [Log Rocket - IndexedDB Tutorial](https://blog.logrocket.com/using-indexeddb-complete-guide/)
- [Web Dev - IndexedDB](https://web.dev/articles/indexeddb)
- [FreeCodeCamp – IndexedDB Database Guide for Beginners](https://www.freecodecamp.org/news/how-indexeddb-works-for-beginners/)

## Usage

How it works, you create a database instance using `createDatabase` and pass it your configuration such as stores or topics, database name, version and success and error handlers incase anything happens on connection, and this returns a db instance which you can use to interact with the database.

For any crud operation, you specify the topic /store name and use methods like `create`, `read`, `update`, and `delete` to do crud operations, as you can see in example below...

``` js

import { createDatabase } from 'lazy-db';

// Example usage
const DB = createDatabase({
  name: 'my_app_data',
  version: 2,
  stores: [
    { topic: 'todos' }, // Auto-incrementing id on 'id' key
    { topic: 'notes', keyPath: 'id' }, // Custom keyPath for notes
  ],
  onSuccess: (info) => console.log('Database created:', info),
  onError: (error) => console.error('Error creating database:', error),
});

let myTodos = [
  {
    task: 'play with this thing!',
    completed: false,
  },
  {
    task: 'watch a serie',
    completed: true,
  },
  {
    task: 'do somthing else',
    completed: false,
  },
];

// Create a todos with automatic IDs generation
const createTodo = async (todo) => {
  const { data, error } = await DB.create('todos', {
    task: todo.task,
    completed: todo.completed,
  });

  if (error) {
    console.error('Error creating todo:', error);
  } else {
    console.log('Created todo:', data);
  }
};
myTodos.forEach((todo) => createTodo(todo));

// Read all todos
const readAllTodos = async () => {
  const { data, error } = await DB.read('todos');
  if (error) {
    console.error('Error reading todos:', error);
    return;
  }
  console.log('Todos:', data);
};
readAllTodos();

// Read a specific todo, same as all but takes in an id
const readTodo = async (id) => {
  const { data, error } = await DB.read('todos', id);
  if (error) {
    console.error('Error reading todo:', error);
    return;
  }
  console.log('Todo:', data);
};
readTodo(1);

// Update a todo using the todo id
const updateTodo = async (todoId) => {
  let todos = await readAllTodos();
  let todo = todos.find((todo) => todo.id === todoId);
  const { data, error } = await DB.update('todos', {
    ...todo,
    completed: true,
  });
  if (error) {
    console.error('Error updating todo:', error);
    return;
  }
  console.log('Updated todo:', data);
};
updateTodo(2);

// Delete a todo using a todo id
const deleteTodo = async (id) => {
  const { data, error } = await DB.delete('todos', id);
  if (error) {
    console.error('Error deleting todo:', error);
    return;
  }
  console.log('Deleted todo:', data);
};
deleteTodo(3);

// load local todos on app startup
window.addEventListener('DOMContentLoaded', async () => {
  const { data, error } = await DB.read('todos');
  if (error) {
    console.error('Error reading todos:', error);
    return;
  }
  myTodos = data;
});

```

## Contributing

If you find issues or have ideas for improvements, please open an issue or submit a pull request or contact author at [hssnkizz@gmail.com]('hssnkizz@gmail.com')

This project is licensed under the MIT License.
