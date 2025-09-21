const fs = require("fs");
const path = require("path");

// This script prepares and writes the quizzes JSON file consumed by the app: data/quizzes.json

const srcFile = path.join(__dirname, "..", "data", "quizzes.source.json");
const destFile = path.join(__dirname, "..", "data", "quizzes.json");

function readSource(file) {
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read/parse source file", file, err.message);
    return [];
  }
}

function writeDest(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
    console.log(`Wrote ${data.length} quizzes to ${file}`);
  } catch (err) {
    console.error("Failed to write destination file", file, err.message);
  }
}

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
  const lowerTitle = (title || "").toLowerCase();
  if (lowerTitle.includes("programming") || lowerTitle.includes("javascript")) return "tecnologia";
  if (lowerTitle.includes("science")) return "ciencia";
  if (lowerTitle.includes("history")) return "historia";
  if (lowerTitle.includes("geography")) return "geografia";
  if (lowerTitle.includes("culture") || lowerTitle.includes("entertainment")) return "entretenimiento";
  return "general";
}

function getDifficultyFromTitle(title) {
  const lowerTitle = (title || "").toLowerCase();
  if (lowerTitle.includes("basic") || lowerTitle.includes("general")) return "easy";
  if (lowerTitle.includes("advanced")) return "hard";
  return "medium";
}

function ensureIdsAndTimestamps(quizzes) {
  return (quizzes || []).map((quiz, idx) => {
    const now = new Date().toISOString();
    return {
      id: quiz.id || `${Date.now()}-${idx}`,
      title: quiz.title || `Untitled ${idx + 1}`,
      description: quiz.description || getDescriptionFromTitle(quiz.title),
      category: quiz.category || getCategoryFromTitle(quiz.title),
      difficulty: quiz.difficulty || getDifficultyFromTitle(quiz.title),
      timeLimit: quiz.timeLimit || (quiz.questions ? quiz.questions.length * 30 : 30),
      questions: quiz.questions || [],
      createdAt: quiz.createdAt || now,
      updatedAt: quiz.updatedAt || now,
    };
  });
}

function main() {
  console.log("Preparing quizzes JSON file...");
  const source = readSource(srcFile);
  // Support both array or { quizzes: [] } shapes
  const sourceQuizzes = Array.isArray(source) ? source : source.quizzes || [];
  const prepared = ensureIdsAndTimestamps(sourceQuizzes);
  const destDir = path.dirname(destFile);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  writeDest(destFile, prepared);
}

if (require.main === module) main();
