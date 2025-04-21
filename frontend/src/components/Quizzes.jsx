import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import BubbleEffect from "./BubbleEffect";
import "./Quizzes.css";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5173/api/quizzes");
        const data = await response.json();
        setQuizzes(data);
        setLoading(false);

        setTimeout(() => {
          setIsVisible(true);
        }, 100);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setLoading(false);
        setIsVisible(true);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="quizzes-container">
        <h1 className="page-title">Available Quizzes</h1>
        <div
          className="loading-spinner"
          style={{ margin: "2rem auto", display: "block" }}
        ></div>
      </div>
    );
  }

  return (
    <div className={`quizzes-container ${isVisible ? "fade-in" : ""}`}>
      <h1 className="page-title">Available Quizzes</h1>

      {quizzes.length === 0 ? (
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
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
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
        <div className="quizzes-grid">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
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
              <button
                className="start-quiz-btn multi-bubble"
                onClick={() => navigate(`/quiz/${quiz.id}`)}
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
            </div>
          ))}
        </div>
      )}

      {quizzes.length > 0 && (
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
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
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
