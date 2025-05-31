// Simplified server.js to fix path-to-regexp error
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Simplified CORS setup
app.use(
  cors({
    origin: "*", // Allow all origins for development
    credentials: true,
  })
);
app.use(express.json());

// Data paths
const dataDir = path.join(__dirname, "data");
const QUIZZES_FILE = path.join(dataDir, "quizzes.json");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Default quizzes
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
    try {
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
    } catch (parseError) {
      console.error("Error parsing quizzes.json:", parseError.message);
    }
  } else {
    // Create a default quizzes.json if it doesn't exist
    fs.writeFileSync(
      QUIZZES_FILE,
      JSON.stringify({ quizzes: QUIZZES }, null, 2)
    );
  }
} catch (fileError) {
  console.error("File system error:", fileError.message);
}

// ESSENTIAL ROUTES ONLY
// Get all quizzes
app.get("/api/quizzes", (req, res) => {
  console.log("GET /api/quizzes requested");
  try {
    res.json(QUIZZES);
  } catch (error) {
    console.error("Error serving quizzes:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get quiz by ID - simple numeric ID only
app.get("/api/quizzes/:id", (req, res) => {
  console.log(`GET /api/quizzes/${req.params.id} requested`);
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid quiz ID" });
    }

    const quiz = QUIZZES.find(q => q.id === id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error(`Error retrieving quiz ${req.params.id}:`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start the server
app.listen(port, () => {
  console.log(`Simplified server running on port ${port}`);
});
