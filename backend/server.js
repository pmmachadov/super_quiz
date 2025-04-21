const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const {
  quizCreateValidationSchema,
  validateQuiz,
  validateQuizStructure,
} = require("./validators/quizValidators");

const app = express();
const port = 5173;

app.use(cors());
app.use(bodyParser.json());

// Cargar los quizzes una sola vez al iniciar el servidor
// en lugar de cargarlos en cada petición
let QUIZZES = [];
try {
  const quizzesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data", "quizzes.json"))
  );
  QUIZZES = quizzesData.quizzes;
  console.log(
    `Servidor cargó ${QUIZZES.length} quizzes exitosamente al iniciar`
  );
} catch (error) {
  console.error("Error al cargar quizzes.json:", error);
  QUIZZES = [];
}

// Almacenamiento en memoria para estadísticas de usuario (en una app real estaría en una base de datos)
const userStats = new Map();

// Cache-Control para mejorar el rendimiento del cliente
app.use((req, res, next) => {
  // Agregar encabezados para mejorar el rendimiento
  res.set("Cache-Control", "public, max-age=300"); // 5 minutos
  next();
});

// Optimización: responder directamente con los quizzes precargados
app.get("/api/quizzes", (req, res) => {
  // Añadir encabezados para optimizar la entrega
  res.setHeader("Content-Type", "application/json");
  res.json(QUIZZES);
});

app.get("/api/quizzes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const quiz = QUIZZES.find((q) => q.id === id);

  if (quiz) {
    res.json(quiz);
  } else {
    res.status(404).json({ message: "Quiz not found" });
  }
});

app.post(
  "/api/quizzes",
  [validateQuizStructure, ...quizCreateValidationSchema, validateQuiz],
  (req, res) => {
    const newQuiz = {
      id: QUIZZES.length + 1,
      ...req.body,
    };
    QUIZZES.push(newQuiz);

    try {
      const quizzesData = { quizzes: QUIZZES };
      fs.writeFileSync(
        path.join(__dirname, "data", "quizzes.json"),
        JSON.stringify(quizzesData, null, 2)
      );
      res.status(201).json(newQuiz);
    } catch (error) {
      // Proper error handling - log the error and send appropriate response
      console.error("Error saving quiz to file:", error);
      QUIZZES.pop(); // Remove the quiz that failed to save
      res.status(500).json({
        message: "Failed to save quiz",
        error: error.message,
      });
    }
  }
);

// New endpoint: Get user statistics
app.get("/api/stats/user/:userId", (req, res) => {
  const userId = req.params.userId;

  // If we don't have stats for this user yet, generate some mock data
  if (!userStats.has(userId)) {
    const mockStats = generateMockStats(QUIZZES);
    userStats.set(userId, mockStats);
  }

  res.json(userStats.get(userId));
});

// New endpoint: Reset user statistics
app.post("/api/stats/user/:userId/reset", (req, res) => {
  const userId = req.params.userId;

  // Create fresh statistics (or in a real app, delete from database)
  const freshStats = generateMockStats(QUIZZES);
  userStats.set(userId, freshStats);

  res.json({
    message: "User statistics reset successfully",
    stats: freshStats,
  });
});

// Helper function to generate mock stats
function generateMockStats(quizzes) {
  // Create mock question performance data
  const questionsData = quizzes
    .flatMap((quiz) =>
      quiz.questions.map((q, index) => ({
        id: `${quiz.id}-${index}`,
        title: q.question,
        correctPercentage: Math.floor(Math.random() * 30) + 65,
        avgResponseTime: (Math.random() * 3 + 2).toFixed(1),
      }))
    )
    .slice(0, 10);

  // Create mock game history
  const gamesHistory = quizzes
    .map((quiz, index) => {
      const correctAnswers =
        Math.floor(Math.random() * 3) + (quiz.questions.length - 3);
      return {
        id: `game-${index}`,
        date: new Date(Date.now() - index * 86400000)
          .toISOString()
          .split("T")[0],
        title: quiz.title,
        score: correctAnswers * 100 + Math.floor(Math.random() * 100),
        totalQuestions: quiz.questions.length,
        correctAnswers: correctAnswers,
      };
    })
    .slice(0, 8);

  return {
    totalGames: quizzes.length,
    averageScore: 82.5,
    questionsData,
    gamesHistory,
  };
}

app.listen(port, () => {
  console.log(`Kahoot Clone server running on port ${port}`);
});
