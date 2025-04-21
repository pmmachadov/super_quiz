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

const userStats = new Map();

app.use((req, res, next) => {
  res.set("Cache-Control", "public, max-age=300"); // 5 minutos
  next();
});

app.get("/api/quizzes", (req, res) => {
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
      console.error("Error saving quiz to file:", error);
      QUIZZES.pop();
      res.status(500).json({
        message: "Failed to save quiz",
        error: error.message,
      });
    }
  }
);

app.get("/api/stats/user/:userId", (req, res) => {
  const userId = req.params.userId;

  if (!userStats.has(userId)) {
    const mockStats = generateMockStats(QUIZZES);
    userStats.set(userId, mockStats);
  }

  res.json(userStats.get(userId));
});

app.post("/api/stats/user/:userId/reset", (req, res) => {
  const userId = req.params.userId;

  const freshStats = generateMockStats(QUIZZES);
  userStats.set(userId, freshStats);

  res.json({
    message: "User statistics reset successfully",
    stats: freshStats,
  });
});

function generateMockStats(quizzes) {
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
