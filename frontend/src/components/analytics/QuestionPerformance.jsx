import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import "./Analytics.css";

let globalQuizzes = null;
let quizzesTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000;

const fallbackQuestions = [
  {
    id: 1,
    title: "¿Qué es HTML?",
    correctPercentage: 75,
    avgResponseTime: 2.5,
  },
  {
    id: 2,
    title: "¿Qué es CSS?",
    correctPercentage: 68,
    avgResponseTime: 3.2,
  },
  {
    id: 3,
    title: "¿Qué es JavaScript?",
    correctPercentage: 60,
    avgResponseTime: 4.0,
  },
  {
    id: 4,
    title: "¿Qué es React?",
    correctPercentage: 55,
    avgResponseTime: 4.5,
  },
  {
    id: 5,
    title: "¿Qué son los componentes en React?",
    correctPercentage: 72,
    avgResponseTime: 3.8,
  },
];

const QuestionPerformance = ({ questions: initialQuestions }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [questions, setQuestions] = useState(initialQuestions || []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      setQuestions(initialQuestions);
      setIsLoading(false);
      return;
    }

    if (globalQuizzes && Date.now() - quizzesTimestamp < CACHE_DURATION) {
      processAndSetQuestions(globalQuizzes);
      return;
    }

    fetchQuizzes();
  }, [initialQuestions]);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch("/api/quizzes", {
        cache: "no-cache",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No se recibieron quizzes válidos");
      }

      globalQuizzes = data;
      quizzesTimestamp = Date.now();
      setQuizzes(data);

      processAndSetQuestions(data);
    } catch (error) {
      setError(`Error al cargar preguntas: ${error.message}`);
      loadFallbackData();
    }
  };

  const processAndSetQuestions = (quizzesData) => {
    try {
      const processedQuestions = processQuizzesToQuestions(quizzesData);
      setQuestions(processedQuestions);
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError("Error procesando datos de quizzes");
      loadFallbackData();
    }
  };

  const processQuizzesToQuestions = (quizzes) => {
    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      return [];
    }

    let allQuestions = [];
    try {
      allQuestions = quizzes
        .flatMap((quiz) => {
          if (!quiz.questions) {
            return [];
          }
          return quiz.questions.map((q, index) => {
            return {
              id: `${quiz.id}-${index}`,
              title: q.question || `Question ${index + 1}`,
              correctPercentage: Math.floor(Math.random() * 30) + 65,
              avgResponseTime: (Math.random() * 3 + 2).toFixed(1),
            };
          });
        })
        .slice(0, 20);
    } catch (err) {
      return [];
    }
    return allQuestions.length > 0 ? allQuestions : fallbackQuestions;
  };

  const loadFallbackData = () => {
    setQuestions(fallbackQuestions);
    setIsLoading(false);
  };

  const retryFetch = () => {
    fetchQuizzes();
  };

  useEffect(() => {
    if (questions.length > 0 && selectedQuestion >= questions.length) {
      setSelectedQuestion(0);
    }
  }, [questions, selectedQuestion]);

  const questionStats = useMemo(() => {
    if (!questions?.length || selectedQuestion >= questions.length) {
      return {
        title: "No data available",
        correctPercentage: 0,
        avgResponseTime: 0,
      };
    }
    return questions[selectedQuestion];
  }, [questions, selectedQuestion]);

  const chartData = useMemo(() => {
    if (!questions?.length) return [];

    return questions.slice(0, 7).map((q) => ({
      id: q.id,
      title: q.title.length > 30 ? q.title.substring(0, 27) + "..." : q.title,
      correctPercentage: q.correctPercentage,
      incorrectPercentage: 100 - q.correctPercentage,
    }));
  }, [questions]);

  const performanceTips = useMemo(() => {
    if (!questions?.length) {
      return ["No hay datos suficientes para generar consejos."];
    }

    const tips = [];
    const avgCorrect =
      questions.reduce((sum, q) => sum + q.correctPercentage, 0) /
      questions.length;

    if (avgCorrect < 70) {
      tips.push(
        "La tasa promedio de respuestas correctas es baja. Considera revisar los temas con mayor dificultad."
      );
    }

    const lowPerformanceCount = questions.reduce(
      (count, q) => count + (q.correctPercentage < 60 ? 1 : 0),
      0
    );
    if (lowPerformanceCount > 0) {
      tips.push(
        `Hay ${lowPerformanceCount} preguntas con menos del 60% de aciertos. Enfócate en estos temas para mejorar.`
      );
    }

    const hasSlow = questions.some((q) => parseFloat(q.avgResponseTime) > 4.0);
    if (hasSlow) {
      tips.push(
        "En algunas preguntas el tiempo de respuesta es alto. Practica para mejorar tu velocidad de respuesta."
      );
    }

    return tips.length
      ? tips
      : [
          "¡Buen trabajo! Tu rendimiento general es bueno. Sigue practicando para mantener tu nivel.",
        ];
  }, [questions]);

  if (isLoading) {
    return (
      <div className="question-performance">
        <h2>Question Performance</h2>
        <div className="analytics-loading">
          <div>Cargando datos de preguntas...</div>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!questions?.length) {
    return (
      <div className="question-performance">
        <h2>Question Performance</h2>
        <div className="no-data-message">
          No hay datos de preguntas disponibles para analizar.
          {error && <p className="error-message">{error}</p>}
          <button onClick={retryFetch}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="question-performance">
      <h2>Question Performance</h2>
      {error && <div className="analytics-warning">{error}</div>}

      <div className="question-selector">
        <div className="select-wrapper">
          <select
            className="themed-select"
            value={selectedQuestion}
            onChange={(e) => {
              setSelectedQuestion(Number(e.target.value));
            }}
          >
            {questions.slice(0, 100).map((q, index) => (
              <option key={q.id || `question-${index}`} value={index}>
                {q.title.length > 50
                  ? q.title.substring(0, 47) + "..."
                  : q.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="question-stats">
        <div className="stat-row">
          <div className="stat-label">Correct Percentage</div>
          <div className="stat-value">
            <div className="performance-bar-container">
              <div
                className="performance-bar"
                style={{ width: `${questionStats.correctPercentage}%` }}
              >
                {questionStats.correctPercentage}%
              </div>
            </div>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-label">Average Response Time</div>
          <div className="stat-value">
            {questionStats.avgResponseTime} seconds
          </div>
        </div>
      </div>

      <div className="performance-chart">
        <h3>Comparison with Other Questions</h3>
        <div className="chart-bars">
          {chartData.map((item) => (
            <div
              key={item.id || `chart-item-${item.title}`}
              className="chart-bar-column"
              style={{ flex: 1, maxWidth: `${100 / chartData.length}%` }}
            >
              <div
                className="chart-bar"
                style={{ height: `${item.correctPercentage}%` }}
              ></div>
              <div
                className="chart-bar incorrect"
                style={{ height: `${item.incorrectPercentage}%` }}
              ></div>
              <div className="bar-label">{item.title}</div>
            </div>
          ))}
        </div>

        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color correct"></div>
            <div>Correct</div>
          </div>
          <div className="legend-item">
            <div className="legend-color incorrect"></div>
            <div>Incorrect</div>
          </div>
        </div>
      </div>

      <div className="performance-tips">
        <h4>Performance Tips</h4>
        <ul>
          {performanceTips.map((tip) => (
            <li key={`tip-${tip.substring(0, 15).replace(/\s/g, "")}`}>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

QuestionPerformance.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      correctPercentage: PropTypes.number.isRequired,
      avgResponseTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ),
};

export default QuestionPerformance;
