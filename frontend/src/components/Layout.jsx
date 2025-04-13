import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Layout.css";

const menuItems = [
  { path: "/quizzes", label: "Play" },
  { path: "/create", label: "Create" },
];

export default function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="header-link">
            My favorite Quizz
          </Link>

          <nav className="header-nav">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} className="header-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="main-content">{children}</main>

      <footer className="footer">
        <div className="footer-content">
          <p> 2025 Kahoot Clone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
