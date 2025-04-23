import React, { useState, useEffect, useCallback, memo } from "react";
import QuestionPerformance from "./QuestionPerformance";
import GameHistory from "./GameHistory";
import ExportResults from "./ExportResults";
import "./Analytics.css";

const StatsCard = ({ title, value, icon }) => (
  <div className="stats-card">
    <div className="stats-card-header">
      <div className="stats-card-title">{title}</div>
      <div className="stats-card-icon">{icon}</div>
    </div>
    <div className="stats-card-value">{value}</div>
  </div>
);

const NoDataState = ({ message, retryFn }) => (
  <div className="analytics-no-data">
    <div className="no-data-icon">📊</div>
    <h3>No Analytics Data Available</h3>
    <p>{message}</p>
    <button onClick={retryFn} className="retry-button">
      Retry
    </button>
  </div>
);

const LoadingState = () => (
  <div className="analytics-loading-container">
    <div className="analytics-loading">
      <div className="quiz-loader-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v4M12 18v4M4 12H2M22 12h-2M19.07 4.93l-2.82 2.82M19.07 19.07l-2.82-2.82M4.93 19.07l2.82-2.82M4.93 4.93l2.82 2.82"></path>
        </svg>
        <div className="quiz-loader-pulse"></div>
      </div>
    </div>
    <div className="loader-text">Loading statistics...</div>
  </div>
);

const MemoizedQuestionPerformance = memo(QuestionPerformance);
const MemoizedGameHistory = memo(GameHistory);
const MemoizedExportResults = memo(ExportResults);

const AnalyticsDashboard = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("performance");
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try the new API endpoint first
      const response = await fetch("http://localhost:5173/api/analytics", {
        cache: "no-cache",
      });

      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
        setIsLoading(false);
        return true;
      }

      // Try legacy endpoint as fallback
      try {
        const legacyResponse = await fetch(
          "http://localhost:5173/api/game-results/analytics",
          {
            cache: "no-cache",
          }
        );

        if (legacyResponse.ok) {
          const legacyData = await legacyResponse.json();
          if (legacyData && typeof legacyData === "object") {
            setUserStats(legacyData);
            setError(null);
            setIsLoading(false);
            return true;
          }
        }
      } catch (legacyError) {
        console.error("Error fetching from legacy endpoint:", legacyError);
      }

      // If all API attempts fail
      setError(
        "Could not load analytics data. Please ensure the server is running."
      );
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError("Failed to fetch analytics data. Please try again later.");
      setIsLoading(false);
      return false;
    }
  }, [userId]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!mounted) return;
      await fetchAnalytics();
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [fetchAnalytics]);

  const handleResetData = async () => {
    if (resetStep === 0) {
      setShowResetConfirm(true);
      setResetStep(1);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:5173/api/game-results/reset",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        setUserStats(null);
        setShowResetConfirm(false);
        setResetStep(0);
        await fetchAnalytics();
      } else {
        setError("Failed to reset data");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error resetting data:", error);
      setError("Error resetting data");
      setIsLoading(false);
    }
  };

  const handleCancelReset = () => {
    setShowResetConfirm(false);
    setResetStep(0);
  };

  const renderTabContent = () => {
    if (!userStats) {
      return (
        <NoDataState
          message="No game data has been recorded yet. Play some quizzes to see analytics!"
          retryFn={fetchAnalytics}
        />
      );
    }

    switch (activeTab) {
      case "performance":
        return (
          <MemoizedQuestionPerformance
            questions={userStats.questionsData}
            isLoading={isLoading}
            error={error}
          />
        );
      case "history":
        return (
          <MemoizedGameHistory
            games={userStats.gamesHistory}
            isLoading={isLoading}
            error={error}
          />
        );
      case "export":
        return <MemoizedExportResults data={userStats} />;
      default:
        return <div>Select a tab to view analytics</div>;
    }
  };

  if (isLoading && !userStats) {
    return <LoadingState />;
  }

  return (
    <div className="analytics-dashboard">
      <h1 className="analytics-title">Analytics Dashboard</h1>

      {error && <div className="analytics-error-message">{error}</div>}

      {userStats && (
        <div className="stats-cards">
          <StatsCard
            title="Games Played"
            value={userStats.totalGames}
            icon="🎮"
          />
          <StatsCard
            title="Avg. Score"
            value={`${userStats.averageScore}%`}
            icon="📊"
          />
          <StatsCard
            title="Questions"
            value={userStats.questionsData?.length || 0}
            icon="❓"
          />
        </div>
      )}

      <div className="analytics-tabs">
        <button
          className={`tab-button ${
            activeTab === "performance" ? "active" : ""
          }`}
          onClick={() => setActiveTab("performance")}
        >
          Performance
        </button>
        <button
          className={`tab-button ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
        <button
          className={`tab-button ${activeTab === "export" ? "active" : ""}`}
          onClick={() => setActiveTab("export")}
        >
          Export
        </button>

        <button
          className="reset-data-button"
          onClick={handleResetData}
          aria-label="Reset Data"
        >
          {!showResetConfirm ? (
            <span>Reset Data</span>
          ) : (
            <span>Confirm Reset</span>
          )}
        </button>

        {showResetConfirm && (
          <button
            className="cancel-reset-button"
            onClick={handleCancelReset}
            aria-label="Cancel Reset"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default AnalyticsDashboard;
