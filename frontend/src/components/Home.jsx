import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import BubbleEffect from "./BubbleEffect";
import "./Home.css";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const options = [
    {
      path: "/quizzes",
      label: "Play Quizzes",
      description:
        "Challenge yourself with our collection of interactive quizzes on various topics. Test your knowledge and compete with friends!",
      icon: "🎮",
      actionLabel: "Play Now",
    },
    {
      path: "/create-quiz",
      label: "Create Quiz",
      description:
        "Design your own custom quizzes with multiple choice questions, images, and timed responses. Share them with others!",
      icon: "✏️",
      actionLabel: "Create Quiz",
    },
  ];

  return (
    <div className={`page-container ${isVisible ? "fade-in" : ""}`}>
      <section className="hero-section">
        <h1 className="hero-title">Interactive Quiz Challenges</h1>
        <p className="hero-description">
          Create and play engaging quizzes with friends, classmates,
          or colleagues. Test your knowledge, learn new facts, and
          have fun!
        </p>
        <div className="hero-buttons">
          <Link
            to="/quizzes"
            className="btn primary multi-bubble"
          >
            <span>Start Playing</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <BubbleEffect />
          </Link>
          <Link
            to="/create-quiz"
            className="btn secondary multi-bubble"
          >
            <span>Create Your Quiz</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <BubbleEffect />
          </Link>
        </div>
      </section>

      <section className="options-section">
        <div className="options-grid">
          {options.map(option => (
            <Link
              key={option.path}
              to={option.path}
              className="option-card"
            >
              <div className="option-content">
                <div className="option-header">
                  <div className="option-icon">{option.icon}</div>
                  <div className="option-title">{option.label}</div>
                </div>
                <p className="option-description">
                  {option.description}
                </p>
                <div className="option-actions">
                  <button className="option-btn multi-bubble">
                    {option.actionLabel}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <BubbleEffect />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mobile-menu">
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line
                  x1="3"
                  y1="12"
                  x2="21"
                  y2="12"
                />
                <line
                  x1="3"
                  y1="6"
                  x2="21"
                  y2="6"
                />
                <line
                  x1="3"
                  y1="18"
                  x2="21"
                  y2="18"
                />
              </>
            )}
          </svg>
        </button>

        <div
          className={`mobile-menu-content ${
            isMenuOpen ? "active" : ""
          }`}
        >
          <div className="mobile-menu-header">
            <h2>Quiz Challenge</h2>
            <button
              className="mobile-menu-close"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
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
              Play Quizzes
            </Link>
            <Link
              to="/create-quiz"
              className="mobile-menu-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Quiz
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
