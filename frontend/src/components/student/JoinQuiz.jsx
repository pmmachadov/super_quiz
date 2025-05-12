import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../LiveQuiz.css";
import "./JoinQuiz.css";
import "./StudentLiveQuiz.css";

const JoinQuiz = () => {
  const { token, currentUser } = useAuth();
  const navigate = useNavigate();
  const [gameCode, setGameCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [joinedSession, setJoinedSession] = useState(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const handleJoinQuiz = async e => {
    e.preventDefault();
    if (!gameCode || gameCode.length !== 6) {
      return setError("Por favor, ingresa un código válido de 6 dígitos");
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // First, check if the session exists
      const checkResponse = await fetch(
        `http://localhost:3000/api/game-sessions/${gameCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!checkResponse.ok) {
        throw new Error(
          "Código de sesión no válido o la sesión ya no está activa"
        );
      }

      const sessionData = await checkResponse.json();

      // Join the session
      const joinResponse = await fetch(
        `http://localhost:3000/api/game-sessions/${gameCode}/join`,
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
        const errorData = await joinResponse.json();
        throw new Error(errorData.message || "Error al unirse a la sesión");
      }
      setSuccess("¡Te has unido al quiz exitosamente!");
      setJoinedSession(sessionData);

      // Auto-redirect to quiz after joining successfully
      setTimeout(() => {
        navigate(`/live-quiz/${gameCode}`);
      }, 2000);
    } catch (err) {
      setError(err.message || "Error al unirse al quiz");
      console.error("Error joining quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-quiz-container">
      <h1>Unirse a un Quiz</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}{" "}
      {!joinedSession ? (
        <div className="join-form">
          <h2>Introduce el código del quiz</h2>
          <form onSubmit={handleJoinQuiz}>
            <div className="code-input-group">
              <div className="code-input-wrapper">
                <input
                  type="text"
                  className="code-input"
                  value={gameCode}
                  onChange={e => {
                    // Only allow uppercase letters and numbers
                    const filtered = e.target.value
                      .replace(/[^A-Z0-9]/g, "")
                      .toUpperCase();
                    setGameCode(filtered);
                  }}
                  placeholder="XXXXXX"
                  maxLength={6}
                  autoFocus
                />
                {gameCode && (
                  <button
                    type="button"
                    className="clear-code-button"
                    onClick={() => setGameCode("")}
                    title="Clear code"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="paste-code-container">
                <button
                  type="button"
                  className="paste-code-button"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      const cleanCode = text
                        .trim()
                        .replace(/[^A-Z0-9]/g, "")
                        .toUpperCase()
                        .substring(0, 6);
                      if (cleanCode) {
                        setGameCode(cleanCode);
                        setCodeCopied(true);
                        setTimeout(() => setCodeCopied(false), 2000);
                      }
                    } catch (err) {
                      console.error("Failed to paste from clipboard:", err);
                    }
                  }}
                >
                  {codeCopied
                    ? "¡Código pegado!"
                    : "Pegar código del portapapeles"}
                </button>
              </div>
              <button
                type="submit"
                className="join-button"
                disabled={loading || !gameCode || gameCode.length !== 6}
              >
                {loading ? "Uniendo..." : "Unirse al Quiz"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="joined-session">
          <h2>¡Te has unido al quiz!</h2>
          <div className="joined-details">
            <p>
              <strong>Quiz:</strong> {joinedSession.quizName}
            </p>
            <p>
              <strong>Profesor:</strong> {joinedSession.teacherName}
            </p>
            <p>Espera a que el profesor inicie el quiz...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinQuiz;
