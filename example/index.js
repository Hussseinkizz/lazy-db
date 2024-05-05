import { createDatabase } from '../index.js';

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
