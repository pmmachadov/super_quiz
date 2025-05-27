import PropTypes from "prop-types";
import { calculateAccuracy } from "../../utils/calculations";

import "./Analytics.css";

const GameHistory = ({ games }) => {
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  };

  if (!games || games.length === 0) {
    return (
      <div className="game-history">
        <h2>Game History</h2>
        <div className="no-games-message">
          <p>No quizzes available to show.</p>
          <p>Play some quizzes to see historic data here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-history">
      <h2>Game History</h2>

      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Quiz Title</th>
              <th>Score</th>
              <th>Correct / Total</th>
              <th>Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {games.map(game => {
              const accuracy = calculateAccuracy(
                game.correctAnswers,
                game.totalQuestions
              );
              return (
                <tr key={game.id}>
                  <td>{formatDate(game.date)}</td>
                  <td>{game.title}</td>
                  <td>{game.score}</td>
                  <td>{`${game.correctAnswers} / ${game.totalQuestions}`}</td>
                  <td>
                    <div className="mini-progress-bar">
                      <div
                        className="mini-progress-fill"
                        style={{ width: `${accuracy}%` }}
                      ></div>
                      <span>{accuracy}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="history-summary">
        <h3>Performance Trends</h3>
        <div className="trend-chart">
          {games.map(game => {
            const height = (game.score / 1000) * 100;
            return (
              <div
                key={game.id}
                className="trend-bar-container"
              >
                <div
                  className="trend-bar"
                  style={{ height: `${height}%` }}
                  title={`${game.title}: ${game.score} points`}
                ></div>
                <span className="trend-label">{formatDate(game.date)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="history-stats">
        <div className="stat-box">
          <h4>Total Points</h4>
          <p>{games.reduce((total, game) => total + game.score, 0)}</p>
        </div>
        <div className="stat-box">
          <h4>Best Score</h4>
          <p>{Math.max(...games.map(game => game.score))}</p>
        </div>
        <div className="stat-box">
          <h4>Average Accuracy</h4>
          <p>
            {calculateAccuracy(
              games.reduce((total, game) => total + game.correctAnswers, 0),
              games.reduce((total, game) => total + game.totalQuestions, 0)
            )}
            %
          </p>
        </div>
      </div>
    </div>
  );
};

GameHistory.propTypes = {
  games: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      totalQuestions: PropTypes.number.isRequired,
      correctAnswers: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default GameHistory;
