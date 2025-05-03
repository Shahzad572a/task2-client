import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
} from '../redux/slices/todoSlice';

const Todos = () => {
  const dispatch = useDispatch();
  const { todos } = useSelector((state) => state.todos);
  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(addTodo(text));
      setText('');
    }
  };

  const handleEdit = (id, currentText) => {
    setEditId(id);
    setEditText(currentText);
  };

  const handleUpdate = (id) => {
    if (editText.trim()) {
      dispatch(updateTodo({ id, text: editText }));
      setEditId(null);
      setEditText('');
    }
  };

  return (
    <div className="todo-wrapper">
      <h1 className="todo-title">TODO</h1>
      <form onSubmit={handleAdd} className="todo-form">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Create a new todo..."
          required
        />
        <button type="submit" className="add-button">Add</button>
      </form>


      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            {editId === todo._id ? (
              <>
                <input
                  className="edit-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button className="icon-button" onClick={() => handleUpdate(todo._id)}>💾</button>
              </>
            ) : (
              <>
                <div
                  className="circle"
                  onClick={() => dispatch(toggleTodo({ id: todo._id, completed: !todo.completed }))}
                >
                  {todo.completed && '✔'}
                </div>
                <span onClick={() => dispatch(toggleTodo({ id: todo._id, completed: !todo.completed }))}>
                  {todo.text}
                </span>
                <div className="actions">
                  <button className="icon-button" onClick={() => handleEdit(todo._id, todo.text)}>✏️</button>
                  <button className="icon-button" onClick={() => dispatch(deleteTodo(todo._id))}>🗑️</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
