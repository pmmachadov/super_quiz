import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import HeaderSessionManager from "./HeaderSessionManager";

import "./Layout.css";
import "./mobile-menu.css";

const Header = ({ darkTheme, toggleTheme }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/quizzes", label: "Quizzes" },
    { path: "/create-quiz", label: "Create Quiz" },
    { path: "/analytics", label: "Analytics" },
  ];
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "visible"; // Restore scrolling
    document.body.classList.remove("menu-open"); // Remove menu-open class
  }, [location.pathname]);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Toggle body classes for menu open state and scroll locking
    if (!mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("menu-open");
    } else {
      document.body.style.overflow = "visible";
      document.body.classList.remove("menu-open");
    }
  };
  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-content">
        <Link
          to="/"
          className="logo-link"
        ></Link>

        <nav className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-controls">
          <button
            className={`hamburger-menu-btn ${mobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line
                    x1="3"
                    y1="12"
                    x2="21"
                    y2="12"
                  ></line>
                  <line
                    x1="3"
                    y1="6"
                    x2="21"
                    y2="6"
                  ></line>
                  <line
                    x1="3"
                    y1="18"
                    x2="21"
                    y2="18"
                  ></line>
                </>
              )}
            </svg>
          </button>
          <HeaderSessionManager />
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={
              darkTheme ? "Switch to light theme" : "Switch to dark theme"
            }
          >
            {darkTheme ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="5"
                ></circle>
                <line
                  x1="12"
                  y1="1"
                  x2="12"
                  y2="3"
                ></line>
                <line
                  x1="12"
                  y1="21"
                  x2="12"
                  y2="23"
                ></line>
                <line
                  x1="4.22"
                  y1="4.22"
                  x2="5.64"
                  y2="5.64"
                ></line>
                <line
                  x1="18.36"
                  y1="18.36"
                  x2="19.78"
                  y2="19.78"
                ></line>
                <line
                  x1="1"
                  y1="12"
                  x2="3"
                  y2="12"
                ></line>
                <line
                  x1="21"
                  y1="12"
                  x2="23"
                  y2="12"
                ></line>
                <line
                  x1="4.22"
                  y1="19.78"
                  x2="5.64"
                  y2="18.36"
                ></line>
                <line
                  x1="18.36"
                  y1="5.64"
                  x2="19.78"
                  y2="4.22"
                ></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  darkTheme: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Header;
