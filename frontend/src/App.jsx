import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Quizzes from "./components/Quizzes";
import CreateQuiz from "./components/CreateQuiz";
import Quiz from "./components/Quiz";
import Results from "./components/Results"; // Importando el componente Results

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/results/:score/:total" element={<Results />} />{" "}
          {/* Nueva ruta para resultados */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
