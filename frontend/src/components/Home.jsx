import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BubbleEffect from "./BubbleEffect";
import "./Home.css";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { currentUser, logout } = useAuth();

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

  // User-specific options based on authentication status
  const authOptions = currentUser
    ? [
        // Options for logged-in users
        {
          path:
            currentUser.role === "teacher"
              ? "/teacher/dashboard"
              : "/student/dashboard",
          label: `${
            currentUser.role === "teacher" ? "Teacher" : "Student"
          } Dashboard`,
          description: `Access your ${
            currentUser.role === "teacher"
              ? "classes and manage students"
              : "enrolled classes and take quizzes"
          }.`,
          icon: currentUser.role === "teacher" ? "👨‍🏫" : "👨‍🎓",
          actionLabel: "Go to Dashboard",
        },
        {
          path: "/analytics",
          label: "View Analytics",
          description:
            "Track your performance and see detailed statistics about quiz results.",
          icon: "📊",
          actionLabel: "View Analytics",
        },
      ]
    : [
        // Options for guests
        {
          path: "/login",
          label: "Login",
          description:
            "Already have an account? Sign in to access your dashboard and saved quizzes.",
          icon: "🔑",
          actionLabel: "Login",
        },
        {
          path: "/register",
          label: "Register as Student",
          description:
            "Create a student account to join classes and track your quiz performance.",
          icon: "👨‍🎓",
          actionLabel: "Register",
        },
        {
          path: "/register/teacher",
          label: "Register as Teacher",
          description:
            "Create a teacher account to manage classes, students, and create specialized quizzes.",
          icon: "👨‍🏫",
          actionLabel: "Register",
        },
      ];

  // Combine regular options and auth options
  const allOptions = [...options, ...authOptions];

  return (
    <div className={`page-container ${isVisible ? "fade-in" : ""}`}>
      <section className="hero-section">
        <h1 className="hero-title">Interactive Quiz Challenges</h1>
        <p className="hero-description">
          Create and play engaging quizzes with friends, classmates, or
          colleagues. Test your knowledge, learn new facts, and have fun!
        </p>
        <div className="hero-buttons">
          {currentUser ? (
            // Show dashboard button for logged-in users
            <Link
              to={
                currentUser.role === "teacher"
                  ? "/teacher/dashboard"
                  : "/student/dashboard"
              }
              className="btn primary multi-bubble"
            >
              <span>Go to Dashboard</span>
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
          ) : (
            // Show start playing for guests
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
          )}
          {currentUser ? (
            // Show logout button for logged-in users
            <button
              onClick={logout}
              className="btn secondary multi-bubble"
            >
              <span>Logout</span>
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
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line
                  x1="21"
                  y1="12"
                  x2="9"
                  y2="12"
                />
              </svg>
              <BubbleEffect />
            </button>
          ) : (
            // Show login button for guests
            <Link
              to="/login"
              className="btn secondary multi-bubble"
            >
              <span>Login</span>
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
                <path d="M15 3h4a2 2 0 0 1-2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line
                  x1="15"
                  y1="12"
                  x2="3"
                  y2="12"
                />
              </svg>
              <BubbleEffect />
            </Link>
          )}
        </div>

        {currentUser && (
          <div className="user-welcome">
            <p>
              Welcome, {currentUser.name} ({currentUser.role})
            </p>
          </div>
        )}
      </section>

      <section className="options-section">
        <div className="options-grid">
          {allOptions.map(option => (
            <Link
              key={option.path}
              to={option.path}
              className="option-card"
              onClick={option.onClick}
            >
              <div className="option-content">
                <div className="option-header">
                  <div className="option-icon">{option.icon}</div>
                  <div className="option-title">{option.label}</div>
                </div>
                <p className="option-description">{option.description}</p>
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

        <div className={`mobile-menu-content ${isMenuOpen ? "active" : ""}`}>
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

            {/* Authentication links */}
            {currentUser ? (
              <>
                <Link
                  to={
                    currentUser.role === "teacher"
                      ? "/teacher/dashboard"
                      : "/student/dashboard"
                  }
                  className="mobile-menu-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="mobile-menu-link logout-link"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-menu-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="mobile-menu-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register as Student
                </Link>
                <Link
                  to="/register/teacher"
                  className="mobile-menu-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register as Teacher
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
