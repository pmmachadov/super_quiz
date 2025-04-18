import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "./Layout.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <div className="app-container">
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-content">
          <Link to="/" className="logo-link">
            <h1 className="logo">Quiz Challenge</h1>
          </Link>
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
