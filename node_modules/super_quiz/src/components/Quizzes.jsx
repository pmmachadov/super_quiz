import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import BubbleEffect from "./BubbleEffect";
import { getApiBaseUrl } from "../utils/apiConfig";
import "./Quizzes.css";

const globalQuizzesCache = {
  data: null,
  timestamp: 0,
};
const CACHE_DURATION = 10 * 60 * 1000;

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState(globalQuizzesCache.data || []);
  const [isVisible] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(!globalQuizzesCache.data);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchQuizzes = useCallback(async () => {
    if (
      globalQuizzesCache.data &&
      Date.now() - globalQuizzesCache.timestamp < CACHE_DURATION
    ) {
      setQuizzes(globalQuizzesCache.data);
      setIsLoading(false);
      setError(null);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);

      let data;
      const baseUrl = getApiBaseUrl();

      const response = await fetch(`${baseUrl}/api/quizzes`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      data = await response.json();

      let processedData = [];
      if (Array.isArray(data)) {
        processedData = data;
      } else if (data?.quizzes && Array.isArray(data.quizzes)) {
        processedData = data.quizzes;
      }

      globalQuizzesCache.data = processedData;
      globalQuizzesCache.timestamp = Date.now();

      setQuizzes(processedData);
      setIsLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching quizzes:", error);

      if (globalQuizzesCache.data) {
        setQuizzes(globalQuizzesCache.data);
        setError(
          "Usando datos en caché (los datos podrían no estar actualizados)"
        );
      } else {
        setError(`Error cargando quizzes: ${error.message}`);
        setQuizzes([]);
      }

      setIsLoading(false);
    }
  }, []);

  const deleteQuiz = async quizId => {
    try {
      setIsDeleting(true);

      if (import.meta.env.PROD) {
        setQuizzes(prevQuizzes =>
          prevQuizzes.filter(quiz => quiz._id !== quizId)
        );

        if (globalQuizzesCache.data) {
          globalQuizzesCache.data = globalQuizzesCache.data.filter(
            quiz => quiz._id !== quizId
          );
        }

        setDeleteConfirm(null);
        return;
      }

      const baseUrl = getApiBaseUrl();

      const response = await fetch(`${baseUrl}/api/quizzes/${quizId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      setQuizzes(prevQuizzes =>
        prevQuizzes.filter(quiz => quiz._id !== quizId)
      );

      if (globalQuizzesCache.data) {
        globalQuizzesCache.data = globalQuizzesCache.data.filter(
          quiz => quiz._id !== quizId
        );
      }

      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      setError(`Error deleting quiz: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (quizId, quizTitle) => {
    setDeleteConfirm({ id: quizId, title: quizTitle });
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  useEffect(() => {
    if (globalQuizzesCache.data) {
      setQuizzes(globalQuizzesCache.data);
      setIsLoading(false);

      if (Date.now() - globalQuizzesCache.timestamp > 5 * 60 * 1000) {
        fetchQuizzes();
      }
    } else {
      fetchQuizzes();
    }
  }, [fetchQuizzes]);

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === "Escape" && deleteConfirm) {
        cancelDelete();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [deleteConfirm]);

  if (isLoading) {
    return (
      <div className="quizzes-container fade-in">
        <h1 className="page-title">Available Quizzes</h1>
        <div className="quizzes-loading">
          <div className="loading-spinner"></div>
          <p>Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`quizzes-container ${isVisible ? "fade-in" : ""}`}>
      <h1 className="page-title">Available Quizzes</h1>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={fetchQuizzes}
          >
            Retry
          </button>
        </div>
      )}

      {deleteConfirm && (
        <div
          className="delete-confirm-overlay"
          onClick={e => {
            if (e.target.className === "delete-confirm-overlay") {
              cancelDelete();
            }
          }}
        >
          <div className="delete-confirm-modal">
            <h3>Delete Quiz</h3>
            <p>
              Are you sure you want to delete the quiz "
              <strong>{deleteConfirm.title}</strong>"?
            </p>
            <p className="delete-warning">
              This action cannot be undone and all results associated with this
              quiz will be affected.
            </p>

            <div className="delete-confirm-actions">
              <button
                className="delete-cancel-btn"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="delete-confirm-btn"
                onClick={() => deleteQuiz(deleteConfirm.id)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}

      {!error && quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h2 className="empty-state-title">No quizzes available yet</h2>
          <p className="empty-state-description">
            Be the first one to create an awesome quiz for others to enjoy!
          </p>
          <button
            className="create-quiz-btn multi-bubble"
            onClick={() => navigate("/create-quiz")}
          >
            <div style={{ position: "relative", zIndex: 2 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line
                  x1="12"
                  y1="5"
                  x2="12"
                  y2="19"
                ></line>
                <line
                  x1="5"
                  y1="12"
                  x2="19"
                  y2="12"
                ></line>
              </svg>
              <span>Create Your First Quiz</span>
            </div>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
              }}
            >
              <BubbleEffect />
            </div>
          </button>
        </div>
      ) : (
        !error && (
          <div className="quizzes-grid">
            {quizzes.map(quiz => (
              <div
                key={quiz._id}
                className="quiz-card"
              >
                <div>
                  <h2 className="quiz-title">{quiz.title}</h2>
                  <p className="quiz-description">
                    {quiz.questions.length} questions
                  </p>
                  <div className="quiz-stats">
                    <div className="quiz-stat">
                      <span className="quiz-stat-value">
                        {quiz.questions.length}
                      </span>
                      <span className="quiz-stat-label">Questions</span>
                    </div>
                    <div className="quiz-stat">
                      <span className="quiz-stat-value">👑</span>
                      <span className="quiz-stat-label">Challenge</span>
                    </div>
                  </div>
                </div>
                <div className="quiz-card-actions">
                  <button
                    className="start-quiz-btn multi-bubble"
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                  >
                    <div
                      style={{
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      Start Quiz
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                      </svg>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 1,
                      }}
                    >
                      <BubbleEffect />
                    </div>
                  </button>
                  <button
                    className="delete-quiz-btn multi-bubble"
                    onClick={() => handleDeleteClick(quiz._id, quiz.title)}
                    aria-label="Delete quiz"
                    title="Delete quiz"
                  >
                    <div
                      style={{
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      Delete Quiz
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
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                      </svg>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 1,
                      }}
                    >
                      <BubbleEffect />
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {!error && quizzes.length > 0 && (
        <div className="create-quiz-section">
          <h2 className="create-quiz-title">Create Your Own Quiz</h2>
          <p className="create-quiz-description">
            Share your knowledge and challenge others by creating your own
            interactive quiz!
          </p>
          <button
            className="create-quiz-btn multi-bubble"
            onClick={() => navigate("/create-quiz")}
          >
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line
                  x1="12"
                  y1="5"
                  x2="12"
                  y2="19"
                ></line>
                <line
                  x1="5"
                  y1="12"
                  x2="19"
                  y2="12"
                ></line>
              </svg>
              <span>Create New Quiz</span>
            </div>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
              }}
            >
              <BubbleEffect />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Quizzes;
