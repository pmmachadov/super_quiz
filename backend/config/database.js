const mongoose = require("mongoose");

// Variable de entorno para la URL de MongoDB
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/super_quiz";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
