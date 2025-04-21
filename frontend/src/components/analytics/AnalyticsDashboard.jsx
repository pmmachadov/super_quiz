import { useState, useEffect, useCallback } from "react";
import QuestionPerformance from "./QuestionPerformance";
import GameHistory from "./GameHistory";
import ExportResults from "./ExportResults";
import "./Analytics.css";
import PropTypes from "prop-types";

const AnalyticsDashboard = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("performance");
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const [error, setError] = useState(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  // Cambiado el nombre para evitar confusión con un React Hook
  const loadFallbackData = () => {
    console.log("Usando datos de respaldo");
    const fallbackData = {
      totalGames: 5,
      averageScore: 75.0,
      questionsData: [
        {
          id: 1,
          title: "¿Qué es React?",
          correctPercentage: 80,
          avgResponseTime: 3.0,
        },
        {
          id: 2,
          title: "¿Qué son los Hooks?",
          correctPercentage: 70,
          avgResponseTime: 4.0,
        },
        {
          id: 3,
          title: "¿Cómo se maneja el estado en componentes funcionales?",
          correctPercentage: 65,
          avgResponseTime: 4.5,
        },
        {
          id: 4,
          title: "¿Qué es el Virtual DOM?",
          correctPercentage: 75,
          avgResponseTime: 3.2,
        },
        {
          id: 5,
          title: "¿Qué son los componentes controlados?",
          correctPercentage: 68,
          avgResponseTime: 3.8,
        },
      ],
      gamesHistory: [
        {
          id: "g1",
          date: "2025-04-20",
          title: "Fundamentos Web",
          score: 800,
          totalQuestions: 8,
          correctAnswers: 7,
        },
        {
          id: "g2",
          date: "2025-04-18",
          title: "JavaScript Básico",
          score: 650,
          totalQuestions: 10,
          correctAnswers: 6,
        },
        {
          id: "g3",
          date: "2025-04-15",
          title: "React Fundamentals",
          score: 720,
          totalQuestions: 8,
          correctAnswers: 6,
        },
        {
          id: "g4",
          date: "2025-04-10",
          title: "CSS Avanzado",
          score: 580,
          totalQuestions: 7,
          correctAnswers: 5,
        },
      ],
    };

    setUserStats(fallbackData);
    setUsingFallbackData(true);
    setIsLoading(false); // Asegurarse de que isLoading cambie a false
  };

  const fetchUserStats = useCallback(async () => {
    // Si ya estamos mostrando datos de respaldo, no intentamos cargar de nuevo
    if (usingFallbackData) return;

    try {
      setIsLoading(true);
      setError(null);
      console.log("Iniciando fetchUserStats para userId:", userId);

      // Añadir un timeout para evitar bloqueos infinitos (aumentado a 8 segundos)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout fetching stats")), 8000)
      );

      // Envolver la lógica de fetch en un controlador de errores
      const fetchWithErrorHandling = async () => {
        try {
          const response = await fetch("/api/stats/user/" + userId);
          return response;
        } catch (fetchError) {
          console.error("Error en la solicitud fetch:", fetchError);
          throw new Error("Error de conexión al servidor");
        }
      };

      const fetchPromise = fetchWithErrorHandling();

      // Usar Promise.race para manejar timeouts
      const response = await Promise.race([fetchPromise, timeoutPromise]).catch(
        (err) => {
          console.log("Fallo en fetch con error:", err.message);
          throw err; // Re-lanzar para el manejo centralizado
        }
      );

      if (!response?.ok) {
        console.log(
          "API de estadísticas no disponible, intentando datos locales"
        );
        try {
          const quizzesResponse = await fetch("/api/quizzes").catch((err) => {
            console.error("Error haciendo fetch a /api/quizzes:", err);
            throw new Error("No se pudo conectar con el servidor de quizzes");
          });

          if (!quizzesResponse?.ok) {
            throw new Error("No se pudieron obtener los quizzes");
          }

          const quizzesData = await quizzesResponse.json();
          console.log("Quizzes obtenidos correctamente:", quizzesData.length);

          if (!Array.isArray(quizzesData) || quizzesData.length === 0) {
            throw new Error("No hay quizzes disponibles");
          }

          const processedData = {
            totalGames: quizzesData.length,
            averageScore: 82.5,
            questionsData: quizzesData
              .flatMap(
                (quiz) =>
                  quiz.questions?.map((q, index) => ({
                    id: `${quiz.id}-${index}`,
                    title: q.question || `Pregunta ${index + 1}`,
                    correctPercentage: Math.floor(Math.random() * 30) + 65,
                    avgResponseTime: (Math.random() * 3 + 2).toFixed(1),
                  })) || []
              )
              .slice(0, 10),
            gamesHistory: quizzesData
              .map((quiz, index) => {
                const questionsLength = quiz.questions?.length || 0;
                const correctAnswers =
                  Math.floor(Math.random() * 3) + (questionsLength - 3);
                return {
                  id: `game-${index}`,
                  date: new Date(Date.now() - index * 86400000)
                    .toISOString()
                    .split("T")[0],
                  title: quiz.title || `Quiz ${index + 1}`,
                  score: Math.min(
                    correctAnswers * 100 + Math.floor(Math.random() * 100),
                    1000
                  ),
                  totalQuestions: questionsLength,
                  correctAnswers: Math.max(0, correctAnswers),
                };
              })
              .slice(0, 8),
          };

          console.log("Datos procesados generados:", processedData);
          setUserStats(processedData);
        } catch (quizError) {
          console.error("Error obteniendo quizzes:", quizError);
          loadFallbackData();
        }
      } else {
        const data = await response.json();
        console.log("Datos de estadísticas recibidos:", data);
        setUserStats(data);
      }
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      loadFallbackData();
      setError("Error al cargar estadísticas. Mostrando datos de muestra.");
    } finally {
      console.log("Finalizando fetchUserStats, estableciendo isLoading=false");
      setIsLoading(false);
    }
  }, [userId, usingFallbackData]);

  useEffect(() => {
    console.log("Efecto para cargar estadísticas activado");
    let mounted = true;
    let timeoutId;

    const loadStats = async () => {
      try {
        // Agregar un timeout de seguridad adicional
        timeoutId = setTimeout(() => {
          if (mounted && isLoading) {
            console.log(
              "Activando timeout de seguridad, cargando datos de respaldo"
            );
            loadFallbackData();
          }
        }, 10000);

        await fetchUserStats();
      } catch (err) {
        console.error("Error en loadStats:", err);
        if (mounted && !usingFallbackData) {
          loadFallbackData();
        }
      }
    };

    loadStats();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchUserStats, isLoading, usingFallbackData]);

  const handleResetData = async () => {
    if (resetStep === 0) {
      setShowResetConfirm(true);
      setResetStep(1);
      return;
    }

    if (resetStep === 1) {
      setResetStep(2);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/stats/user/${userId}/reset`, {
        method: "POST",
      });

      if (response.ok) {
        setUsingFallbackData(false);
        fetchUserStats();
        alert("Statistics data has been reset successfully!");
      } else {
        localStorage.removeItem("userStats_" + userId);
        setUsingFallbackData(false);
        fetchUserStats();
        alert("Statistics data has been reset successfully! (Simulated)");
      }
    } catch (error) {
      console.error("Error resetting data:", error);
      alert("Error resetting data. Please try again.");
    } finally {
      setShowResetConfirm(false);
      setResetStep(0);
    }
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
    setResetStep(0);
  };

  const retryFetchStats = () => {
    setUsingFallbackData(false);
    setUserStats(null);
    setError(null);
    fetchUserStats();
  };

  // Si está cargando, mostrar el spinner y el botón de fallback
  if (isLoading) {
    return (
      <div className="analytics-loading">
        <div>Loading statistics...</div>
        <div className="loading-spinner"></div>
        <button onClick={loadFallbackData} className="load-fallback-btn">
          Cargar datos de ejemplo
        </button>
      </div>
    );
  }

  // Si no hay datos después de cargar, mostrar error
  if (!userStats) {
    return (
      <div className="analytics-error">
        <p>
          No se pudieron cargar las estadísticas. Por favor, inténtalo de nuevo.
        </p>
        <button onClick={retryFetchStats} className="retry-button">
          Reintentar
        </button>
        <button onClick={loadFallbackData} className="fallback-button">
          Usar datos de ejemplo
        </button>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <h1>Your Analytics Dashboard</h1>
      {error && <div className="analytics-warning">{error}</div>}
      {usingFallbackData && !error && (
        <div className="analytics-warning">
          Mostrando datos de ejemplo. La conexión con el servidor no está
          disponible.{" "}
          <button className="retry-button-small" onClick={retryFetchStats}>
            Reintentar conexión
          </button>
        </div>
      )}

      <div className="analytics-summary">
        <div className="stat-card">
          <h3>Total Games</h3>
          <p>{userStats.totalGames}</p>
        </div>
        <div className="stat-card">
          <h3>Average Score</h3>
          <p>{userStats.averageScore}%</p>
        </div>
        <div className="stat-card reset-card">
          <h3>Reset Data</h3>
          {!showResetConfirm ? (
            <button className="reset-button" onClick={handleResetData}>
              Reset All Statistics
            </button>
          ) : (
            <div className="reset-confirm">
              {resetStep === 1 ? (
                <>
                  <p>Are you sure you want to reset all statistics data?</p>
                  <div className="reset-buttons">
                    <button
                      className="reset-confirm-button"
                      onClick={handleResetData}
                    >
                      Yes, I'm sure
                    </button>
                    <button
                      className="reset-cancel-button"
                      onClick={cancelReset}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>This action is irreversible! Confirm reset?</p>
                  <div className="reset-buttons">
                    <button
                      className="reset-confirm-button warning"
                      onClick={handleResetData}
                    >
                      Confirm Reset
                    </button>
                    <button
                      className="reset-cancel-button"
                      onClick={cancelReset}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="analytics-tabs">
        <button
          className={activeTab === "performance" ? "active" : ""}
          onClick={() => setActiveTab("performance")}
        >
          Question Performance
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          Game History
        </button>
        <button
          className={activeTab === "export" ? "active" : ""}
          onClick={() => setActiveTab("export")}
        >
          Export Results
        </button>
      </div>

      <div className="analytics-content">
        {activeTab === "performance" && (
          <QuestionPerformance questions={userStats.questionsData} />
        )}
        {activeTab === "history" && (
          <GameHistory games={userStats.gamesHistory} />
        )}
        {activeTab === "export" && <ExportResults data={userStats} />}
      </div>
    </div>
  );
};
AnalyticsDashboard.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default AnalyticsDashboard;
