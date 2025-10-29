const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create tasks table if it doesn't exist
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL
    )
  `);
})();

// Get all tasks
app.get("/tasks", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
  res.json(rows);
});

// Add a new task
app.post("/tasks", async (req, res) => {
  const { title } = req.body;
  const [result] = await pool.query("INSERT INTO tasks(title) VALUES(?)", [
    title,
  ]);
  res.json({ id: result.insertId, title });
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
  res.json({ message: "Task deleted" });
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});
