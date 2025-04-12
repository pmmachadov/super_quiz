import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

export default function Layout({ children }) {
    const menuItems = [
        { path: '/', label: 'Inicio' },
        { path: '/quizzes', label: 'Jugar' },
        { path: '/create', label: 'Crear' },
    ];

    return (
        <div className="layout">
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <Link to="/" className="header-link">
                        Kahoot Clone
                    </Link>
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
            </header>

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <p> 2025 Kahoot Clone. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
