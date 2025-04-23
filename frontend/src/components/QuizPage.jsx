import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BubbleEffect from "./BubbleEffect";
import "./QuizPage.css";

const QuizPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:5173/api/quizzes/${id}`);
        if (!response.ok) throw new Error("Quiz not found");
        let data = await response.json();
        data.questions = data.questions.map((q) => ({
          ...q,
          answers: q.options,
          correctIndex: q.correctAnswer,
        }));
        setQuiz(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch quiz:", error.message);
        setError("Failed to load the quiz. Please try again later.");
        setQuiz(null);
      }
    };
    fetchQuiz();
  }, [id]);

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button
          className="btn-primary multi-bubble"
          onClick={() => navigate("/quizzes")}
        >
          Return to Quizzes
          <BubbleEffect />
        </button>
      </div>
    );
  }

  if (!quiz) {
    return <div className="loading-container">Loading quiz...</div>;
  }

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);

    if (answerIndex === quiz.questions[currentQuestion].correctIndex) {
      setScore(score + 1);
    }

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">{quiz.title}</h1>

      {!showResults ? (
        <div className="question-container">
          <h2 className="question-number">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </h2>
          <p className="question-text">{currentQuestionData.question}</p>

          <div className="answers-container">
            {currentQuestionData.answers.map((answer, index) => (
              <button
                key={answer}
                className={`answer-button multi-bubble ${
                  selectedAnswer === index ? "selected" : ""
                }`}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                {answer}
                <BubbleEffect />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="results-container">
          <h2>Quiz Results</h2>
          <p>
            You scored {score} out of {quiz.questions.length}
          </p>
          <button
            className="btn-primary multi-bubble"
            onClick={() => navigate("/quizzes")}
          >
            Return to Quizzes
            <BubbleEffect />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
