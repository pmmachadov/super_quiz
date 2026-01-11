import { getQuizById, updateQuiz, deleteQuiz } from "../../lib/json-db.mjs";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query;

  try {
    switch (req.method) {
      case "GET": {
        const quiz = getQuizById(id);
        if (!quiz) return res.status(404).json({ error: "Quiz no encontrado" });
        return res.status(200).json(quiz);
      }

      case "PUT": {
        const updated = updateQuiz(id, req.body);
        if (!updated) return res.status(404).json({ error: "Quiz no encontrado" });
        return res.status(200).json(updated);
      }

      case "DELETE": {
        const ok = deleteQuiz(id);
        if (!ok) return res.status(404).json({ error: "Quiz no encontrado" });
        return res.status(200).json({ message: "Quiz eliminado correctamente" });
      }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
