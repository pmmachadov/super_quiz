import React from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import "./Layout.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/quizzes", label: "Quizzes" },
    { path: "/create-quiz", label: "Create Quiz" },
  ];

  return (
    <div className="app-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="header">
        <div className="header-content">
          <h1 className="logo">Kahoot Clone</h1>
          <nav className="nav-links">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="main-content" style={{ flex: 1 }}>{children}</main>

      <footer className="footer">
        <div className="footer-content">
          <p>Super Quizz. Just play :)</p>
        </div>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
