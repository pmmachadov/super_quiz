import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getApiBaseUrl } from "../utils/apiConfig";

import "./Quiz.css";

const quizzesCache = new Map();

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(() => {
    return quizzesCache.get(id) || null;
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(!quizzesCache.has(id));
  const [fadeIn, setFadeIn] = useState(false);
  const [animateQuestion, setAnimateQuestion] = useState(false);
  const [questionTransition, setQuestionTransition] = useState(false);
  const [resetProgress, setResetProgress] = useState(false);
  const timerProgressRef = useRef(null);

  const correctAnswersRef = useRef(0);
  const allResultsRef = useRef([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (quizzesCache.has(id)) {
        const cachedQuiz = quizzesCache.get(id);
        setQuiz(cachedQuiz);
        setIsLoading(false);

        setTimeout(() => {
          setFadeIn(true);
          setAnimateQuestion(true);
        }, 50);

        return;
      }
      try {
        setIsLoading(true);
        setError(null);

        let quizData;

        if (import.meta.env.PROD) {
          const baseUrl = getApiBaseUrl();
          const response = await fetch(`${baseUrl}/api/quizzes`);
          if (!response.ok) {
            throw new Error(`Failed to fetch quizzes: ${response.status}`);
          }
          const data = await response.json();
          const list = Array.isArray(data) ? data : data.quizzes || [];
          if (!list.length) throw new Error("No quizzes available");
          quizData = list.find(q => q._id === id || String(q.id) === id);
          if (!quizData) throw new Error("Quiz not found");
        } else {
          const baseUrl = getApiBaseUrl();
          const apiEndpoint = `${baseUrl}/api/quizzes/${id}`;

          const response = await fetch(apiEndpoint, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            cache: "no-cache",
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }

          quizData = await response.json();
        }

        if (quizData.questions && quizData.questions.length > 0) {
          quizData.questions = quizData.questions.map(q => ({
            ...q,
            answers: q.options || q.answers || [],
            correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
          }));
        }

        quizzesCache.set(id, quizData);

        setQuiz(quizData);
        setError(null);

        setTimeout(() => {
          setFadeIn(true);
          setAnimateQuestion(true);
          setIsLoading(false);
        }, 50);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError(
          `Error loading the quiz: ${error.message}. Please try again later.`
        );
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const saveGameResults = useCallback(
    async (finalScore, totalQuestions) => {
      try {
        const baseUrl = getApiBaseUrl();

        const gameResult = {
          quizId: parseInt(id),
          score: finalScore,
          totalQuestions: totalQuestions,
          correctAnswers: finalScore,
          questionResults: allResultsRef.current,
        };
        await fetch(`${baseUrl}/api/game-results`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gameResult),
        });
      } catch (error) {
        console.error("Error saving game results:", error);
      }
    },
    [id]
  );

  const handleQuestionTransition = React.useCallback(() => {
    setShowResults(false);

    if (currentQuestion < quiz?.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
      setSelectedAnswer(null);

      setTimeout(() => {
        setFadeIn(true);
        setAnimateQuestion(true);
        setQuestionTransition(false);
      }, 50);
    } else {
      const finalScore = correctAnswersRef.current;
      saveGameResults(finalScore, quiz.questions.length);
      navigate(`/results/${finalScore}/${quiz.questions.length}`);
    }
  }, [currentQuestion, navigate, quiz, saveGameResults]);

  const handleAnswerSelect = React.useCallback(
    answerIndex => {
      if (selectedAnswer !== null || !quiz) return;

      setSelectedAnswer(answerIndex);

      const correctIndex = quiz.questions[currentQuestion].correctAnswer;
      const isCorrect = answerIndex === correctIndex;

      const questionResult = {
        questionId: `${quiz.id || "quiz"}-${currentQuestion}`,
        questionText: quiz.questions[currentQuestion].question,
        selectedAnswer: answerIndex,
        correctAnswer: correctIndex,
        isCorrect: isCorrect,
        responseTime: 30 - timeLeft,
      };

      allResultsRef.current.push(questionResult);
      if (isCorrect) {
        correctAnswersRef.current += 1;
      }

      if (isCorrect) {
        setScore(prevScore => prevScore + 1);
      }

      setShowResults(true);

      setTimeout(() => {
        setFadeIn(false);
        setQuestionTransition(true);

        setTimeout(() => {
          handleQuestionTransition();
        }, 500);
      }, 1500);
    },
    [currentQuestion, handleQuestionTransition, quiz, selectedAnswer, timeLeft]
  );

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !selectedAnswer && !isLoading) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !selectedAnswer && !isLoading && quiz) {
      handleAnswerSelect(null);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, selectedAnswer, isLoading, quiz, handleAnswerSelect]);

  useEffect(() => {
    if (!isLoading && quiz) {
      setResetProgress(true);
      setTimeout(() => {
        setResetProgress(false);
      }, 100);
    }
  }, [currentQuestion, isLoading, quiz]);

  useEffect(() => {
    if (selectedAnswer !== null && timerProgressRef.current) {
      timerProgressRef.current.style.animationPlayState = "paused";
    }
  }, [selectedAnswer]);

  const getTimerClass = () => {
    if (timeLeft <= 6) return "timer-countdown danger";
    if (timeLeft <= 10) return "timer-countdown warning";
    return "timer-countdown";
  };

  const getProgressBarClass = () => {
    const baseClass = "timer-progress-bar";
    if (resetProgress) return `${baseClass} reset`;
    if (selectedAnswer !== null) return `${baseClass} paused`;
    if (timeLeft <= 6) return `${baseClass} warning`;
    return baseClass;
  };

  const getTimerBackground = () => {
    if (timeLeft <= 6) {
      return "linear-gradient(to right, #f44336, #d32f2f)";
    } else if (timeLeft <= 14) {
      return "linear-gradient(to right, #ff9800, #f57c00)";
    } else {
      return "linear-gradient(to right, #4caf50, #388e3c)";
    }
  };

  const getAnswerClass = index => {
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

      if (selectedAnswer === index) {
        return `${baseClass} user-selected correct-selected`;
      }
    }

    return baseClass;
  };

  if (error) {
    return (
      <div
        className="container"
        style={{ marginTop: "2rem" }}
      >
        <div className="quiz-container">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="retry-button"
              style={{ marginBottom: "1rem" }}
            >
              Retry Loading Quiz
            </button>
            <Link
              to="/"
              className="btn primary"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !quiz) {
    return (
      <div
        className="container"
        style={{ marginTop: "2rem" }}
      >
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading quiz...</p>
          <Link
            to="/"
            className="home-button"
          >
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
    <div
      className="container"
      style={{ marginTop: "2rem" }}
    >
      <div className={containerClasses}>
        <div className="ring-3d-pieces">
          <div
            key="ring-piece-top"
            className="ring-piece ring-piece-0"
          ></div>
          <div
            key="ring-piece-top-right"
            className="ring-piece ring-piece-1"
          ></div>
          <div
            key="ring-piece-right"
            className="ring-piece ring-piece-2"
          ></div>
          <div
            key="ring-piece-bottom-right"
            className="ring-piece ring-piece-3"
          ></div>
          <div
            key="ring-piece-bottom"
            className="ring-piece ring-piece-4"
          ></div>
          <div
            key="ring-piece-bottom-left"
            className="ring-piece ring-piece-5"
          ></div>
          <div
            key="ring-piece-left"
            className="ring-piece ring-piece-6"
          ></div>
          <div
            key="ring-piece-top-left"
            className="ring-piece ring-piece-7"
          ></div>
        </div>

        <div
          className="timer-progress-container"
          style={{ zIndex: 100, height: "6px" }}
        >
          <div
            ref={timerProgressRef}
            className={getProgressBarClass()}
            style={{
              animationDuration: `30s`,
              width: `${(timeLeft / 30) * 100}%`,
              background: getTimerBackground(),
              height: "6px",
              transition: "width 1s linear",
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
              <circle
                cx="12"
                cy="12"
                r="10"
              ></circle>
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
          <Link
            to="/"
            className="home-button"
          >
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
