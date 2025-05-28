import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  HashRouter,
} from "react-router-dom";

import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";
import CreateQuiz from "./components/CreateQuiz";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Quiz from "./components/Quiz";
import Quizzes from "./components/Quizzes";
import Results from "./components/Results";
import "./App.css";

// Usar HashRouter en producción para GitHub Pages y BrowserRouter en desarrollo
const Router = import.meta.env.PROD ? HashRouter : BrowserRouter;

function App() {
  return (
    <Router>
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
          />{" "}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
