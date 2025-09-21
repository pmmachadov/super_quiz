import React, { useState, useEffect } from 'react';

const DeckCard = ({ deck, stats, onStartStudy }) => {
  const getProgressColor = (accuracy) => {
    if (accuracy >= 80) return '#4CAF50';
    if (accuracy >= 60) return '#FF9800';
    return '#F44336';
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="deck-card" style={{ borderLeft: `4px solid ${deck.color}` }}>
      <div className="deck-header">
        <h3 className="deck-title">{deck.name}</h3>
        <div className="deck-meta">
          <span className="deck-difficulty">
            {getDifficultyIcon(deck.difficulty)} {deck.difficulty}
          </span>
          <span className="deck-category">{deck.category}</span>
        </div>
      </div>
      
      <p className="deck-description">{deck.description}</p>
      
      <div className="deck-stats">
        <div className="stat-group">
          <div className="stat-row">
            <span className="stat-label">Total Cards:</span>
            <span className="stat-value">{stats.totalCards}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Due for Review:</span>
            <span className="stat-value due-cards">{stats.dueCards}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">New Cards:</span>
            <span className="stat-value new-cards">{stats.newCards}</span>
          </div>
        </div>
        
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${(stats.totalCards - stats.newCards) / stats.totalCards * 100}%`,
                backgroundColor: getProgressColor(stats.accuracy)
              }}
            />
          </div>
          <span className="accuracy-text">
            {stats.accuracy}% accuracy
          </span>
        </div>
      </div>
      
      <div className="deck-actions">
        <button 
          className="study-btn primary"
          onClick={() => onStartStudy(deck, { reviewMode: 'mixed' })}
          disabled={stats.dueCards === 0 && stats.newCards === 0}
        >
          📖 Study ({stats.dueCards + stats.newCards})
        </button>
        <button 
          className="study-btn secondary"
          onClick={() => onStartStudy(deck, { reviewMode: 'new' })}
          disabled={stats.newCards === 0}
        >
          ✨ New Cards ({stats.newCards})
        </button>
        <button 
          className="study-btn secondary"
          onClick={() => onStartStudy(deck, { reviewMode: 'due' })}
          disabled={stats.dueCards === 0}
        >
          🔄 Review ({stats.dueCards})
        </button>
      </div>
    </div>
  );
};

const DecksOverview = ({ onStartStudy, onViewProgress }) => {
  const [decks, setDecks] = useState([]);
  const [deckStats, setDeckStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, due, new
  const [sortBy, setSortBy] = useState('dueCards'); // dueCards, name, progress

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.PROD 
        ? "https://backend-supersquiz.onrender.com" 
        : "http://localhost:3001";

      // Load decks
      const decksResponse = await fetch(`${baseUrl}/api/spaced-repetition/decks`);
      if (!decksResponse.ok) throw new Error('Failed to load decks');
      const decksData = await decksResponse.json();

      // Load stats for each deck
      const statsPromises = decksData.map(async (deck) => {
        const statsResponse = await fetch(`${baseUrl}/api/spaced-repetition/stats/${deck.id}`);
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          return { deckId: deck.id, stats };
        }
        return { deckId: deck.id, stats: { totalCards: 0, dueCards: 0, newCards: 0, accuracy: 0 } };
      });

      const statsResults = await Promise.all(statsPromises);
      const statsMap = {};
      statsResults.forEach(({ deckId, stats }) => {
        statsMap[deckId] = stats;
      });

      setDecks(decksData);
      setDeckStats(statsMap);
    } catch (err) {
      setError(err.message);
      console.error('Error loading decks:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeContent = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.PROD 
        ? "https://backend-supersquiz.onrender.com" 
        : "http://localhost:3001";
      
      const response = await fetch(`${baseUrl}/api/spaced-repetition/init`, {
        method: 'POST'
      });
      
      if (response.ok) {
        await loadDecks(); // Reload decks after initialization
      } else {
        throw new Error('Failed to initialize content');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error initializing content:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedDecks = () => {
    let filtered = decks.filter(deck => {
      const stats = deckStats[deck.id] || {};
      switch (filter) {
        case 'due':
          return stats.dueCards > 0;
        case 'new':
          return stats.newCards > 0;
        default:
          return true;
      }
    });

    return filtered.sort((a, b) => {
      const statsA = deckStats[a.id] || {};
      const statsB = deckStats[b.id] || {};
      
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          return (statsB.accuracy || 0) - (statsA.accuracy || 0);
        case 'dueCards':
        default:
          return (statsB.dueCards || 0) - (statsA.dueCards || 0);
      }
    });
  };

  if (loading) {
    return (
      <div className="decks-loading">
        <div className="loading-spinner"></div>
        <p>Loading decks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="decks-error">
        <h3>Error Loading Decks</h3>
        <p>{error}</p>
        <button onClick={loadDecks} className="retry-btn">Retry</button>
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="decks-empty">
        <div className="empty-state">
          <h3>No Study Decks Available</h3>
          <p>Initialize the Full Stack Open content to start learning!</p>
          <button onClick={initializeContent} className="init-btn">
            🚀 Initialize Full Stack Open Decks
          </button>
        </div>
      </div>
    );
  }

  const totalStats = Object.values(deckStats).reduce((acc, stats) => ({
    totalCards: acc.totalCards + (stats.totalCards || 0),
    dueCards: acc.dueCards + (stats.dueCards || 0),
    newCards: acc.newCards + (stats.newCards || 0),
    totalReviews: acc.totalReviews + (stats.totalReviews || 0)
  }), { totalCards: 0, dueCards: 0, newCards: 0, totalReviews: 0 });

  return (
    <div className="decks-overview">
      <div className="overview-header">
        <div className="overview-stats">
          <div className="stat-card">
            <div className="stat-number">{totalStats.totalCards}</div>
            <div className="stat-label">Total Cards</div>
          </div>
          <div className="stat-card due">
            <div className="stat-number">{totalStats.dueCards}</div>
            <div className="stat-label">Due for Review</div>
          </div>
          <div className="stat-card new">
            <div className="stat-number">{totalStats.newCards}</div>
            <div className="stat-label">New Cards</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalStats.totalReviews}</div>
            <div className="stat-label">Total Reviews</div>
          </div>
        </div>

        <div className="overview-controls">
          <div className="filter-controls">
            <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Decks</option>
              <option value="due">Due for Review</option>
              <option value="new">Has New Cards</option>
            </select>
          </div>
          
          <div className="sort-controls">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="dueCards">Due Cards</option>
              <option value="name">Name</option>
              <option value="progress">Progress</option>
            </select>
          </div>

          <button onClick={onViewProgress} className="progress-btn">
            📊 View Progress
          </button>
        </div>
      </div>

      <div className="decks-grid">
        {filteredAndSortedDecks().map(deck => (
          <DeckCard
            key={deck.id}
            deck={deck}
            stats={deckStats[deck.id] || {}}
            onStartStudy={onStartStudy}
          />
        ))}
      </div>
      
      {filteredAndSortedDecks().length === 0 && (
        <div className="no-decks-message">
          <p>No decks match the current filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default DecksOverview;