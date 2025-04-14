import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./QuizPage.css";

const QuizPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/quizzes/${id}`);
        if (!response.ok) throw new Error("Quiz not found");
        let data = await response.json();
        data.questions = data.questions.map((q) => ({
          ...q,
          answers: q.options,
          correctIndex: q.correctAnswer,
        }));
        setQuiz(data);
      } catch (err) {
        setQuiz(null);
      }
    };
    fetchQuiz();
  }, [id]);

  if (!quiz) {
    return <div>Loading quiz...</div>;
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
                className={`answer-button ${
                  selectedAnswer === index ? "selected" : ""
                }`}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                {answer}
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
            className="btn-primary"
            onClick={() => navigate("/quizzes")}
          >
            Return to Quizzes
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
