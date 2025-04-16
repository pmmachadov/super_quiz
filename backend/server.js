const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const quizzesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "quizzes.json"))
);
const QUIZZES = quizzesData.quizzes;

app.get("/api/quizzes", (req, res) => {
  console.log("[GET] /api/quizzes - Enviando todos los quizzes");
  res.json(QUIZZES);
});

app.get("/api/quizzes/:id", (req, res) => {
  console.log(`[GET] /api/quizzes/${req.params.id} - Buscando quiz con id`, req.params.id);
  const quiz = QUIZZES.find((q) => q.id === parseInt(req.params.id));
  if (quiz) {
    console.log("Quiz encontrado:", quiz);
    res.json(quiz);
  } else {
    console.log("Quiz no encontrado para id:", req.params.id);
    res.status(404).json({ message: "Quiz not found" });
  }
});

app.post("/api/quizzes", (req, res) => {
  console.log("[POST] /api/quizzes - Datos recibidos en req.body:", req.body);
  const newQuiz = {
    id: QUIZZES.length + 1,
    ...req.body,
  };
  QUIZZES.push(newQuiz);
  
  try {
    quizzesData.quizzes = QUIZZES;
    fs.writeFileSync(
      path.join(__dirname, 'data', 'quizzes.json'),
      JSON.stringify(quizzesData, null, 2)
    );
    console.log("Nuevo quiz guardado correctamente:", newQuiz);
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error('Error saving quiz:', error);
    res.status(500).json({ message: 'Failed to save quiz' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
