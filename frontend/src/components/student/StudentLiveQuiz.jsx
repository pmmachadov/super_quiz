import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../LiveQuiz.css";
import "./JoinQuiz.css";

const StudentLiveQuiz = () => {
  const { code } = useParams();
  const { token, currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [timer, setTimer] = useState(null);
  const [connected, setConnected] = useState(false);
  const [waitingForStart, setWaitingForStart] = useState(true);
  const [quizEnded, setQuizEnded] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    if (!code || !token || !currentUser) {
      navigate("/student/dashboard");
      return;
    }

    const fetchSession = async () => {
      try {
        setLoading(true);
        // Check if the session exists
        const response = await fetch(
          `http://localhost:3000/api/game-sessions/${code}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Session not found or no longer active");
        }

        const sessionData = await response.json();
        setSession(sessionData);

        // Join the session if not already joined
        if (!sessionData.players.some(player => player.id === currentUser.id)) {
          const joinResponse = await fetch(
            `http://localhost:3000/api/game-sessions/${code}/join`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ studentId: currentUser.id }),
            }
          );

          if (!joinResponse.ok) {
            throw new Error("Failed to join the session");
          }
        }

        setConnected(true);
        setWaitingForStart(true);

        // Poll for session updates
        const pollInterval = setInterval(async () => {
          try {
            const pollResponse = await fetch(
              `http://localhost:3000/api/game-sessions/${code}/status`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!pollResponse.ok) {
              if (pollResponse.status === 404) {
                // Session ended or not found
                clearInterval(pollInterval);
                setQuizEnded(true);
                return;
              }
              throw new Error("Failed to get session status");
            }

            const statusData = await pollResponse.json();

            if (statusData.status === "active" && statusData.currentQuestion) {
              setWaitingForStart(false);
              setQuestion(statusData.currentQuestion);
              setTimer(statusData.timeRemaining);
              setAnswerSubmitted(false);
              setSelectedAnswer(null);
            } else if (statusData.status === "completed") {
              setQuizEnded(true);
              setQuizResults(statusData.results);
              clearInterval(pollInterval);
            }
          } catch (err) {
            console.error("Error polling session:", err);
          }
        }, 2000);

        return () => clearInterval(pollInterval);
      } catch (err) {
        setError(err.message || "Failed to join quiz session");
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [code, token, currentUser, navigate]);

  const handleAnswerSelect = answerId => {
    if (answerSubmitted) return;
    setSelectedAnswer(answerId);
  };

  const submitAnswer = async () => {
    if (!selectedAnswer || answerSubmitted) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/game-sessions/${code}/answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            questionId: question.id,
            answerId: selectedAnswer,
            studentId: currentUser.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit answer");
      }

      setAnswerSubmitted(true);
    } catch (err) {
      setError("Failed to submit answer: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="live-quiz-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <h2>Conectando a la sesión...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="live-quiz-container">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="back-button"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (quizEnded) {
    return (
      <div className="live-quiz-container">
        <div className="quiz-ended-state">
          <h2>¡Quiz Finalizado!</h2>
          {quizResults ? (
            <div className="results-summary">
              <p className="final-score">
                Tu puntuación: {quizResults.score} puntos
              </p>
              <p>Respuestas correctas: {quizResults.correctAnswers}</p>
              <p>Respuestas totales: {quizResults.totalAnswers}</p>
            </div>
          ) : (
            <p>Gracias por participar</p>
          )}
          <button
            onClick={() => navigate("/student/dashboard")}
            className="back-to-dashboard-btn"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (waitingForStart) {
    return (
      <div className="live-quiz-container">
        <div className="waiting-room">
          <h2>Esperando que comience el quiz</h2>
          <div className="session-info">
            <p>
              <strong>Código de sesión:</strong> {code}
            </p>
            {session && (
              <>
                <p>
                  <strong>Quiz:</strong> {session.quizName}
                </p>
                <p>
                  <strong>Profesor:</strong> {session.teacherName}
                </p>
              </>
            )}
          </div>
          <div className="waiting-animation">
            <div className="pulse-dot"></div>
          </div>
          <p className="waiting-message">
            El profesor iniciará el quiz pronto...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="live-quiz-container">
      {question && (
        <div className="question-container">
          <div className="question-header">
            <div className="timer-container">
              <div className="timer">{timer}s</div>
            </div>
          </div>

          <div className="question-content">
            <h2 className="question-text">{question.text}</h2>

            <div className="answers-list">
              {question.answers.map(answer => (
                <button
                  key={answer.id}
                  onClick={() => handleAnswerSelect(answer.id)}
                  className={`answer-option ${
                    selectedAnswer === answer.id ? "selected" : ""
                  }`}
                  disabled={answerSubmitted}
                >
                  {answer.text}
                </button>
              ))}
            </div>

            <button
              className="submit-answer-btn"
              onClick={submitAnswer}
              disabled={!selectedAnswer || answerSubmitted}
            >
              {answerSubmitted ? "Respuesta Enviada" : "Enviar Respuesta"}
            </button>

            {answerSubmitted && (
              <div className="answer-feedback">
                <p>
                  Tu respuesta ha sido enviada. Espera para la siguiente
                  pregunta.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLiveQuiz;
