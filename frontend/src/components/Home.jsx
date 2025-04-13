import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const options = [
        {
            path: '/quizzes',
            label: 'Play',
            description: 'Play the best interactive quizzes',
            icon: '🎮',
            actionLabel: 'Play Now'
        },
        {
            path: '/create',
            label: 'Create',
            description: 'Create your own interactive quiz',
            icon: '📝',
            actionLabel: 'Create Quiz'
        }
    ];

    return (
        <div>
            <section className="hero-section">
                <h1 className="hero-title">Welcome to Kahoot Clone</h1>
                <p className="hero-description">Create and play interactive quizzes in real time</p>
                <div className="hero-buttons">
                    <Link to="/quizzes" className="btn primary">Get Started</Link>
                    <Link to="/create" className="btn secondary">Create Quiz</Link>
                </div>
            </section>

            <section className="options-section">
                <div className="options-grid">
                    {options.map((option, index) => (
                        <Link
                            key={index}
                            to={option.path}
                            className="option-card"
                        >
                            <div className="option-content">
                                <div className="option-header">
                                    <div className="option-icon">{option.icon}</div>
                                    <div className="option-title">{option.label}</div>
                                </div>
                                <p className="option-description">{option.description}</p>
                                <div className="option-actions">
                                    <button className="option-btn">
                                        {option.actionLabel}
                                        <svg className="inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Menú Móvil */}
            <div className="mobile-menu">
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Open menu"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M3 12h18M3 18h18" />
                    </svg>
                </button>

                <div className={`mobile-menu-content ${isMenuOpen ? 'active' : ''}`}>
                    <div className="mobile-menu-header">
                        <h2>Kahoot Clone</h2>
                        <button
                            className="mobile-menu-close"
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav className="mobile-menu-nav">
                        <Link
                            to="/"
                            className="mobile-menu-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/quizzes"
                            className="mobile-menu-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Play
                        </Link>
                        <Link
                            to="/create"
                            className="mobile-menu-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Create
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}
