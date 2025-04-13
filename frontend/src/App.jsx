import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Quizzes from './components/Quizzes';
import CreateQuiz from './components/CreateQuiz';
import Quiz from './components/Quiz';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/quiz/:id" element={<Quiz />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
