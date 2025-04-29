import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const ScorePercentage = ({ score, total }) => {
  const scoreRingRef = useRef(null);

  const scoreNum = parseInt(score, 10) || 0;
  const totalNum = parseInt(total, 10) || 1;

  const exactPercentage = (scoreNum / totalNum) * 100;
  const roundedPercentage = Math.round(exactPercentage);

  useEffect(() => {}, [scoreNum, totalNum, exactPercentage, roundedPercentage]);

  const getResultInfo = () => {
    if (roundedPercentage >= 90) {
      return {
        title: "Excellent!",
        message: "You are a true master of this subject.",
        emoji: "🏆",
        className: "excellent",
        color: "#f5c518",
        gradientColors: ["#ff9900", "#ffcc00", "#ffeb3b", "#ffd700", "#ffa500"],
      };
    } else if (roundedPercentage >= 70) {
      return {
        title: "Very Good!",
        message: "You have a good understanding of this topic.",
        emoji: "",
        className: "good",
        color: "#4caf50",
        gradientColors: ["#4caf50", "#8bc34a", "#00e676", "#69f0ae", "#00c853"],
      };
    } else if (roundedPercentage >= 50) {
      return {
        title: "Good Try",
        message: "There's room for improvement on this topic.",
        emoji: "👍",
        className: "average",
        color: "#2196f3",
        gradientColors: ["#2196f3", "#03a9f4", "#00bcd4", "#80deea", "#29b6f6"],
      };
    } else {
      return {
        title: "Keep Trying",
        message: "Practice makes perfect. Don't give up!",
        emoji: "💪",
        className: "needs-practice",
        color: "#ff5722",
        gradientColors: ["#ff5722", "#ff7043", "#ff9800", "#ffab91", "#ff6e40"],
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

      document.documentElement.style.setProperty(
        "--gradient-color-1",
        resultInfo.gradientColors[0]
      );
      document.documentElement.style.setProperty(
        "--gradient-color-2",
        resultInfo.gradientColors[1]
      );
      document.documentElement.style.setProperty(
        "--gradient-color-3",
        resultInfo.gradientColors[2]
      );
      document.documentElement.style.setProperty(
        "--gradient-color-4",
        resultInfo.gradientColors[3]
      );
      document.documentElement.style.setProperty(
        "--gradient-color-5",
        resultInfo.gradientColors[4]
      );
    }
  }, [roundedPercentage, resultInfo.color, resultInfo.gradientColors]);

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
            <div className="animated-gradient-background"></div>
            <div className="score-value">{roundedPercentage}%</div>
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

ScorePercentage.propTypes = {
  score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ScorePercentage;
