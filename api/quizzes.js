import mongoose from "mongoose";

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

let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  try {
    if (mongoose.connection.readyState === 0) {
      cachedConnection = await mongoose.connect(mongoUri, {
        bufferCommands: false,
        maxPoolSize: 1,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 10000,
      });
    }
    return cachedConnection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    switch (req.method) {
      case "GET":
        const quizzes = await Quiz.find().select("-questions.correctAnswer");
        return res.status(200).json(quizzes);

      case "POST":
        const newQuiz = new Quiz(req.body);
        const savedQuiz = await newQuiz.save();
        return res.status(201).json(savedQuiz);

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    console.error("Error stack:", error.stack);
    console.error("MongoDB URI exists:", !!process.env.MONGODB_URI);
    console.error("Mongoose connection state:", mongoose.connection.readyState);
    
    return res.status(500).json({
      error: "Database connection failed",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
