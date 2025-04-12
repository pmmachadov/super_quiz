import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Quiz from './components/Quiz';
import CreateQuiz from './components/CreateQuiz';
import Quizzes from './components/Quizzes';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/quizzes/:id" element={<Quiz />} />
          <Route path="/create" element={<CreateQuiz />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
