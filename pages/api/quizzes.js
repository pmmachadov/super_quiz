import { getAllQuizzes, createQuiz } from "../../lib/json-db.mjs";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case "GET": {
        const quizzes = getAllQuizzes();
        return res.status(200).json(quizzes);
      }

      case "POST": {
        const payload = req.body;
        const created = createQuiz(payload);
        return res.status(201).json(created);
      }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Database operation failed",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
