import React, { useState, useEffect } from 'react';

const ProgressChart = ({ data, title, type = 'line' }) => {
  // Simple ASCII-style chart for now - could be replaced with proper charting library
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="progress-chart">
      <h4 className="chart-title">{title}</h4>
      <div className="chart-container">
        {data.map((point, index) => (
          <div key={index} className="chart-bar">
            <div 
              className="bar-fill" 
              style={{ 
                height: `${(point.value / maxValue) * 100}%`,
                backgroundColor: point.color || '#4CAF50'
              }}
              title={`${point.label}: ${point.value}`}
            />
            <div className="bar-label">{point.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, color = '#2196F3' }) => (
  <div className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
    <div className="stat-header">
      <span className="stat-icon">{icon}</span>
      <span className="stat-title">{title}</span>
    </div>
    <div className="stat-value">{value}</div>
    {trend && (
      <div className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
        {trend > 0 ? '↗️' : '↘️'} {Math.abs(trend)}%
      </div>
    )}
  </div>
);

const DeckProgress = ({ deck, progress }) => {
  const getRetentionColor = (retention) => {
    if (retention >= 90) return '#4CAF50';
    if (retention >= 75) return '#8BC34A';
    if (retention >= 60) return '#FFC107';
    if (retention >= 40) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="deck-progress">
      <div className="deck-info">
        <h4 className="deck-name" style={{ color: deck.color }}>{deck.name}</h4>
        <div className="deck-metrics">
          <span className="metric">
            <strong>{progress.totalCards}</strong> cards
          </span>
          <span className="metric">
            <strong>{progress.matureCards}</strong> mature
          </span>
          <span className="metric">
            <strong>{progress.accuracy}%</strong> accuracy
          </span>
        </div>
      </div>
      
      <div className="progress-visualization">
        <div className="card-distribution">
          <div className="distribution-bar">
            <div 
              className="bar-segment new-cards" 
              style={{ width: `${(progress.newCards / progress.totalCards) * 100}%` }}
              title={`${progress.newCards} new cards`}
            />
            <div 
              className="bar-segment learning-cards" 
              style={{ width: `${(progress.learningCards / progress.totalCards) * 100}%` }}
              title={`${progress.learningCards} learning cards`}
            />
            <div 
              className="bar-segment mature-cards" 
              style={{ width: `${(progress.matureCards / progress.totalCards) * 100}%` }}
              title={`${progress.matureCards} mature cards`}
            />
          </div>
          <div className="distribution-legend">
            <span className="legend-item new">New</span>
            <span className="legend-item learning">Learning</span>
            <span className="legend-item mature">Mature</span>
          </div>
        </div>
        
        <div className="retention-indicator">
          <div 
            className="retention-circle" 
            style={{ 
              background: `conic-gradient(${getRetentionColor(progress.accuracy)} ${progress.accuracy * 3.6}deg, #eee 0deg)` 
            }}
          >
            <div className="retention-text">
              {progress.accuracy}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudyCalendar = ({ studyData }) => {
  const today = new Date();
  const daysToShow = 30;
  const days = [];
  
  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = studyData[dateStr] || { reviews: 0, newCards: 0 };
    
    days.push({
      date: dateStr,
      day: date.getDate(),
      reviews: dayData.reviews,
      newCards: dayData.newCards,
      intensity: Math.min((dayData.reviews + dayData.newCards) / 20, 1) // Normalize to 0-1
    });
  }
  
  const getIntensityColor = (intensity) => {
    if (intensity === 0) return '#eee';
    if (intensity < 0.25) return '#c6e48b';
    if (intensity < 0.5) return '#7bc96f';
    if (intensity < 0.75) return '#239a3b';
    return '#196127';
  };
  
  return (
    <div className="study-calendar">
      <h4>Study Activity (Last 30 Days)</h4>
      <div className="calendar-grid">
        {days.map((day, index) => (
          <div 
            key={index}
            className="calendar-day" 
            style={{ backgroundColor: getIntensityColor(day.intensity) }}
            title={`${day.date}: ${day.reviews} reviews, ${day.newCards} new cards`}
          >
            <span className="day-number">{day.day}</span>
          </div>
        ))}
      </div>
      <div className="calendar-legend">
        <span>Less</span>
        <div className="legend-scale">
          {[0, 0.25, 0.5, 0.75, 1].map(intensity => (
            <div 
              key={intensity}
              className="legend-square" 
              style={{ backgroundColor: getIntensityColor(intensity) }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

const ProgressDashboard = ({ onBack }) => {
  const [overallStats, setOverallStats] = useState(null);
  const [deckProgress, setDeckProgress] = useState([]);
  const [studyHistory, setStudyHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week'); // week, month, all

  useEffect(() => {
    loadProgressData();
  }, [timeRange]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.PROD 
        ? "https://backend-supersquiz.onrender.com" 
        : "";

      // Load overall stats
      const statsResponse = await fetch(`${baseUrl}/api/spaced-repetition/progress/overall?range=${timeRange}`);
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setOverallStats(stats);
      }

      // Load deck progress
      const decksResponse = await fetch(`${baseUrl}/api/spaced-repetition/progress/decks`);
      if (decksResponse.ok) {
        const decks = await decksResponse.json();
        setDeckProgress(decks);
      }

      // Load study history
      const historyResponse = await fetch(`${baseUrl}/api/spaced-repetition/progress/history?days=30`);
      if (historyResponse.ok) {
        const history = await historyResponse.json();
        setStudyHistory(history);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="progress-loading">
        <div className="loading-spinner"></div>
        <p>Loading progress data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-error">
        <h3>Error Loading Progress</h3>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={loadProgressData} className="retry-btn">Retry</button>
          <button onClick={onBack} className="back-btn">Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h2>📊 Learning Progress</h2>
          <p>Track your spaced repetition learning journey</p>
        </div>
        
        <div className="header-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="all">All Time</option>
          </select>
          <button onClick={onBack} className="back-btn">← Back</button>
        </div>
      </div>

      {overallStats && (
        <div className="stats-overview">
          <StatCard 
            title="Total Reviews"
            value={overallStats.totalReviews.toLocaleString()}
            icon="🔄"
            trend={overallStats.reviewsTrend}
            color="#2196F3"
          />
          <StatCard 
            title="Average Accuracy"
            value={`${overallStats.averageAccuracy}%`}
            icon="🎯"
            trend={overallStats.accuracyTrend}
            color="#4CAF50"
          />
          <StatCard 
            title="Study Streak"
            value={`${overallStats.studyStreak} days`}
            icon="🔥"
            color="#FF9800"
          />
          <StatCard 
            title="Cards Mastered"
            value={overallStats.matureCards}
            icon="⭐"
            trend={overallStats.masteredTrend}
            color="#9C27B0"
          />
        </div>
      )}

      <div className="dashboard-content">
        <div className="left-column">
          <StudyCalendar studyData={studyHistory} />
          
          {overallStats && overallStats.accuracyHistory && (
            <ProgressChart 
              title="Accuracy Over Time"
              data={overallStats.accuracyHistory.map((point, index) => ({
                label: point.date,
                value: point.accuracy,
                color: '#4CAF50'
              }))}
            />
          )}
        </div>
        
        <div className="right-column">
          <div className="deck-progress-section">
            <h3>Deck Progress</h3>
            {deckProgress.length > 0 ? (
              <div className="deck-progress-list">
                {deckProgress.map((item, index) => (
                  <DeckProgress 
                    key={item.deck.id || index}
                    deck={item.deck}
                    progress={item.progress}
                  />
                ))}
              </div>
            ) : (
              <p>No deck progress data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;