import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Quizzes from "./components/Quizzes";
import CreateQuiz from "./components/CreateQuiz";
import Quiz from "./components/Quiz";
import QuizPage from "./components/QuizPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/quizzes/:id" element={<QuizPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
