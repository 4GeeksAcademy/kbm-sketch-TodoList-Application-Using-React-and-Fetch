import React, { useState, useEffect } from "react";

export default function TodoList() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const USER_API = `https://playground.4geeks.com/todo/users/${username}`;
  const TODOS_API = `https://playground.4geeks.com/todo/todos/${username}`;

  const createUser = async () => {
    try {
      const res = await fetch(USER_API, {
        method: "POST",
      });
      if (res.ok) {
        console.log("User created:", username);
      } else {
        console.error("Failed to create user");
      }
    } catch (error) {
      console.error("Create user error:", error);
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
    }
  }, [isLoggedIn]);

  const fetchTasks = async () => {
    if (!username) return;

    try {
      const res = await fetch(USER_API);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.todos || []);
      } else if (res.status === 404) {
        await createUser();
        setTasks([]);
      }
    } catch (error) {
      console.error("Fetch tasks error:", error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const res = await fetch(TODOS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: newTask.trim(),
          is_done: false,
        }),
      });

      if (res.ok) {
        setNewTask("");
        fetchTasks();
      }
    } catch (error) {
      console.error("Add task error:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(
        `https://playground.4geeks.com/todo/todos/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        fetchTasks();
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Delete task error:", error);
    }
  };

  const handleLogin = () => {
    if (!username.trim()) return;
    setIsLoggedIn(true);
    fetchTasks();
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setTasks([]);
    setNewTask("");
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <h2>Enter your username</h2>
        <input
          type="text"
          placeholder="rebel"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="todo-container">
      <h1>{username}'s TODO List</h1>

      <div style={{ display: "flex", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Add new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.length === 0 && <li>No tasks, add some!</li>}
        {tasks.map((task) => (
          <li key={task.id}>
            {task.label}
            <button onClick={() => deleteTask(task.id)}>X</button>
          </li>
        ))}
      </ul>

      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <button onClick={logout} style={{ backgroundColor: "#9ca3af" }}>
          Logout
        </button>
      </div>
    </div>
  );
}
