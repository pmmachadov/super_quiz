import React, { useEffect, useRef } from "react";

const ScorePercentage = ({ score, total }) => {
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
    <>
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
    </>
  );
};

export default ScorePercentage;