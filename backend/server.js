const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  quizCreateValidationSchema,
  validateQuiz,
  validateQuizStructure,
} = require("./validators/quizValidators");

const app = express();
const port = 3000;
const JWT_SECRET = "super-quiz-secret-key"; // En producción, usar variable de entorno

app.use(cors());
app.use(bodyParser.json());

const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const QUIZZES_FILE = path.join(dataDir, "quizzes.json");
const GAME_RESULTS_FILE = path.join(dataDir, "gameResults.json");
const ANALYTICS_FILE = path.join(dataDir, "analytics.json");
const USERS_FILE = path.join(dataDir, "users.json");
const CLASSES_FILE = path.join(dataDir, "classes.json");
const GAME_SESSIONS_FILE = path.join(dataDir, "gameSessions.json");

// Initialize an empty QUIZZES array - we'll load from the database file
let QUIZZES = [];

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
    // Create an initial quizzes file with empty array if it doesn't exist
    fs.writeFileSync(QUIZZES_FILE, JSON.stringify({ quizzes: [] }, null, 2));
  }
} catch (fileError) {
  console.error("File system error:", fileError.message);
}

// Make sure QUIZZES is an array even if file loading failed
if (!Array.isArray(QUIZZES)) {
  QUIZZES = [];
  console.log("Initialized empty QUIZZES array due to loading issues");
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

// Load or initialize user data
let USERS = [];
try {
  if (fs.existsSync(USERS_FILE)) {
    USERS = JSON.parse(fs.readFileSync(USERS_FILE)) || [];
  } else {
    // Create example users
    const defaultUsers = [
      {
        id: "teacher1",
        name: "Demo Teacher",
        email: "teacher@example.com",
        password: bcrypt.hashSync("123456", 10),
        role: "teacher",
        createdAt: new Date().toISOString(),
      },
      {
        id: "student1",
        name: "Demo Student",
        email: "student@example.com",
        password: bcrypt.hashSync("123456", 10),
        role: "student",
        createdAt: new Date().toISOString(),
      },
    ];
    USERS = defaultUsers;
    fs.writeFileSync(USERS_FILE, JSON.stringify(USERS, null, 2));
  }
} catch (error) {
  console.error("Error loading users:", error);
  USERS = [];
}

// Load or initialize class data
let CLASSES = [];
try {
  if (fs.existsSync(CLASSES_FILE)) {
    CLASSES = JSON.parse(fs.readFileSync(CLASSES_FILE)) || [];
  } else {
    // Create example class
    const defaultClasses = [
      {
        id: "class1",
        name: "Demo Class",
        teacherId: "teacher1",
        students: ["student1"],
        quizzes: [1, 2],
        createdAt: new Date().toISOString(),
      },
    ];
    CLASSES = defaultClasses;
    fs.writeFileSync(CLASSES_FILE, JSON.stringify(CLASSES, null, 2));
  }
} catch (error) {
  console.error("Error loading classes:", error);
  CLASSES = [];
}

// Initialize game sessions
let GAME_SESSIONS = [];
try {
  if (fs.existsSync(GAME_SESSIONS_FILE)) {
    GAME_SESSIONS = JSON.parse(fs.readFileSync(GAME_SESSIONS_FILE)) || [];
  } else {
    fs.writeFileSync(GAME_SESSIONS_FILE, JSON.stringify([], null, 2));
  }
} catch (error) {
  console.error("Error loading game sessions:", error);
  GAME_SESSIONS = [];
}

// Clean up expired game sessions
function cleanupExpiredSessions() {
  const now = Date.now();
  const activeSessions = GAME_SESSIONS.filter(
    session => session.expiresAt > now
  );

  if (activeSessions.length !== GAME_SESSIONS.length) {
    GAME_SESSIONS = activeSessions;
    fs.writeFileSync(
      GAME_SESSIONS_FILE,
      JSON.stringify(GAME_SESSIONS, null, 2)
    );
  }
}

// Run cleanup every minute
setInterval(cleanupExpiredSessions, 60 * 1000);

// Function middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to verify teacher role
const verifyTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res
      .status(403)
      .json({ message: "Access denied. Teacher role required." });
  }
  next();
};

