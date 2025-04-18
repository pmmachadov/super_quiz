import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Quiz.css";

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [animateQuestion, setAnimateQuestion] = useState(false);
  const [questionTransition, setQuestionTransition] = useState(false);
  const [resetProgress, setResetProgress] = useState(false);
  const timerProgressRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${id}`
        );
        const quizData = response.data;

        if (quizData.questions && quizData.questions.length > 0) {
          if (quizData.questions[0].options && !quizData.questions[0].answers) {
            quizData.questions = quizData.questions.map((q) => ({
              ...q,
              answers: q.options || [],
              correctAnswer:
                q.correctAnswer !== undefined ? q.correctAnswer : 0,
            }));
          }
        }

        setQuiz(quizData);
        setTimeout(() => {
          setFadeIn(true);
          setAnimateQuestion(true);
          setIsLoading(false);
        }, 300);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError("Error loading the quiz");
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !selectedAnswer && !isLoading) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !selectedAnswer && !isLoading && quiz) {
      handleAnswerSelect(null);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, selectedAnswer, isLoading, quiz]);

  useEffect(() => {
    if (!isLoading && quiz) {
      setResetProgress(true);
      setTimeout(() => {
        setResetProgress(false);
      }, 50);
    }
  }, [currentQuestion, isLoading, quiz]);

  useEffect(() => {
    if (selectedAnswer !== null && timerProgressRef.current) {
      timerProgressRef.current.style.animationPlayState = "paused";
    }
  }, [selectedAnswer]);

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);

    const isCorrect =
      answerIndex === quiz.questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResults(true);

    setTimeout(() => {
      setFadeIn(false);
      setQuestionTransition(true);

      setTimeout(() => {
        setShowResults(false);

        if (currentQuestion < quiz.questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setTimeLeft(10);
          setSelectedAnswer(null);

          setTimeout(() => {
            setFadeIn(true);
            setAnimateQuestion(true);
            setQuestionTransition(false);
          }, 100);
        } else {
          navigate(
            `/results/${score + (isCorrect ? 1 : 0)}/${quiz.questions.length}`
          );
        }
      }, 400);
    }, 2000);
  };

  const getTimerClass = () => {
    if (timeLeft <= 3) return "timer-countdown danger";
    if (timeLeft <= 5) return "timer-countdown warning";
    return "timer-countdown";
  };

  const getProgressBarClass = () => {
    const baseClass = "timer-progress-bar";
    if (resetProgress) return `${baseClass} reset`;
    if (selectedAnswer !== null) return `${baseClass} paused`;
    if (timeLeft <= 3) return `${baseClass} warning`;
    return baseClass;
  };

  const getAnswerClass = (index) => {
    const baseClass = "answer-button";

    if (!showResults && selectedAnswer === index) {
      return `${baseClass} selected`;
    }

    if (showResults) {
      const correctIndex = quiz.questions[currentQuestion].correctAnswer;
      if (index === correctIndex) {
        return `${baseClass} correct`;
      }
      if (selectedAnswer === index && index !== correctIndex) {
        return `${baseClass} incorrect`;
      }
    }

    return baseClass;
  };

  const getOptionLetter = (index) => {
    return String.fromCharCode(65 + index);
  };

  if (error) {
    return (
      <div className="container" style={{ marginTop: "2rem" }}>
        <div className="quiz-container">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <Link to="/" className="btn primary">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !quiz) {
    return (
      <div className="container" style={{ marginTop: "2rem" }}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading quiz...</p>
          <Link to="/" className="home-button">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progressPercentage = (currentQuestion / quiz.questions.length) * 100;

  const containerClasses = [
    "quiz-container",
    fadeIn ? "fade-in" : "",
    questionTransition ? "question-transition" : "",
    animateQuestion ? "active-question" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <div className={containerClasses}>
        <div
          className="timer-progress-container"
          style={{ zIndex: 100, height: "6px" }}
        >
          <div
            ref={timerProgressRef}
            className={getProgressBarClass()}
            style={{
              animationDuration: `${timeLeft}s`,
              background:
                timeLeft <= 3
                  ? "linear-gradient(to right, #f44336, #d32f2f)"
                  : "linear-gradient(to right, #ff9800, #f44336)",
              height: "6px",
            }}
          ></div>
        </div>

        <div className="quiz-header">
          <div className="quiz-info">
            <div className="question-number">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
          </div>
          <div className="timer-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <div className={getTimerClass()}>{timeLeft}s</div>
          </div>
        </div>

        <div className="question-container">
          <h2 className="question-text">{currentQ.question}</h2>
        </div>

        <div className="answer-grid">
          {currentQ.answers.map((answer, index) => (
            <button
              key={`answer-${currentQ.id || currentQuestion}-${index}`}
              onClick={() => handleAnswerSelect(index)}
              className={getAnswerClass(index)}
              disabled={selectedAnswer !== null}
              data-option={getOptionLetter(index)}
            >
              {answer}
            </button>
          ))}
        </div>

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="score-display">
          Score: <span className="score-number">{score}</span> /{" "}
          {quiz.questions.length}
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link to="/" className="home-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
