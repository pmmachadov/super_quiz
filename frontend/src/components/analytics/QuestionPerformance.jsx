import { useState } from "react";
import PropTypes from "prop-types";
import "./Analytics.css";

const QuestionPerformance = ({ questions }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(
    questions[0]?.id || null
  );

  const selectedQuestionData =
    questions.find((q) => q.id === selectedQuestion) || questions[0];

  const renderPerformanceBar = (percentage) => {
    return (
      <div className="performance-bar-container">
        <div className="performance-bar" style={{ width: `${percentage}%` }}>
          <span className="performance-percentage">{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="question-performance">
      <h2>Question Performance Analysis</h2>

      <div className="question-selector">
        <label htmlFor="question-select">Select Question:</label>
        <div className="select-wrapper">
          <select
            id="question-select"
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(Number(e.target.value))}
            className="themed-select"
          >
            {questions.map((question) => (
              <option key={question.id} value={question.id}>
                {question.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedQuestionData && (
        <div className="question-stats">
          <h3>{selectedQuestionData.title}</h3>

          <div className="stat-row">
            <div className="stat-label">Correct Responses:</div>
            <div className="stat-value">
              {renderPerformanceBar(selectedQuestionData.correctPercentage)}
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-label">Average Response Time:</div>
            <div className="stat-value">
              {selectedQuestionData.avgResponseTime} seconds
            </div>
          </div>

          <div className="performance-chart">
            <div className="chart-bars">
              <div
                className="chart-bar"
                style={{ height: `${selectedQuestionData.correctPercentage}%` }}
              >
                <span className="bar-label">Correct</span>
              </div>
              <div
                className="chart-bar incorrect"
                style={{
                  height: `${100 - selectedQuestionData.correctPercentage}%`,
                }}
              >
                <span className="bar-label">Incorrect</span>
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color correct"></span>
                <span>Correct ({selectedQuestionData.correctPercentage}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color incorrect"></span>
                <span>
                  Incorrect ({100 - selectedQuestionData.correctPercentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

QuestionPerformance.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      correctPercentage: PropTypes.number.isRequired,
      avgResponseTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
};

export default QuestionPerformance;