app.use((req, res, next) => {
  res.set("Cache-Control", "public, max-age=300");
  next();
});

app.get("/api/quizzes", (req, res) => {
  try {
    res.json(QUIZZES);
  } catch (error) {
    console.error("Error in /api/quizzes endpoint:", error);
    res.json([]);
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

    return res.status(404).json({
      message: "Quiz not found",
      requestedId: idParam,
    });
  } catch (error) {
    console.error(`Error retrieving quiz ${req.params.id}:`, error);

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

// ========== NUEVAS RUTAS DE AUTENTICACIÓN Y GESTIÓN DE USUARIOS ==========

// Registrar nuevo usuario
app.post("/api/auth/register", (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validar datos de entrada
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["name", "email", "password", "role"],
      });
    }

    // Verificar que el email no exista ya
    if (USERS.some(user => user.email === email)) {
      return res
        .status(409)
        .json({ message: "This email is already registered" });
    }

    // Crear nuevo usuario
    const userId = `user-${Date.now()}`;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
    };

    USERS.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(USERS, null, 2));

    // Generar token
    const token = jwt.sign({ id: userId, name, email, role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
});

// Login de usuario
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar datos de entrada
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Buscar usuario por email
    const user = USERS.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verificar contraseña
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
});

// Verificar token
app.get("/api/auth/me", verifyToken, (req, res) => {
  try {
    const user = USERS.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({
      message: "Error verifying user",
      error: error.message,
    });
  }
});

// ========== RUTAS PARA GESTIÓN DE CLASES ==========

// Obtener todas las clases de un profesor
app.get("/api/classes", verifyToken, (req, res) => {
  try {
    let classes;

    if (req.user.role === "teacher") {
      // Si es profesor, retornar sus clases
      classes = CLASSES.filter(c => c.teacherId === req.user.id);
    } else {
      // Si es estudiante, retornar clases donde está inscrito
      classes = CLASSES.filter(c => c.students.includes(req.user.id));
    }

    res.json(classes);
  } catch (error) {
    console.error("Error getting classes:", error);
    res.status(500).json({
      message: "Error getting classes",
      error: error.message,
    });
  }
});

// Crear una nueva clase (solo profesores)
app.post("/api/classes", verifyToken, verifyTeacher, (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Class name is required" });
    }

    const newClass = {
      id: `class-${Date.now()}`,
      name,
      teacherId: req.user.id,
      students: [],
      quizzes: [],
      createdAt: new Date().toISOString(),
    };

    CLASSES.push(newClass);
    fs.writeFileSync(CLASSES_FILE, JSON.stringify(CLASSES, null, 2));

    res.status(201).json({
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({
      message: "Error creating class",
      error: error.message,
    });
  }
});

// Añadir estudiante a una clase (solo profesores)
app.post(
  "/api/classes/:classId/students",
  verifyToken,
  verifyTeacher,
  (req, res) => {
    try {
      const { classId } = req.params;
      const { studentEmail } = req.body;

      if (!studentEmail) {
        return res.status(400).json({ message: "Student email is required" });
      }

      // Buscar la clase
      const classIndex = CLASSES.findIndex(c => c.id === classId);
      if (classIndex === -1) {
        return res.status(404).json({ message: "Class not found" });
      }

      // Verificar que el profesor sea el dueño de la clase
      if (CLASSES[classIndex].teacherId !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You do not have permission to modify this class" });
      }

      // Buscar el estudiante por email
      const student = USERS.find(
        u => u.email === studentEmail && u.role === "student"
      );
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Verificar que el estudiante no esté ya en la clase
      if (CLASSES[classIndex].students.includes(student.id)) {
        return res
          .status(409)
          .json({ message: "Student is already in this class" });
      }

      // Añadir estudiante a la clase
      CLASSES[classIndex].students.push(student.id);
      fs.writeFileSync(CLASSES_FILE, JSON.stringify(CLASSES, null, 2));

      res.json({
        message: "Student added to class successfully",
        class: CLASSES[classIndex],
      });
    } catch (error) {
      console.error("Error adding student:", error);
      res.status(500).json({
        message: "Error adding student",
        error: error.message,
      });
    }
  }
);

