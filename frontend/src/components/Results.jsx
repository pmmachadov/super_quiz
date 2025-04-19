import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import "./Results.css";

const Results = () => {
  const { score, total } = useParams();
  const [isVisible, setIsVisible] = useState(false);
  const scoreRingRef = useRef(null);

  const percentage = Math.round((parseInt(score) / parseInt(total)) * 100);

  const getResultInfo = () => {
    if (percentage >= 90) {
      return {
        title: "Excellent!",
        message: "You are a true master of this subject.",
        emoji: "🏆",
        className: "excellent",
        color: "#f5c518",
      };
    } else if (percentage >= 70) {
      return {
        title: "Very Good!",
        message: "You have a good understanding of this topic.",
        emoji: "",
        className: "good",
        color: "#4caf50",
      };
    } else if (percentage >= 50) {
      return {
        title: "Good Try",
        message: "There's room for improvement on this topic.",
        emoji: "👍",
        className: "average",
        color: "#2196f3",
      };
    } else {
      return {
        title: "Keep Trying",
        message: "Practice makes perfect. Don't give up!",
        emoji: "💪",
        className: "needs-practice",
        color: "#ff5722",
      };
    }
  };

  const resultInfo = getResultInfo();

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 300);

    if (scoreRingRef.current) {
      document.documentElement.style.setProperty(
        "--score-percentage",
        percentage
      );
      document.documentElement.style.setProperty(
        "--score-color",
        resultInfo.color
      );
    }
  }, [percentage, resultInfo.color]);

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <div className={`results-container ${isVisible ? "fade-in" : ""}`}>
        <div className="results-header">
          <div className="results-emoji">{resultInfo.emoji}</div>
          <h1
            className={`results-title ${resultInfo.className}`}
            data-text={resultInfo.title}
          >
            {resultInfo.title}
          </h1>
          <p className="results-message">{resultInfo.message}</p>
        </div>

        <div className="score-container">
          <div
            ref={scoreRingRef}
            className={`score-ring ${resultInfo.className}`}
          >
            <div className="score-inner-circle">
              <div className="score-value">{percentage}%</div>
              <div className="score-label">Score</div>
            </div>
          </div>
          <div className="score-details">
            <div className="score-item">
              <span className="score-label">Correct answers:</span>
              <span className="score-number">{score}</span>
            </div>
            <div className="score-item">
              <span className="score-label">Total questions:</span>
              <span className="score-number">{total}</span>
            </div>
          </div>
        </div>

        <div className="results-actions">
          <Link to="/quizzes" className="action-button primary">
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
              <polyline points="9 17 4 12 9 7"></polyline>
              <path d="M20 12H4"></path>
            </svg>
            Back to Quizzes
          </Link>
          <Link to="/" className="action-button secondary">
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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;
