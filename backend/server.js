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

const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const QUIZZES_FILE = path.join(dataDir, "quizzes.json");
const GAME_RESULTS_FILE = path.join(dataDir, "gameResults.json");
const ANALYTICS_FILE = path.join(dataDir, "analytics.json");

// Crear unos quizzes estáticos que siempre están disponibles
// para evitar problemas con la lectura de archivos
const STATIC_QUIZZES = [
  {
    id: 1,
    title: "Programación Básica",
    questions: [
      {
        question: "¿Qué significa HTML?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Technical Machine Learning", "Home Tool Markup Language"],
        correctAnswer: 0
      },
      {
        question: "¿Cuál de estos NO es un lenguaje de programación?",
        options: ["JavaScript", "Python", "HTML", "Java"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 2,
    title: "JavaScript Avanzado",
    questions: [
      {
        question: "¿Qué es una Promise en JavaScript?",
        options: ["Un tipo de variable", "Un objeto que representa un valor futuro", "Una función incorporada", "Un tipo de bucle"],
        correctAnswer: 1
      },
      {
        question: "¿Qué método convierte un objeto JSON a cadena?",
        options: ["JSON.parse()", "JSON.stringify()", "JSON.toString()", "JSON.convert()"],
        correctAnswer: 1
      }
    ]
  }
];

// Inicialización de datos
let QUIZZES = [...STATIC_QUIZZES]; // Comenzar con quizzes estáticos por defecto

// Intentar cargar quizzes del archivo, pero mantener los estáticos como fallback
try {
  if (fs.existsSync(QUIZZES_FILE)) {
    const fileContent = fs.readFileSync(QUIZZES_FILE, 'utf8');
    try {
      const quizzesData = JSON.parse(fileContent);
      
      if (quizzesData && typeof quizzesData === 'object') {
        if (Array.isArray(quizzesData.quizzes) && quizzesData.quizzes.length > 0) {
          QUIZZES = quizzesData.quizzes;
          console.log(`Loaded ${QUIZZES.length} quizzes from file`);
        } else if (Array.isArray(quizzesData) && quizzesData.length > 0) {
          QUIZZES = quizzesData;
          console.log(`Loaded ${QUIZZES.length} quizzes from array`);
        } else {
          console.log("No valid quizzes in file, using default quizzes");
        }
      }
    } catch (parseError) {
      console.error("Error parsing quizzes.json:", parseError.message);
      console.log("Using default quizzes instead");
    }
  } else {
    console.log("quizzes.json not found, using default quizzes");
    // Guardar los quizzes por defecto en el archivo
    fs.writeFileSync(QUIZZES_FILE, JSON.stringify({ quizzes: QUIZZES }, null, 2));
  }
} catch (fileError) {
  console.error("File system error:", fileError.message);
  console.log("Using default quizzes");
}

// Asegurar que siempre hay quizzes disponibles
if (!Array.isArray(QUIZZES) || QUIZZES.length === 0) {
  QUIZZES = [...STATIC_QUIZZES];
  console.log("Restored default quizzes");
}

console.log(`Server ready with ${QUIZZES.length} quizzes`);

let GAME_RESULTS = [];
try {
  if (fs.existsSync(GAME_RESULTS_FILE)) {
    GAME_RESULTS = JSON.parse(fs.readFileSync(GAME_RESULTS_FILE)) || [];
    console.log(`Server loaded ${GAME_RESULTS.length} game results`);
  } else {
    console.log("No game results file found, initializing with empty array");
    fs.writeFileSync(GAME_RESULTS_FILE, JSON.stringify([], null, 2));
  }
} catch (error) {
  console.error("Error loading gameResults.json:", error);
  GAME_RESULTS = [];
}

let analyticsCache = null;
let analyticsCacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

app.use((req, res, next) => {
  res.set("Cache-Control", "public, max-age=300"); // 5 minutes cache
  next();
});

// Endpoint simplificado para obtener todos los quizzes
app.get("/api/quizzes", (req, res) => {
  try {
    // Responder con los quizzes en memoria, evitar operaciones de archivo
    res.json(QUIZZES);
  } catch (error) {
    console.error("Error in /api/quizzes endpoint:", error);
    // Responder con quizzes estáticos en caso de error
    res.json(STATIC_QUIZZES);
  }
});

app.get("/api/quizzes/:id", (req, res) => {
  try {
    const idParam = req.params.id;
    const numericId = parseInt(idParam);
    
    // Implementación optimizada para búsqueda más rápida
    let quiz = null;
    
    // Método 1: Búsqueda directa por ID numérico
    if (!isNaN(numericId)) {
      quiz = QUIZZES.find(q => q.id === numericId);
    }
    
    // Método 2: Búsqueda directa por ID exacto como string
    if (!quiz && typeof idParam === 'string') {
      quiz = QUIZZES.find(q => String(q.id) === idParam);
    }
    
    // Método 3: Búsqueda por formato "quizX"
    if (!quiz && typeof idParam === 'string' && idParam.startsWith('quiz')) {
      const extractedId = parseInt(idParam.replace('quiz', ''));
      if (!isNaN(extractedId)) {
        quiz = QUIZZES.find(q => q.id === extractedId);
      }
    }
    
    // Si se encontró el quiz, devolverlo
    if (quiz) {
      // Habilitar cache para mejorar rendimiento
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.json(quiz);
    }
    
    // Si no se encontró el quiz, devolver los datos de quizzes estáticos
    // como alternativa para evitar errores en la UI
    const staticQuiz = STATIC_QUIZZES.find(q => q.id === 1);
    if (staticQuiz) {
      console.log(`Quiz ${idParam} not found, returning static quiz instead`);
      return res.json(staticQuiz);
    }
    
    // Si todo lo anterior falla, responder con error 404
    console.log(`Quiz not found: ${idParam} and no static quiz available`);
    return res.status(404).json({
      message: "Quiz not found",
      requestedId: idParam
    });
  } catch (error) {
    console.error(`Error retrieving quiz ${req.params.id}:`, error);
    
    // En caso de error, devolver el primer quiz estático como respuesta de emergencia
    const fallbackQuiz = STATIC_QUIZZES[0];
    if (fallbackQuiz) {
      console.log("Returning fallback quiz due to error");
      return res.json(fallbackQuiz);
    }
    
    return res.status(500).json({
      message: "Error retrieving quiz",
      error: error.message
    });
  }
});

app.post(
  "/api/quizzes",
  [validateQuizStructure, ...quizCreateValidationSchema, validateQuiz],
  (req, res) => {
    const newQuiz = {
      id: QUIZZES.length > 0 ? Math.max(...QUIZZES.map((q) => q.id)) + 1 : 1,
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
  const results = GAME_RESULTS.filter((result) => result.quizId === quizId);

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
  GAME_RESULTS.forEach((game) => {
    if (game.questionResults && Array.isArray(game.questionResults)) {
      game.questionResults.forEach((qResult) => {
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

  const questionsData = Object.values(questionPerformance).map((q) => {
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

  const gamesHistory = GAME_RESULTS.sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
    .map((game) => {
      const quiz = QUIZZES.find((q) => q.id === game.quizId);
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