// Añadir quiz a una clase (solo profesores)
app.post(
  "/api/classes/:classId/quizzes",
  verifyToken,
  verifyTeacher,
  (req, res) => {
    try {
      const { classId } = req.params;
      const { quizId } = req.body;

      if (!quizId) {
        return res.status(400).json({ message: "Quiz ID is required" });
      }

      // Buscar la clase
      const classIndex = CLASSES.findIndex(c => c.id === classId);
      if (classIndex === -1) {
        return res.status(404).json({ message: "Class not found" });
      }

      // Verificar que el profesor sea el dueño de la clase
      if (CLASSES[classIndex].teacherId !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You do not have permission to modify this class" });
      }

      // Verificar que el quiz exista
      const quiz = QUIZZES.find(q => q.id === parseInt(quizId));
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      // Verificar que el quiz no esté ya en la clase
      if (CLASSES[classIndex].quizzes.includes(parseInt(quizId))) {
        return res
          .status(409)
          .json({ message: "Quiz is already assigned to this class" });
      }

      // Añadir quiz a la clase
      CLASSES[classIndex].quizzes.push(parseInt(quizId));
      fs.writeFileSync(CLASSES_FILE, JSON.stringify(CLASSES, null, 2));

      res.json({
        message: "Quiz added to class successfully",
        class: CLASSES[classIndex],
      });
    } catch (error) {
      console.error("Error adding quiz:", error);
      res.status(500).json({
        message: "Error adding quiz",
        error: error.message,
      });
    }
  }
);

// Obtener estudiantes de una clase
app.get("/api/classes/:classId/students", verifyToken, (req, res) => {
  try {
    const { classId } = req.params;

    // Buscar la clase
    const classObj = CLASSES.find(c => c.id === classId);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Verificar que el usuario es el profesor de la clase o un alumno de la clase
    if (req.user.role === "teacher" && classObj.teacherId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You do not have permission to view this class" });
    } else if (
      req.user.role === "student" &&
      !classObj.students.includes(req.user.id)
    ) {
      return res
        .status(403)
        .json({ message: "You do not belong to this class" });
    }

    // Obtener detalles de los estudiantes
    const studentsDetails = classObj.students
      .map(studentId => {
        const student = USERS.find(u => u.id === studentId);
        if (student) {
          const { password, ...studentWithoutPassword } = student;
          return studentWithoutPassword;
        }
        return null;
      })
      .filter(student => student !== null);

    res.json(studentsDetails);
  } catch (error) {
    console.error("Error getting students:", error);
    res.status(500).json({
      message: "Error getting students",
      error: error.message,
    });
  }
});

// Obtener quizzes de una clase
app.get("/api/classes/:classId/quizzes", verifyToken, (req, res) => {
  try {
    const { classId } = req.params;

    // Buscar la clase
    const classObj = CLASSES.find(c => c.id === classId);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Verificar permisos
    if (req.user.role === "teacher" && classObj.teacherId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You do not have permission to view this class" });
    } else if (
      req.user.role === "student" &&
      !classObj.students.includes(req.user.id)
    ) {
      return res
        .status(403)
        .json({ message: "You do not belong to this class" });
    }

    // Obtener detalles de los quizzes
    const quizzes = classObj.quizzes
      .map(quizId => {
        return QUIZZES.find(q => q.id === quizId);
      })
      .filter(quiz => quiz !== undefined);

    res.json(quizzes);
  } catch (error) {
    console.error("Error getting quizzes:", error);
    res.status(500).json({
      message: "Error getting quizzes",
      error: error.message,
    });
  }
});

