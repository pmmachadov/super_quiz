import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "./Layout.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [darkTheme, setDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/quizzes", label: "Quizzes" },
    { path: "/create-quiz", label: "Create Quiz" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Aplicar la clase dark-theme al elemento raíz y al body
    document.documentElement.classList.toggle("dark-theme", darkTheme);
    document.body.classList.toggle("dark-theme", darkTheme);
    localStorage.setItem("theme", darkTheme ? "dark" : "light");
  }, [darkTheme]);

  const toggleTheme = () => {
    setDarkTheme((prev) => !prev);
  };

  return (
    <div className="app-container">
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-content">
          <Link to="/" className="logo-link">
            <h1 className="logo">Quiz Challenge</h1>
          </Link>
          <div className="header-controls">
            <nav className="nav-links">
              {navItems.map((item) => (
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
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
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
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">{children}</main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/" className="footer-link">
              Home
            </Link>
            <Link to="/quizzes" className="footer-link">
              Quizzes
            </Link>
            <Link to="/create-quiz" className="footer-link">
              Create
            </Link>
          </div>
          <p className="copyright">
            © {new Date().getFullYear()} Quiz Challenge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
