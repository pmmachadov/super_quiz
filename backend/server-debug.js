// Minimal debug version of server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Permissive CORS for debugging
app.use(cors({ origin: "*", credentials: true }));
app.options("*", cors());
app.use(bodyParser.json());

// Data paths
const dataDir = path.join(__dirname, "data");
const QUIZZES_FILE = path.join(dataDir, "quizzes.json");

// Default quizzes in case file access fails
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

// Load quizzes from file or use defaults
let QUIZZES = [...DEFAULT_QUIZZES];
try {
  if (fs.existsSync(QUIZZES_FILE)) {
    const fileContent = fs.readFileSync(QUIZZES_FILE, "utf8");
    const quizzesData = JSON.parse(fileContent);

    if (quizzesData && typeof quizzesData === "object") {
      if (
        Array.isArray(quizzesData.quizzes) &&
        quizzesData.quizzes.length > 0
      ) {
        QUIZZES = quizzesData.quizzes;
      } else if (Array.isArray(quizzesData) && quizzesData.length > 0) {
        QUIZZES = quizzesData;
      }
    }
  }
} catch (error) {
  console.error("Error loading quizzes:", error.message);
}

// ROUTES - Simplified to avoid path-to-regexp issues

// Get all quizzes
app.get("/api/quizzes", (req, res) => {
  res.json(QUIZZES);
});

// Get quiz by ID
app.get("/api/quizzes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const quiz = QUIZZES.find((q) => q.id === id);

  if (quiz) {
    return res.json(quiz);
  }

  res.status(404).json({ message: "Quiz not found" });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
app.listen(port, () => {
  console.log(`Debug server running on port ${port}`);
  console.log(`CORS enabled for all origins`);
});
