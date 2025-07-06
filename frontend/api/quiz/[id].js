import mongoose from "mongoose";

// Reutilizar el esquema (deberías moverlo a un archivo común)
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

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query;

  try {
    await connectToDatabase();

    switch (req.method) {
      case "GET":
        // GET /api/quiz/[id] - Obtener quiz específico
        const quiz = await Quiz.findById(id);
        if (!quiz) {
          return res.status(404).json({ error: "Quiz no encontrado" });
        }
        return res.status(200).json(quiz);

      case "PUT":
        // PUT /api/quiz/[id] - Actualizar quiz
        const updatedQuiz = await Quiz.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedQuiz) {
          return res.status(404).json({ error: "Quiz no encontrado" });
        }
        return res.status(200).json(updatedQuiz);

      case "DELETE":
        // DELETE /api/quiz/[id] - Eliminar quiz
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        if (!deletedQuiz) {
          return res.status(404).json({ error: "Quiz no encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Quiz eliminado correctamente" });

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "ID de quiz inválido" });
    }
    return res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
}
