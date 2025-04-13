import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Layout.css';

export default function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuItems = [
        { path: '/quizzes', label: 'Play' },
        { path: '/create', label: 'Create' },
    ];

    return (
        <div className="layout">
            <header className="header">
                <div className="header-content">
                    <Link to="/" className="header-link">
                        Kahoot Clone
                    </Link>
                    
                    <button 
                        className="menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        <span className="menu-icon"></span>
                    </button>

                    <nav className="header-nav">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="header-link"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {isMenuOpen && (
                    <div className="mobile-menu">
                        <div className="mobile-menu-content">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="header-link mobile-link"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            <main className="main-content">
                {children}
            </main>

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
