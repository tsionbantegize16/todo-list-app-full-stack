import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingDescription, setEditingDescription] = useState("");
  const [editingCompleted, setEditingCompleted] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newDescription.trim()) return;
    await axios.post(API_URL, { description: newDescription, completed: false });
    setNewDescription("");
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTodos();
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingDescription(todo.description);
    setEditingCompleted(todo.completed);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingDescription("");
    setEditingCompleted(false);
  };

  const saveEdit = async (id) => {
    await axios.put(`${API_URL}/${id}`, {
      description: editingDescription,
      completed: editingCompleted,
    });
    cancelEdit();
    fetchTodos();
  };

  const toggleCompleted = async (todo) => {
    await axios.put(`${API_URL}/${todo.id}`, {
      description: todo.description,
      completed: !todo.completed,
    });
    fetchTodos();
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>To-Do List</h2>
      <form onSubmit={addTodo} style={{ marginBottom: 20 }}>
        <input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Add new to-do"
          style={{ width: "70%" }}
        />
        <button type="submit" style={{ marginLeft: 8 }}>
          Add
        </button>
      </form>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              margin: "10px 0",
              display: "flex",
              alignItems: "center",
              background: "#f9f9f9",
              borderRadius: 4,
              padding: 8,
            }}
          >
            {editingId === todo.id ? (
              <>
                <input
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <label style={{ marginRight: 8 }}>
                  <input
                    type="checkbox"
                    checked={editingCompleted}
                    onChange={(e) => setEditingCompleted(e.target.checked)}
                  />
                  Completed
                </label>
                <button onClick={() => saveEdit(todo.id)} style={{ marginRight: 4 }}>
                  Save
                </button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleCompleted(todo)}
                  style={{ marginRight: 8 }}
                />
                <span
                  style={{
                    flex: 1,
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  {todo.description}
                </span>
                <button onClick={() => startEdit(todo)} style={{ marginRight: 4 }}>
                  Edit
                </button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