// ========== TEACHER CRUD OPERATIONS ==========

// Get all teachers
app.get("/api/teachers", verifyToken, (req, res) => {
  try {
    const teachers = USERS.filter(user => user.role === "teacher").map(
      teacher => {
        const { password, ...teacherWithoutPassword } = teacher;
        return teacherWithoutPassword;
      }
    );

    res.json(teachers);
  } catch (error) {
    console.error("Error getting teachers:", error);
    res.status(500).json({
      message: "Error getting teachers",
      error: error.message,
    });
  }
});

// Get teacher by ID
app.get("/api/teachers/:id", verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const teacher = USERS.find(
      user => user.id === id && user.role === "teacher"
    );

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const { password, ...teacherWithoutPassword } = teacher;
    res.json(teacherWithoutPassword);
  } catch (error) {
    console.error("Error getting teacher:", error);
    res.status(500).json({
      message: "Error getting teacher",
      error: error.message,
    });
  }
});

// Create a new teacher
app.post("/api/teachers", verifyToken, (req, res) => {
  try {
    // Only admin or teachers can create teachers
    if (req.user.role !== "admin" && req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin or teacher role required." });
    }

    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["name", "email", "password"],
      });
    }

    // Check if email already exists
    if (USERS.some(user => user.email === email)) {
      return res
        .status(409)
        .json({ message: "This email is already registered" });
    }

    // Create new teacher
    const teacherId = `teacher-${Date.now()}`;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newTeacher = {
      id: teacherId,
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      createdAt: new Date().toISOString(),
    };

    USERS.push(newTeacher);
    fs.writeFileSync(USERS_FILE, JSON.stringify(USERS, null, 2));

    // Don't return the password
    const { password: _, ...teacherWithoutPassword } = newTeacher;

    res.status(201).json({
      message: "Teacher created successfully",
      teacher: teacherWithoutPassword,
    });
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(500).json({
      message: "Error creating teacher",
      error: error.message,
    });
  }
});

// Update teacher
app.put("/api/teachers/:id", verifyToken, (req, res) => {
  try {
    const { id } = req.params;

    // Check if updating self or admin/teacher updating others
    if (
      req.user.id !== id &&
      req.user.role !== "admin" &&
      req.user.role !== "teacher"
    ) {
      return res.status(403).json({
        message: "Access denied. You can only update your own profile.",
      });
    }

    const teacherIndex = USERS.findIndex(
      user => user.id === id && user.role === "teacher"
    );

    if (teacherIndex === -1) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const { name, email, password } = req.body;
    const updatedTeacher = { ...USERS[teacherIndex] };

    // Update fields if provided
    if (name) updatedTeacher.name = name;
    if (email && email !== updatedTeacher.email) {
      // Check if new email already exists
      if (USERS.some(user => user.email === email && user.id !== id)) {
        return res
          .status(409)
          .json({ message: "This email is already registered" });
      }
      updatedTeacher.email = email;
    }
    if (password) {
      updatedTeacher.password = bcrypt.hashSync(password, 10);
    }

    updatedTeacher.updatedAt = new Date().toISOString();

    USERS[teacherIndex] = updatedTeacher;
    fs.writeFileSync(USERS_FILE, JSON.stringify(USERS, null, 2));

    // Don't return the password
    const { password: _, ...teacherWithoutPassword } = updatedTeacher;

    res.json({
      message: "Teacher updated successfully",
      teacher: teacherWithoutPassword,
    });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({
      message: "Error updating teacher",
      error: error.message,
    });
  }
});

