import React, { useState, useEffect } from 'react';
// Lightweight syntax highlighting
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/vs2015.css';

const FlashCard = ({ card, onAnswer, showAnswer, onFlip }) => {
  const getCardTypeIcon = (type) => {
    switch (type) {
      case 'definition': return '📖';
      case 'concept': return '💡';
      case 'code': return '💻';
      case 'best-practice': return '⭐';
      default: return '📝';
    }
  };

  return (
    <div className="flashcard-container">
      <div className="card-header">
        <div className="card-type">
          {getCardTypeIcon(card.type)} {card.type}
        </div>
        <div className="card-category">{card.category}</div>
      </div>

      <div className={`flashcard ${showAnswer ? 'flipped' : ''}`} onClick={onFlip}>
        <div className="card-face card-front">
          <div className="card-content">
            <div className="card-text" dangerouslySetInnerHTML={{ __html: card.front.replace(/```(\w+)?\n([\s\S]*?)\n```/g, '<pre><code class="language-$1">$2</code></pre>') }} />
          </div>
          <div className="flip-hint">Click to reveal answer</div>
        </div>

        <div className="card-face card-back">
          <div className="card-content">
            <div className="card-text" dangerouslySetInnerHTML={{ __html: card.back.replace(/```(\w+)?\n([\s\S]*?)\n```/g, '<pre><code class="language-$1">$2</code></pre>') }} />
          </div>
          <div className="difficulty-buttons">
            <button
              className="diff-btn blackout"
              onClick={(e) => { e.stopPropagation(); onAnswer(0); }}
              title="Blackout - Complete memory failure"
            >
              😵 Blackout
            </button>
            <button
              className="diff-btn incorrect"
              onClick={(e) => { e.stopPropagation(); onAnswer(1); }}
              title="Incorrect - Wrong answer"
            >
              ❌ Wrong
            </button>
            <button
              className="diff-btn difficult"
              onClick={(e) => { e.stopPropagation(); onAnswer(2); }}
              title="Difficult - Correct with serious difficulty"
            >
              😰 Hard
            </button>
            <button
              className="diff-btn hesitant"
              onClick={(e) => { e.stopPropagation(); onAnswer(3); }}
              title="Hesitant - Correct with hesitation"
            >
              🤔 Medium
            </button>
            <button
              className="diff-btn easy"
              onClick={(e) => { e.stopPropagation(); onAnswer(4); }}
              title="Easy - Correct with ease"
            >
              😊 Easy
            </button>
            <button
              className="diff-btn perfect"
              onClick={(e) => { e.stopPropagation(); onAnswer(5); }}
              title="Perfect - Perfect response"
            >
              🎯 Perfect
            </button>
          </div>
        </div>
      </div>

      {card.tags && card.tags.length > 0 && (
        <div className="card-tags">
          {card.tags.map(tag => (
            <span key={tag} className="card-tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

const StudyProgress = ({ current, total, correct, streak }) => {
  const progressPercent = (current / total) * 100;

  return (
    <div className="study-progress">
      <div className="progress-stats">
        <div className="stat">
          <span className="stat-label">Progress:</span>
          <span className="stat-value">{current} / {total}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Correct:</span>
          <span className="stat-value">{correct}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Streak:</span>
          <span className="stat-value">🔥 {streak}</span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="progress-text">{Math.round(progressPercent)}%</span>
      </div>
    </div>
  );
};

const StudySession = ({ deck, settings, onFinish, onBack }) => {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    streak: 0,
    maxStreak: 0,
    answers: []
  });

  useEffect(() => {
    loadStudyCards();
  }, [deck, settings]);

  // Highlight code blocks after cards update
  useEffect(() => {
    // small timeout to ensure DOM update
    const t = setTimeout(() => {
      document.querySelectorAll('.card-text pre code').forEach((el) => {
        try { hljs.highlightElement(el); } catch (e) { /* ignore */ }
      });
    }, 50);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  const loadStudyCards = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        deckId: deck.id,
        limit: settings.cardsPerSession || 20,
        mode: settings.reviewMode || 'mixed'
      });
      const response = await fetch(`/api/spaced-repetition/study?${params}`);
      if (!response.ok) throw new Error('Failed to load study cards');

      const studyCards = await response.json();

      if (settings.shuffleCards) {
        // Fisher-Yates shuffle
        for (let i = studyCards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [studyCards[i], studyCards[j]] = [studyCards[j], studyCards[i]];
        }
      }

      setCards(studyCards);
    } catch (err) {
      setError(err.message);
      console.error('Error loading study cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (quality) => {
    const currentCard = cards[currentCardIndex];
    const isCorrect = quality >= 3;

    // Update session stats
    const newStreak = isCorrect ? sessionStats.streak + 1 : 0;
    const newSessionStats = {
      ...sessionStats,
      correct: sessionStats.correct + (isCorrect ? 1 : 0),
      streak: newStreak,
      maxStreak: Math.max(sessionStats.maxStreak, newStreak),
      answers: [...sessionStats.answers, { cardId: currentCard.id, quality, timestamp: new Date() }]
    };
    setSessionStats(newSessionStats);

    // Submit answer to backend
    try {
      await fetch(`/api/spaced-repetition/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: currentCard.id,
          quality,
          sessionId: `session_${Date.now()}` // Simple session ID
        })
      });
    } catch (err) {
      console.error('Error submitting answer:', err);
    }

    // Move to next card or finish session
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      finishSession(newSessionStats);
    }
  };

  const finishSession = (finalStats) => {
    // Show session summary before finishing
    const accuracy = cards.length > 0 ? Math.round((finalStats.correct / cards.length) * 100) : 0;
    alert(`Session Complete!\n\nCards reviewed: ${cards.length}\nCorrect answers: ${finalStats.correct}\nAccuracy: ${accuracy}%\nMax streak: ${finalStats.maxStreak}`);

    onFinish();
  };

  const handleFlip = () => {
    if (!showAnswer) {
      setShowAnswer(true);
    }
  };

  const handleSkip = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      finishSession(sessionStats);
    }
  };

  if (loading) {
    return (
      <div className="study-loading">
        <div className="loading-spinner"></div>
        <p>Preparing your study session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="study-error">
        <h3>Error Loading Study Session</h3>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={loadStudyCards} className="retry-btn">Retry</button>
          <button onClick={onBack} className="back-btn">Back to Decks</button>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="no-cards">
        <h3>No Cards Available</h3>
        <p>There are no cards available for study in this deck with the current settings.</p>
        <button onClick={onBack} className="back-btn">Back to Decks</button>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="study-session">
      <div className="session-header">
        <div className="session-info">
          <h2 className="deck-name">{deck.name}</h2>
          <p className="session-mode">
            {settings.reviewMode === 'new' && '✨ New Cards Only'}
            {settings.reviewMode === 'due' && '🔄 Review Only'}
            {settings.reviewMode === 'mixed' && '📚 Mixed Study'}
          </p>
        </div>

        <div className="session-controls">
          <button onClick={onBack} className="back-btn">← Back</button>
          <button onClick={handleSkip} className="skip-btn">Skip →</button>
        </div>
      </div>

      <StudyProgress
        current={currentCardIndex + 1}
        total={cards.length}
        correct={sessionStats.correct}
        streak={sessionStats.streak}
      />

      <div className="study-area">
        <FlashCard
          card={currentCard}
          onAnswer={handleAnswer}
          showAnswer={showAnswer}
          onFlip={handleFlip}
        />
      </div>

      {!showAnswer && (
        <div className="study-hint">
          💡 Think about your answer, then click the card to reveal the solution
        </div>
      )}
    </div>
  );
};

export default StudySession;