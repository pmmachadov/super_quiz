// Simple server to test Express without path-to-regexp errors
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001; // Using a different port to avoid conflicts

app.use(cors());
app.use(express.json());

// Basic health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Simple route to test quizzes
app.get("/api/quizzes", (req, res) => {
  res.json([
    { id: 1, title: "Test Quiz 1" },
    { id: 2, title: "Test Quiz 2" },
  ]);
});

// Simple route to test getting a specific quiz
app.get("/api/quizzes/:id", (req, res) => {
  res.json({ id: parseInt(req.params.id), title: `Quiz ${req.params.id}` });
});

app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});