// Delete teacher
app.delete("/api/teachers/:id", verifyToken, (req, res) => {
  try {
    // Only admin or teacher can delete teachers
    if (req.user.role !== "admin" && req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin or teacher role required." });
    }

    const { id } = req.params;
    const teacherIndex = USERS.findIndex(
      user => user.id === id && user.role === "teacher"
    );

    if (teacherIndex === -1) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Remove teacher from USERS
    const deletedTeacher = USERS.splice(teacherIndex, 1)[0];

    // Update classes to remove this teacher
    const teacherClasses = CLASSES.filter(c => c.teacherId === id);
    if (teacherClasses.length > 0) {
      // You may want to reassign classes or delete them depending on your requirements
      // For now, we'll just delete classes that belonged to this teacher
      const remainingClasses = CLASSES.filter(c => c.teacherId !== id);
      CLASSES = remainingClasses;
      fs.writeFileSync(CLASSES_FILE, JSON.stringify(CLASSES, null, 2));
    }

    // Save updated users
    fs.writeFileSync(USERS_FILE, JSON.stringify(USERS, null, 2));

    // Don't return the password
    const { password, ...teacherWithoutPassword } = deletedTeacher;

    res.json({
      message: "Teacher deleted successfully",
      teacher: teacherWithoutPassword,
    });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({
      message: "Error deleting teacher",
      error: error.message,
    });
  }
});

// ========== STUDENT CRUD OPERATIONS ==========

// Get all students
app.get("/api/students", verifyToken, (req, res) => {
  try {
    // Only teachers or admins can view all students
    if (req.user.role !== "admin" && req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin or teacher role required." });
    }

    const students = USERS.filter(user => user.role === "student").map(
      student => {
        const { password, ...studentWithoutPassword } = student;
        return studentWithoutPassword;
      }
    );

    res.json(students);
  } catch (error) {
    console.error("Error getting students:", error);
    res.status(500).json({
      message: "Error getting students",
      error: error.message,
    });
  }
});

// Get student by ID
app.get("/api/students/:id", verifyToken, (req, res) => {
  try {
    const { id } = req.params;

    // Students can only view their own profile
    // Teachers and admins can view any student profile
    if (req.user.role === "student" && req.user.id !== id) {
      return res.status(403).json({
        message: "Access denied. You can only view your own profile.",
      });
    }

    const student = USERS.find(
      user => user.id === id && user.role === "student"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { password, ...studentWithoutPassword } = student;
    res.json(studentWithoutPassword);
  } catch (error) {
    console.error("Error getting student:", error);
    res.status(500).json({
      message: "Error getting student",
      error: error.message,
    });
  }
});

// Create a new student
app.post("/api/students", verifyToken, (req, res) => {
  try {
    // Only teachers or admins can create students
    if (req.user.role !== "admin" && req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin or teacher role required." });
    }

    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["name", "email", "password"],
      });
    }

    // Check if email already exists
    if (USERS.some(user => user.email === email)) {
      return res
        .status(409)
        .json({ message: "This email is already registered" });
    }

    // Create new student
    const studentId = `student-${Date.now()}`;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newStudent = {
      id: studentId,
      name,
      email,
      password: hashedPassword,
      role: "student",
      createdAt: new Date().toISOString(),
    };

    USERS.push(newStudent);
    fs.writeFileSync(USERS_FILE, JSON.stringify(USERS, null, 2));

    // Don't return the password
    const { password: _, ...studentWithoutPassword } = newStudent;

    res.status(201).json({
      message: "Student created successfully",
      student: studentWithoutPassword,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({
      message: "Error creating student",
      error: error.message,
    });
  }
});

