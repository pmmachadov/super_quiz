import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import "./LiveQuiz.css";

const LiveQuiz = () => {
  const { token, currentUser } = useAuth();
  const [quizzes, setQuizzes] = useState([]);  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);  // Estado separado para la carga inicial y las operaciones
  const [initialLoading, setInitialLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  // Fetch quizzes and active sessions
  useEffect(() => {
    if (!token || currentUser?.role !== "teacher") {
      return;
    }

    const fetchData = async () => {
      setInitialLoading(true);
      try {
        // Fetch quizzes
        const quizzesResponse = await fetch(
          "http://localhost:3000/api/quizzes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (quizzesResponse.ok) {
          const quizzesData = await quizzesResponse.json();
          setQuizzes(quizzesData);
        }

        // Fetch active sessions
        const sessionsResponse = await fetch(
          "http://localhost:3000/api/game-sessions/teacher",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (sessionsResponse.ok) {
          const sessionsData = await sessionsResponse.json();
          setActiveSessions(sessionsData);
        }
      } catch (err) {
        setError("Error al cargar los datos. Inténtalo de nuevo más tarde.");
        console.error("Error fetching data:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [token, currentUser]);
  // Launch a new game session
  const handleLaunchQuiz = async () => {
    if (!selectedQuiz) {
      setError("Por favor, selecciona un quiz para lanzar");
      return;
    }

    try {      // Set operation loading state to prevent UI flickering
      setOperationLoading(true);
      
      const response = await fetch("http://localhost:3000/api/game-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quizId: selectedQuiz }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al lanzar el quiz");
      }

      setCurrentSession(data.session);
      setActiveSessions(prev => {
        const exists = prev.some(session => session.id === data.session.id);
        return exists ? prev : [...prev, data.session];
      });
      setSuccess("¡Quiz lanzado con éxito!");
      setShowCodeModal(true);
      setSelectedQuiz(null); // Reset selection after launching
    } catch (err) {
      setError(err.message || "Error al lanzar el quiz");
      console.error("Error launching quiz:", err);
    } finally {      // Add a small delay before changing loading state to avoid UI flickering
      setTimeout(() => {
        setOperationLoading(false);
      }, 300);
    }
  };
  // Copy session code to clipboard
  const [codeCopied, setCodeCopied] = useState(false);

  const copyCodeToClipboard = () => {
    if (!currentSession) return;

    navigator.clipboard
      .writeText(currentSession.code)
      .then(() => {
        setSuccess("¡Código copiado al portapapeles!");
        setCodeCopied(true);

        // Reset the copied state after 3 seconds
        setTimeout(() => {
          setSuccess("");
          setCodeCopied(false);
        }, 3000);
      })
      .catch(() => {
        setError("Error al copiar el código");
      });
  };
  // End a session
  const handleEndSession = async code => {
    try {
      setOperationLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/game-sessions/${code}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al finalizar la sesión");
      }

      setActiveSessions(prev => prev.filter(session => session.code !== code));
      setSuccess("Sesión finalizada con éxito");

      if (currentSession?.code === code) {
        setCurrentSession(null);
        setShowCodeModal(false);
      }
    } catch (err) {
      setError(err.message || "Error al finalizar la sesión");
      console.error("Error ending session:", err);
    } finally {
      setOperationLoading(false);
    }
  };

  return (
    <div className="live-quiz-container">
      <h1>Lanzar Quiz en Vivo</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Quiz Launch Form - Simplified */}
      <div className="quiz-launch-form">
        <h2>Lanzar Quiz Rápidamente</h2>

        <div className="form-group">          <label htmlFor="quiz-selector">Seleccionar Quiz:</label>
          <div className="quick-launch-select-wrapper">            <select
              id="quiz-selector"
              value={selectedQuiz || ""}
              onChange={e =>
                setSelectedQuiz(e.target.value ? Number(e.target.value) : null)
              }
              disabled={operationLoading || initialLoading}
              className="quick-launch-select"
            >
              <option value="">-- Seleccionar un Quiz --</option>
              {quizzes.map(quiz => (
                <option
                  key={quiz.id}
                  value={quiz.id}
                >
                  {quiz.title} ({quiz.questions.length} preguntas)
                </option>
              ))}
            </select>
            <button
              className="launch-button"
              onClick={handleLaunchQuiz}
              disabled={operationLoading || !selectedQuiz}
            >
              {operationLoading ? "Lanzando..." : "Lanzar Quiz"}
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions List */}
      <div className="active-sessions">
        <h2>Sesiones Activas</h2>

        {activeSessions.length === 0 ? (
          <p className="no-sessions">
            No hay sesiones activas. ¡Lanza un quiz para comenzar!
          </p>
        ) : (
          <div className="sessions-list">
            {activeSessions.map(session => (
              <div
                key={session.id}
                className="session-card"
              >
                <div className="session-info">
                  <h3>{session.quizTitle}</h3>
                  <p className="session-code-display">
                    <strong>Código:</strong>
                    <span className="session-code">{session.code}</span>
                  </p>
                  <p>
                    <strong>Estudiantes:</strong> {session.players.length}
                  </p>
                  <p className="session-date">
                    <strong>Creado:</strong>
                    {new Date(session.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="session-actions">
                  <button
                    onClick={() => {
                      setCurrentSession(session);
                      setShowCodeModal(true);
                    }}
                    className="view-code-button"
                  >
                    Ver Código
                  </button>
                  <button
                    onClick={() => handleEndSession(session.code)}
                    className="end-session-button"
                  >
                    Finalizar Sesión
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Code Modal */}
      {showCodeModal && currentSession && (        <div
          className="modal-overlay"
          onClick={() => setShowCodeModal(false)}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowCodeModal(false);
          }}
        >          <div
            className="code-modal"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-labelledby="modal-title"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setShowCodeModal(false);
            }}
          >
            <h2 id="modal-title">¡Quiz Lanzado!</h2>
            <p>Comparte este código con tus estudiantes:</p>{" "}
            <div className="code-display-container">              <div
                className={`code-display ${codeCopied ? "code-copied" : ""}`}
                onClick={copyCodeToClipboard}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    copyCodeToClipboard();
                  }
                }}
                aria-label="Click para copiar el código"
              >
                {currentSession.code}
              </div>
              <div className="code-copy-hint">
                {codeCopied ? "¡Código copiado!" : "Click para copiar"}
              </div>
            </div>
            <div className="modal-info">
              <p>
                <strong>Quiz:</strong> {currentSession.quizTitle}
              </p>
              <p>
                <strong>Estudiantes conectados:</strong>{" "}
                {currentSession.players.length}
              </p>
            </div>{" "}
            <div className="modal-actions">
              <button
                onClick={copyCodeToClipboard}
                className={`copy-code-button ${codeCopied ? "copied" : ""}`}
              >
                {codeCopied ? "¡Código Copiado!" : "Copiar Código"}
              </button>
              <button
                onClick={() => setShowCodeModal(false)}
                className="close-modal-button"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveQuiz;
