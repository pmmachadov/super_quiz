import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./Quizzes.css";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const response = await fetch("http://localhost:5000/api/quizzes");
      const data = await response.json();
      setQuizzes(data);
    };
    fetchQuizzes();
  }, []);
  const navigate = useNavigate();

  return (
    <div className="quizzes-container">
      <h1 className="page-title">Available Quizzes</h1>

      <div className="quizzes-grid">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-card">
            <h2 className="quiz-title">{quiz.title}</h2>
            <p className="quiz-description">
              {quiz.questions.length} questions
            </p>
            <button
              className="btn-secondary"
              onClick={() => navigate(`/quiz/${quiz.id}`)}
            >
              Start Quiz
            </button>
          </div>
        ))}
      </div>

      <div className="create-quiz-section">
        <button
          className="btn-secondary"
          onClick={() => navigate("/create-quiz")}
        >
          Create New Quiz
        </button>
      </div>
    </div>
  );
};

export default Quizzes;
