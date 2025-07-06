import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Esquema de Quiz
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  timeLimit: {
    type: Number,
    required: true,
    default: 30,
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB Atlas");

    // Verificar si ya hay datos
    const count = await Quiz.countDocuments();
    if (count > 0) {
      return res.status(200).json({
        message: `Base de datos ya tiene ${count} quizzes`,
        count,
      });
    }

    // Datos de ejemplo para inicializar
    const defaultQuizzes = [
      {
        title: "Basic Programming",
        description: "Conceptos fundamentales de programación",
        category: "tecnologia",
        difficulty: "easy",
        timeLimit: 45,
        questions: [
          {
            question: "What does HTML stand for?",
            options: [
              "Hyper Text Markup Language",
              "High Tech Modern Language",
              "Hyper Technical Machine Learning",
              "Home Tool Markup Language",
            ],
            correctAnswer: 0,
          },
          {
            question: "Which of these is NOT a programming language?",
            options: ["JavaScript", "Python", "HTML", "Java"],
            correctAnswer: 2,
          },
          {
            question: "What does the console.log() function do in JavaScript?",
            options: [
              "Logs information to the console",
              "Creates an error log",
              "Prints a web page",
              "Shows an alert to the user",
            ],
            correctAnswer: 0,
          },
        ],
      },
      {
        title: "Advanced JavaScript",
        description: "Conceptos avanzados de JavaScript moderno",
        category: "tecnologia",
        difficulty: "hard",
        timeLimit: 45,
        questions: [
          {
            question: "What is a Promise in JavaScript?",
            options: [
              "A type of variable",
              "An object that represents a value that may be available now, in the future, or never",
              "A built-in function",
              "A type of loop",
            ],
            correctAnswer: 1,
          },
          {
            question: "Which method converts a JSON object to a string?",
            options: [
              "JSON.parse()",
              "JSON.stringify()",
              "JSON.toString()",
              "JSON.convert()",
            ],
            correctAnswer: 1,
          },
          {
            question: "What is hoisting in JavaScript?",
            options: [
              "An optimization technique",
              "The process of moving declarations to the top of their scope",
              "A common error in JavaScript",
              "A method to lift elements on the page",
            ],
            correctAnswer: 1,
          },
        ],
      },
    ];

    await Quiz.insertMany(defaultQuizzes);
    const newCount = await Quiz.countDocuments();

    return res.status(200).json({
      message: `✅ ${defaultQuizzes.length} quizzes inicializados correctamente`,
      count: newCount,
    });
  } catch (error) {
    console.error("❌ Error inicializando datos:", error);
    return res.status(500).json({
      error: "Error inicializando la base de datos",
      details: error.message,
    });
  }
}
