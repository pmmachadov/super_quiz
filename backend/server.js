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
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const quizzesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "quizzes.json"))
);
const QUIZZES = quizzesData.quizzes;

app.get("/api/quizzes", (req, res) => {
  res.json(QUIZZES);
});

app.get("/api/quizzes/:id", (req, res) => {
  const quiz = QUIZZES.find((q) => q.id === parseInt(req.params.id));
  if (quiz) {
    res.json(quiz);
  } else {
    res.status(404).json({ message: "Quiz not found" });
  }
});

app.post(
  "/api/quizzes",
  [validateQuizStructure, ...quizCreateValidationSchema, validateQuiz],
  (req, res) => {
    const newQuiz = {
      id: QUIZZES.length + 1,
      ...req.body,
    };
    QUIZZES.push(newQuiz);

    try {
      quizzesData.quizzes = QUIZZES;
      fs.writeFileSync(
        path.join(__dirname, "data", "quizzes.json"),
        JSON.stringify(quizzesData, null, 2)
      );
      res.status(201).json(newQuiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to save quiz" });
    }
  }
);

app.listen(port, () => {});
