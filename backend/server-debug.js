// Debug version of server.js with relaxed CORS settings
// Save as server-debug.js and run with: node server-debug.js

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
const port = process.env.PORT || 3000;

// More permissive CORS configuration for debugging
app.use(
  cors({
    origin: "*", // Allow all origins for debugging
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "Accept",
      "X-Requested-With",
    ],
  })
);

// Add OPTIONS handling for preflight requests
app.options("*", cors());
app.use(bodyParser.json());

// Use all the original routes and logic from server.js
// The rest of your server code would go here...

// Start the server
app.listen(port, () => {
  console.log(
    `Debug server running with CORS enabled for all origins on port ${port}`
  );
  console.log(
    `IMPORTANT: This configuration is for debugging only. Do not use in production.`
  );
});
