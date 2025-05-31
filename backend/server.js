// Simplified backend server to avoid path-to-regexp errors
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins (development mode)
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Data directory and file
const dataDir = path.join(__dirname, "data");
const QUIZZES_FILE = path.join(dataDir, "quizzes.json");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Default quizzes in case file is missing
const DEFAULT_QUIZZES = [
  {
    id: 1,
    title: "Programación Básica",
    questions: [
      {
        question: "¿Qué significa HTML?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyper Technical Machine Learning",
          "Home Tool Markup Language",
        ],
        correctAnswer: 0,
      },
      {
        question: "¿Cuál de estos NO es un lenguaje de programación?",
        options: ["JavaScript", "Python", "HTML", "Java"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 2,
    title: "JavaScript Avanzado",
    questions: [
      {
        question: "¿Qué es una Promise en JavaScript?",
        options: [
          "Un tipo de variable",
          "Un objeto que representa un valor futuro",
          "Una función incorporada",
          "Un tipo de bucle",
        ],
        correctAnswer: 1,
      },
      {
        question: "¿Qué método convierte un objeto JSON a cadena?",
        options: [
          "JSON.parse()",
          "JSON.stringify()",
          "JSON.toString()",
          "JSON.convert()",
        ],
        correctAnswer: 1,
      },
    ],
  },
];

// Load quizzes from disk or initialize defaults
let QUIZZES;
try {
  if (fs.existsSync(QUIZZES_FILE)) {
    const content = fs.readFileSync(QUIZZES_FILE, "utf8");
    const parsed = JSON.parse(content);
    QUIZZES = Array.isArray(parsed.quizzes) ? parsed.quizzes : parsed;
  } else {
    QUIZZES = DEFAULT_QUIZZES;
    fs.writeFileSync(QUIZZES_FILE, JSON.stringify({ quizzes: QUIZZES }, null, 2));
  }
} catch (err) {
  console.error("Error loading quizzes.json:", err.message);
  QUIZZES = DEFAULT_QUIZZES;
}

// Essential routes only
app.get("/api/quizzes", (req, res) => {
  res.json(QUIZZES);
});

app.get("/api/quizzes/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid quiz ID" });
  const quiz = QUIZZES.find(q => q.id === id);
  return quiz ? res.json(quiz) : res.status(404).json({ error: "Quiz not found" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
