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
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://mysuperquiz.netlify.app', 'https://pablomachado.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const QUIZZES_FILE = path.join(dataDir, "quizzes.json");
const GAME_RESULTS_FILE = path.join(dataDir, "gameResults.json");
const ANALYTICS_FILE = path.join(dataDir, "analytics.json");

const STATIC_QUIZZES = [
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

let QUIZZES = [...STATIC_QUIZZES];

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
    fs.writeFileSync(
      QUIZZES_FILE,
      JSON.stringify({ quizzes: QUIZZES }, null, 2)
    );
  }
} catch (fileError) {
  console.error("File system error:", fileError.message);
}

if (!Array.isArray(QUIZZES) || QUIZZES.length === 0) {
  QUIZZES = [...STATIC_QUIZZES];
}

let GAME_RESULTS = [];
try {
  if (fs.existsSync(GAME_RESULTS_FILE)) {
    GAME_RESULTS = JSON.parse(fs.readFileSync(GAME_RESULTS_FILE)) || [];
  } else {
    fs.writeFileSync(GAME_RESULTS_FILE, JSON.stringify([], null, 2));
  }
} catch (error) {
  console.error("Error loading gameResults.json:", error);
  GAME_RESULTS = [];
}

let analyticsCache = null;
let analyticsCacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000;

app.use((req, res, next) => {
  res.set("Cache-Control", "public, max-age=300");
  next();
});

app.get("/api/quizzes", (req, res) => {
  try {
    res.json(QUIZZES);
  } catch (error) {
    console.error("Error in /api/quizzes endpoint:", error);
    res.json(STATIC_QUIZZES);
  }
});

app.get("/api/quizzes/:id", (req, res) => {
  try {
    const idParam = req.params.id;
    const numericId = parseInt(idParam);

    let quiz = null;

    if (!isNaN(numericId)) {
      quiz = QUIZZES.find(q => q.id === numericId);
    }

    if (!quiz && typeof idParam === "string") {
      quiz = QUIZZES.find(q => String(q.id) === idParam);
    }

    if (!quiz && typeof idParam === "string" && idParam.startsWith("quiz")) {
      const extractedId = parseInt(idParam.replace("quiz", ""));
      if (!isNaN(extractedId)) {
        quiz = QUIZZES.find(q => q.id === extractedId);
      }
    }

    if (quiz) {
      res.setHeader("Cache-Control", "public, max-age=3600");
      return res.json(quiz);
    }

    const staticQuiz = STATIC_QUIZZES.find(q => q.id === 1);
    if (staticQuiz) {
      return res.json(staticQuiz);
    }

    return res.status(404).json({
      message: "Quiz not found",
      requestedId: idParam,
    });
  } catch (error) {
    console.error(`Error retrieving quiz ${req.params.id}:`, error);

    const fallbackQuiz = STATIC_QUIZZES[0];
    if (fallbackQuiz) {
      return res.json(fallbackQuiz);
    }

    return res.status(500).json({
      message: "Error retrieving quiz",
      error: error.message,
    });
  }
});

