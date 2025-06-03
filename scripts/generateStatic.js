const fs = require("fs");
const path = require("path");

(async () => {
  try {
    // Read quizzes from backend JSON file directly
    const dataPath = path.resolve(__dirname, "../backend/data/quizzes.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    const { quizzes } = JSON.parse(raw);

    // Prepare output directories
    const publicApiDir = path.resolve(__dirname, "../frontend/public/api");
    const quizzesDir = path.join(publicApiDir, "quizzes");
    fs.mkdirSync(quizzesDir, { recursive: true });

    // Write the main quizzes.json index
    const indexPath = path.join(publicApiDir, "quizzes.json");
    fs.writeFileSync(indexPath, JSON.stringify({ quizzes }, null, 2), "utf-8");

    // Write individual quiz files
    quizzes.forEach(quiz => {
      const filePath = path.join(quizzesDir, `${quiz.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(quiz, null, 2), "utf-8");
    });

    console.log("✅ Static JSON regenerated successfully.");
  } catch (error) {
    console.error("❌ Error generating static JSON:", error);
    process.exit(1);
  }
})();
