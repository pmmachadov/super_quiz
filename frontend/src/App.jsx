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
import SpacedRepetition from "./components/spaced-repetition/SpacedRepetition";
import "./App.css";

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
            path="/spaced-repetition"
            element={<SpacedRepetition />}
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