app.post(
  "/api/quizzes",
  [validateQuizStructure, ...quizCreateValidationSchema, validateQuiz],
  (req, res) => {
    const newQuiz = {
      id: QUIZZES.length > 0 ? Math.max(...QUIZZES.map(q => q.id)) + 1 : 1,
      ...req.body,
    };
    QUIZZES.push(newQuiz);

    try {
      const quizzesData = { quizzes: QUIZZES };
      fs.writeFileSync(QUIZZES_FILE, JSON.stringify(quizzesData, null, 2));

      analyticsCache = null;

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

app.delete("/api/quizzes/:id", (req, res) => {
  try {
    const idParam = req.params.id;
    const numericId = parseInt(idParam);

    if (isNaN(numericId)) {
      return res.status(400).json({
        message: "Invalid quiz ID format",
        requestedId: idParam,
      });
    }

    const quizIndex = QUIZZES.findIndex(q => q.id === numericId);

    if (quizIndex === -1) {
      return res.status(404).json({
        message: "Quiz not found",
        requestedId: idParam,
      });
    }

    const deletedQuiz = QUIZZES.splice(quizIndex, 1)[0];

    const quizzesData = { quizzes: QUIZZES };
    fs.writeFileSync(QUIZZES_FILE, JSON.stringify(quizzesData, null, 2));

    analyticsCache = null;

    res.json({
      message: "Quiz deleted successfully",
      deletedQuiz,
    });
  } catch (error) {
    console.error(`Error deleting quiz ${req.params.id}:`, error);
    res.status(500).json({
      message: "Error deleting quiz",
      error: error.message,
    });
  }
});

app.post("/api/game-results", (req, res) => {
  try {
    const gameResult = {
      id: `game-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: new Date().toISOString().split("T")[0],
      timestamp: Date.now(),
      ...req.body,
    };

    if (
      !gameResult.quizId ||
      !gameResult.score ||
      gameResult.totalQuestions === undefined
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["quizId", "score", "totalQuestions", "correctAnswers"],
      });
    }

    GAME_RESULTS.push(gameResult);

    fs.writeFileSync(GAME_RESULTS_FILE, JSON.stringify(GAME_RESULTS, null, 2));

    analyticsCache = null;

    res.status(201).json({
      message: "Game result saved successfully",
      gameResult,
    });
  } catch (error) {
    console.error("Error saving game result:", error);
    res.status(500).json({
      message: "Failed to save game result",
      error: error.message,
    });
  }
});

app.get("/api/analytics", (req, res) => {
  try {
    if (
      analyticsCache &&
      Date.now() - analyticsCacheTimestamp < CACHE_DURATION
    ) {
      return res.json(analyticsCache);
    }

    const analytics = generateAnalytics();

    analyticsCache = analytics;
    analyticsCacheTimestamp = Date.now();

    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));

    res.json(analytics);
  } catch (error) {
    console.error("Error generating analytics:", error);
    res.status(500).json({
      message: "Failed to generate analytics",
      error: error.message,
    });
  }
});

app.get("/api/game-results/quiz/:quizId", (req, res) => {
  const quizId = parseInt(req.params.quizId);
  const results = GAME_RESULTS.filter(result => result.quizId === quizId);

  res.json(results);
});

function generateAnalytics() {
  if (GAME_RESULTS.length === 0) {
    return {
      totalGames: 0,
      averageScore: 0,
      questionsData: [],
      gamesHistory: [],
    };
  }

  const totalGames = GAME_RESULTS.length;

  const totalScorePercentage = GAME_RESULTS.reduce((sum, game) => {
    return sum + (game.correctAnswers / game.totalQuestions) * 100;
  }, 0);
  const averageScore = parseFloat(
    (totalScorePercentage / totalGames).toFixed(1)
  );

  const questionPerformance = {};
  GAME_RESULTS.forEach(game => {
    if (game.questionResults && Array.isArray(game.questionResults)) {
      game.questionResults.forEach(qResult => {
        if (!questionPerformance[qResult.questionId]) {
          questionPerformance[qResult.questionId] = {
            id: qResult.questionId,
            title: qResult.questionText || `Question ${qResult.questionId}`,
            totalAttempts: 0,
            correctAttempts: 0,
            totalResponseTime: 0,
            responseCount: 0,
          };
        }

        questionPerformance[qResult.questionId].totalAttempts++;
        if (qResult.isCorrect) {
          questionPerformance[qResult.questionId].correctAttempts++;
        }

        if (qResult.responseTime) {
          questionPerformance[qResult.questionId].totalResponseTime +=
            qResult.responseTime;
          questionPerformance[qResult.questionId].responseCount++;
        }
      });
    }
  });

  const questionsData = Object.values(questionPerformance).map(q => {
    const correctPercentage =
      q.totalAttempts > 0
        ? Math.round((q.correctAttempts / q.totalAttempts) * 100)
        : 0;

    const avgResponseTime =
      q.responseCount > 0
        ? parseFloat((q.totalResponseTime / q.responseCount).toFixed(1))
        : 0;

    return {
      id: q.id,
      title: q.title,
      correctPercentage,
      avgResponseTime,
    };
  });

  const sortedGameResults = [...GAME_RESULTS].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  const gamesHistory = sortedGameResults.slice(0, 10).map(game => {
    const quiz = QUIZZES.find(q => q.id === game.quizId);
    return {
      id: game.id,
      date: game.date,
      title: quiz ? quiz.title : `Quiz ${game.quizId}`,
      score: game.score,
      totalQuestions: game.totalQuestions,
      correctAnswers: game.correctAnswers,
    };
  });

  return {
    totalGames,
    averageScore,
    questionsData,
    gamesHistory,
  };
}

app.get("/api/stats/user/:userId", (req, res) => {
  try {
    if (
      analyticsCache &&
      Date.now() - analyticsCacheTimestamp < CACHE_DURATION
    ) {
      return res.json(analyticsCache);
    }

    const analytics = generateAnalytics();
    analyticsCache = analytics;
    analyticsCacheTimestamp = Date.now();

    res.json(analytics);
  } catch (error) {
    console.error("Error generating user stats:", error);
    res.status(500).json({
      message: "Failed to generate user stats",
      error: error.message,
    });
  }
});

app.post("/api/stats/user/:userId/reset", (req, res) => {
  try {
    GAME_RESULTS = [];
    fs.writeFileSync(GAME_RESULTS_FILE, JSON.stringify([], null, 2));

    analyticsCache = null;

    res.json({
      message: "User statistics reset successfully",
      stats: generateAnalytics(),
    });
  } catch (error) {
    console.error("Error resetting stats:", error);
    res.status(500).json({
      message: "Failed to reset stats",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Kahoot Clone server running on port ${port}`);
});
