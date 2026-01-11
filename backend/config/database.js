const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/super_quiz";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    // Don't exit the process in development environments.
    // Allow the server to start and handle requests using fallback/static data.
    console.error("Continuando sin conexión a MongoDB. Algunas funcionalidades pueden estar limitadas.");
  }
};

module.exports = connectDB;