// Update student
app.put("/api/students/:id", verifyToken, (req, res) => {
  try {
    const { id } = req.params;

    // Students can only update their own profile
    // Teachers and admins can update any student profile
    if (req.user.role === "student" && req.user.id !== id) {
      return res.status(403).json({
        message: "Access denied. You can only update your own profile.",
      });
    }

    const studentIndex = USERS.findIndex(
      user => user.id === id && user.role === "student"
    );

    if (studentIndex === -1) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { name, email, password } = req.body;
    const updatedStudent = { ...USERS[studentIndex] };

    // Update fields if provided
    if (name) updatedStudent.name = name;
    if (email && email !== updatedStudent.email) {
      // Check if new email already exists
      if (USERS.some(user => user.email === email && user.id !== id)) {
        return res
          .status(409)
          .json({ message: "This email is already registered" });
      }
      updatedStudent.email = email;
    }
    if (password) {
      updatedStudent.password = bcrypt.hashSync(password, 10);
    }

    updatedStudent.updatedAt = new Date().toISOString();

    USERS[studentIndex] = updatedStudent;
    fs.writeFileSync(USERS_FILE, JSON.stringify(USERS, null, 2));

    // Don't return the password
    const { password: _, ...studentWithoutPassword } = updatedStudent;

    res.json({
      message: "Student updated successfully",
      student: studentWithoutPassword,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({
      message: "Error updating student",
      error: error.message,
    });
  }
});

// Delete student
app.delete("/api/students/:id", verifyToken, (req, res) => {
  try {
    // Only teachers or admins can delete students
    if (req.user.role !== "admin" && req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin or teacher role required." });
    }

    const { id } = req.params;
    const studentIndex = USERS.findIndex(
      user => user.id === id && user.role === "student"
    );

    if (studentIndex === -1) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Remove student from USERS
    const deletedStudent = USERS.splice(studentIndex, 1)[0];

    // Remove student from all classes
    CLASSES.forEach((classObj, index) => {
      if (classObj.students.includes(id)) {
        CLASSES[index].students = classObj.students.filter(
          studentId => studentId !== id
        );
      }
    });

    // Save updated classes
    fs.writeFileSync(CLASSES_FILE, JSON.stringify(CLASSES, null, 2));

    // Save updated users
    fs.writeFileSync(USERS_FILE, JSON.stringify(USERS, null, 2));

    // Don't return the password
    const { password, ...studentWithoutPassword } = deletedStudent;

    res.json({
      message: "Student deleted successfully",
      student: studentWithoutPassword,
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      message: "Error deleting student",
      error: error.message,
    });
  }
});

// ========== GAME SESSION MANAGEMENT ==========

// Generate a unique 6-digit code
function generateUniqueCode() {
  let code;
  do {
    // Generate a random number between 100000 and 999999
    code = Math.floor(100000 + Math.random() * 900000).toString();
  } while (GAME_SESSIONS.some(session => session.code === code));

  return code;
}

// Create a new game session (teacher only)
app.post("/api/game-sessions", verifyToken, verifyTeacher, (req, res) => {
  try {
    cleanupExpiredSessions();

    const { quizId } = req.body;

    if (!quizId) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }

    // Find the quiz
    const quiz = QUIZZES.find(q => q.id === parseInt(quizId));
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Check if teacher already has an active session for this quiz
    const existingSession = GAME_SESSIONS.find(
      session =>
        session.teacherId === req.user.id &&
        session.quizId === parseInt(quizId) &&
        session.expiresAt > Date.now()
    );

    if (existingSession) {
      return res.json({
        message: "Active session already exists",
        session: existingSession,
      });
    }

    // Create new session
    const code = generateUniqueCode();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now

    const newSession = {
      id: `session-${Date.now()}`,
      code,
      quizId: parseInt(quizId),
      teacherId: req.user.id,
      teacherName: req.user.name,
      quizTitle: quiz.title,
      players: [],
      status: "waiting", // waiting, active, completed
      createdAt: Date.now(),
      expiresAt,
    };

    GAME_SESSIONS.push(newSession);
    fs.writeFileSync(
      GAME_SESSIONS_FILE,
      JSON.stringify(GAME_SESSIONS, null, 2)
    );

    res.status(201).json({
      message: "Game session created successfully",
      session: newSession,
    });
  } catch (error) {
    console.error("Error creating game session:", error);
    res.status(500).json({
      message: "Error creating game session",
      error: error.message,
    });
  }
});

// Get all active sessions for a teacher
app.get(
  "/api/game-sessions/teacher",
  verifyToken,
  verifyTeacher,
  (req, res) => {
    try {
      cleanupExpiredSessions();

      const teacherSessions = GAME_SESSIONS.filter(
        session =>
          session.teacherId === req.user.id && session.expiresAt > Date.now()
      );

      res.json(teacherSessions);
    } catch (error) {
      console.error("Error getting game sessions:", error);
      res.status(500).json({
        message: "Error getting game sessions",
        error: error.message,
      });
    }
  }
);

// Get a specific game session by code
app.get("/api/game-sessions/:code", (req, res) => {
  try {
    const { code } = req.params;

    cleanupExpiredSessions();

    const session = GAME_SESSIONS.find(
      s => s.code === code && s.expiresAt > Date.now()
    );

    if (!session) {
      return res
        .status(404)
        .json({ message: "Game session not found or expired" });
    }

    res.json(session);
  } catch (error) {
    console.error("Error getting game session:", error);
    res.status(500).json({
      message: "Error getting game session",
      error: error.message,
    });
  }
});

// Join a game session as a player
app.post("/api/game-sessions/:code/join", (req, res) => {
  try {
    const { code } = req.params;
    const { playerName } = req.body;

    if (!playerName || playerName.trim() === "") {
      return res.status(400).json({ message: "Player name is required" });
    }

    cleanupExpiredSessions();

    const sessionIndex = GAME_SESSIONS.findIndex(
      s => s.code === code && s.expiresAt > Date.now()
    );

    if (sessionIndex === -1) {
      return res
        .status(404)
        .json({ message: "Game session not found or expired" });
    }

    // Check if player name already exists in this session
    if (GAME_SESSIONS[sessionIndex].players.some(p => p.name === playerName)) {
      return res
        .status(409)
        .json({ message: "Player name already taken in this session" });
    }

    // Add player to session
    const playerId = `player-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const player = {
      id: playerId,
      name: playerName,
      joinedAt: Date.now(),
      score: 0,
    };

    GAME_SESSIONS[sessionIndex].players.push(player);
    fs.writeFileSync(
      GAME_SESSIONS_FILE,
      JSON.stringify(GAME_SESSIONS, null, 2)
    );

    res.status(200).json({
      message: "Joined game session successfully",
      session: GAME_SESSIONS[sessionIndex],
      playerId,
    });
  } catch (error) {
    console.error("Error joining game session:", error);
    res.status(500).json({
      message: "Error joining game session",
      error: error.message,
    });
  }
});

// End a game session (teacher only)
app.delete(
  "/api/game-sessions/:code",
  verifyToken,
  verifyTeacher,
  (req, res) => {
    try {
      const { code } = req.params;

      const sessionIndex = GAME_SESSIONS.findIndex(s => s.code === code);

      if (sessionIndex === -1) {
        return res.status(404).json({ message: "Game session not found" });
      }

      // Make sure the teacher owns this session
      if (GAME_SESSIONS[sessionIndex].teacherId !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Not authorized to end this game session" });
      }

      const deletedSession = GAME_SESSIONS.splice(sessionIndex, 1)[0];
      fs.writeFileSync(
        GAME_SESSIONS_FILE,
        JSON.stringify(GAME_SESSIONS, null, 2)
      );

      res.json({
        message: "Game session ended successfully",
        session: deletedSession,
      });
    } catch (error) {
      console.error("Error ending game session:", error);
      res.status(500).json({
        message: "Error ending game session",
        error: error.message,
      });
    }
  }
);

app.listen(port, () => {
  console.log(`Kahoot Clone server running on port ${port}`);
});
