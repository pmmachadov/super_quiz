import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";
import CreateQuiz from "./components/CreateQuiz";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Quiz from "./components/Quiz";
import Quizzes from "./components/Quizzes";
import Results from "./components/Results";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/quizzes"
            element={<Quizzes />}
          />
          <Route
            path="/quiz/:id"
            element={<Quiz />}
          />
          <Route
            path="/create-quiz"
            element={<CreateQuiz />}
          />
          <Route
            path="/results/:score/:total"
            element={<Results />}
          />
          <Route
            path="/analytics"
            element={<AnalyticsDashboard userId="currentUser" />}
          />
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
