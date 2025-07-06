// Cargar variables de entorno desde el directorio raíz
require('dotenv').config({ path: '../.env' });

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/database");
const Quiz = require("./models/Quiz");

const app = express();
const port = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// Función para inicializar datos en MongoDB desde el archivo JSON
async function initializeDatabase() {
  try {
    console.log("🔍 Verificando estado de la base de datos...");
    const count = await Quiz.countDocuments();
    console.log(`📊 Cantidad actual de quizzes en DB: ${count}`);

    if (count === 0) {
      console.log(
        "📁 Base de datos vacía. Cargando datos desde quizzes.json..."
      );

      // Leer el archivo JSON real
      const jsonPath = path.join(__dirname, "data", "quizzes.json");
      console.log(`📂 Leyendo archivo: ${jsonPath}`);

      if (!fs.existsSync(jsonPath)) {
        throw new Error(`Archivo no encontrado: ${jsonPath}`);
      }

      const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
      console.log(`📋 Quizzes encontrados en JSON: ${jsonData.quizzes.length}`);

      // Convertir los datos del JSON al formato de MongoDB
      const quizzesForMongo = jsonData.quizzes.map((quiz, index) => {
        console.log(
          `📝 Procesando quiz ${index + 1}: ${quiz.title} (${
            quiz.questions.length
          } preguntas)`
        );
        return {
          title: quiz.title,
          description: getDescriptionFromTitle(quiz.title),
          category: getCategoryFromTitle(quiz.title),
          difficulty: getDifficultyFromTitle(quiz.title),
          timeLimit: quiz.questions.length * 15, // 15 segundos por pregunta
          questions: quiz.questions,
        };
      });

      console.log("💾 Insertando datos en MongoDB...");
      await Quiz.insertMany(quizzesForMongo);
      console.log(
        `✅ ${quizzesForMongo.length} quizzes cargados exitosamente en MongoDB`
      );

      // Verificar que se insertaron correctamente
      const newCount = await Quiz.countDocuments();
      console.log(
        `🔢 Verificación: Base de datos ahora tiene ${newCount} quizzes`
      );
    } else {
      console.log(`✅ Base de datos ya tiene ${count} quizzes`);
    }
  } catch (error) {
    console.error("❌ Error inicializando la base de datos:", error.message);
    console.error("🔍 Stack trace:", error.stack);
  }
}

// Inicializar datos después de conectar
initializeDatabase();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// ============ RUTAS API ============

// GET /api/quizzes - Obtener todos los quizzes
app.get("/api/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions.correctAnswer");
    res.json(quizzes);
  } catch (error) {
    console.error("Error obteniendo quizzes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/quizzes/:id - Obtener un quiz específico
app.get("/api/quizzes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz no encontrado" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("Error obteniendo quiz:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "ID de quiz inválido" });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/quizzes - Crear un nuevo quiz
app.post("/api/quizzes", async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    const savedQuiz = await quiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error("Error creando quiz:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT /api/quizzes/:id - Actualizar un quiz
app.put("/api/quizzes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuiz = await Quiz.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedQuiz) {
      return res.status(404).json({ error: "Quiz no encontrado" });
    }

    res.json(updatedQuiz);
  } catch (error) {
    console.error("Error actualizando quiz:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "ID de quiz inválido" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE /api/quizzes/:id - Eliminar un quiz
app.delete("/api/quizzes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return res.status(404).json({ error: "Quiz no encontrado" });
    }

    res.json({ message: "Quiz eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando quiz:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "ID de quiz inválido" });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Funciones auxiliares para mapear categorías y dificultad
function getDescriptionFromTitle(title) {
  const descriptions = {
    "Basic Programming": "Conceptos fundamentales de programación",
    "Advanced JavaScript": "Conceptos avanzados de JavaScript moderno",
    "General Science": "Conocimientos básicos de ciencias generales",
    "World History": "Eventos importantes de la historia mundial",
    "Pop Culture and Entertainment": "Cultura popular y entretenimiento",
    "World Geography": "Geografía mundial y conocimientos geográficos",
  };
  return descriptions[title] || `Quiz sobre ${title}`;
}

function getCategoryFromTitle(title) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("programming") || lowerTitle.includes("javascript"))
    return "tecnologia";
  if (lowerTitle.includes("science")) return "ciencia";
  if (lowerTitle.includes("history")) return "historia";
  if (lowerTitle.includes("geography")) return "geografia";
  if (lowerTitle.includes("culture") || lowerTitle.includes("entertainment"))
    return "entretenimiento";
  return "general";
}

function getDifficultyFromTitle(title) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("basic") || lowerTitle.includes("general"))
    return "easy";
  if (lowerTitle.includes("advanced")) return "hard";
  return "medium";
}
