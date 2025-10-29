import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title) return;
    await axios.post("http://localhost:5000/tasks", { title });
    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Simple Task Manager</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title} <button onClick={() => deleteTask(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
