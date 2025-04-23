import React, { useEffect, useRef } from "react";

const ScorePercentage = ({ score, total }) => {
  const scoreRingRef = useRef(null);
  
  const scoreNum = parseInt(score, 10) || 0;
  const totalNum = parseInt(total, 10) || 1;
  
  const exactPercentage = (scoreNum / totalNum) * 100;
  const roundedPercentage = Math.round(exactPercentage);
  
  useEffect(() => {
  }, [scoreNum, totalNum, exactPercentage, roundedPercentage]);

  const getResultInfo = () => {
    if (roundedPercentage >= 90) {
      return {
        title: "Excellent!",
        message: "You are a true master of this subject.",
        emoji: "🏆",
        className: "excellent",
        color: "#f5c518",
      };
    } else if (roundedPercentage >= 70) {
      return {
        title: "Very Good!",
        message: "You have a good understanding of this topic.",
        emoji: "",
        className: "good",
        color: "#4caf50",
      };
    } else if (roundedPercentage >= 50) {
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
        roundedPercentage
      );
      document.documentElement.style.setProperty(
        "--score-color",
        resultInfo.color
      );
    }
  }, [roundedPercentage, resultInfo.color]);

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
            <div className="score-value">{roundedPercentage}%</div>
            <div className="score-label">Score</div>
          </div>
        </div>
        <div className="score-details">
          <div className="score-item">
            <span className="score-label">Correct answers:</span>
            <span className="score-number">{scoreNum}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Total questions:</span>
            <span className="score-number">{totalNum}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScorePercentage;