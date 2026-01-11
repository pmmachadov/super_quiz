import React, { useState, useEffect } from 'react';
import DecksOverview from './DecksOverview';
import StudySession from './StudySession';
import ProgressDashboard from './ProgressDashboard';
import './SpacedRepetition.css';

const SpacedRepetition = () => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [studySettings, setStudySettings] = useState({
    cardsPerSession: 20,
    showHints: true,
    shuffleCards: true,
    reviewMode: 'mixed' // new, due, mixed
  });

  const handleStartStudy = (deck, settings = {}) => {
    setSelectedDeck(deck);
    setStudySettings({ ...studySettings, ...settings });
    setActiveView('study');
  };

  const handleFinishStudy = () => {
    setActiveView('overview');
    setSelectedDeck(null);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return (
          <DecksOverview 
            onStartStudy={handleStartStudy}
            onViewProgress={() => setActiveView('progress')}
          />
        );
      case 'study':
        return (
          <StudySession 
            deck={selectedDeck}
            settings={studySettings}
            onFinish={handleFinishStudy}
            onBack={() => setActiveView('overview')}
          />
        );
      case 'progress':
        return (
          <ProgressDashboard 
            onBack={() => setActiveView('overview')}
          />
        );
      default:
        return <DecksOverview onStartStudy={handleStartStudy} />;
    }
  };

  return (
    <div className="spaced-repetition-container">
      <header className="sr-header">
        <div className="sr-header-content">
          <h1 className="sr-title">
            <span className="sr-icon">🧠</span>
            Spaced Repetition Learning
          </h1>
          <p className="sr-subtitle">
            Master Full Stack Open concepts with scientifically-proven spaced repetition
          </p>
        </div>
        
        {activeView !== 'overview' && (
          <nav className="sr-nav">
            <button 
              className={`sr-nav-btn ${activeView === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveView('overview')}
            >
              📚 Decks
            </button>
            <button 
              className={`sr-nav-btn ${activeView === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveView('progress')}
            >
              📊 Progress
            </button>
          </nav>
        )}
      </header>

      <main className="sr-main">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default SpacedRepetition;