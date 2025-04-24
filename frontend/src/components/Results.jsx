import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import BubbleEffect from "./BubbleEffect";
import ScorePercentage from "./ScorePercentage";
import "./Results.css";

const Results = () => {
  const { score, total } = useParams();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 300);
  }, []);

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <div className={`results-container ${isVisible ? "fade-in" : ""}`}>
        <ScorePercentage score={score} total={total} />

        <div className="results-actions">
          <Link to="/quizzes" className="action-button primary multi-bubble">
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
            <BubbleEffect />
          </Link>
          <Link to="/" className="action-button secondary multi-bubble">
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
            <BubbleEffect />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;
