const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/superquiz");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  timeLimit: { type: Number, required: true, default: 30 },
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Quiz = mongoose.model("Quiz", quizSchema);

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

async function loadData() {
  try {
    console.log("🔄 Borrando datos existentes...");
    await Quiz.deleteMany({});

    console.log("📁 Leyendo archivo JSON...");
    const jsonPath = path.join(__dirname, "data", "quizzes.json");
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

    console.log(`📊 Encontrados ${jsonData.quizzes.length} quizzes en el JSON`);

    const quizzesForMongo = jsonData.quizzes.map(quiz => ({
      title: quiz.title,
      description: getDescriptionFromTitle(quiz.title),
      category: getCategoryFromTitle(quiz.title),
      difficulty: getDifficultyFromTitle(quiz.title),
      timeLimit: quiz.questions.length * 30,
      questions: quiz.questions,
    }));

    console.log("💾 Insertando datos en MongoDB...");
    await Quiz.insertMany(quizzesForMongo);
    console.log(`✅ ${quizzesForMongo.length} quizzes cargados correctamente`);

    const count = await Quiz.countDocuments();
    console.log(`🔍 Verificación: ${count} quizzes en la base de datos`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

mongoose.connection.once("open", () => {
  console.log("✅ Conectado a MongoDB");
  loadData();
});
