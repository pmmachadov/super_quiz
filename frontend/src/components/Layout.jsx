import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

export default function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuItems = [
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
                    
                    {/* Menu hamburguesa para pantallas pequeñas */}
                    <button 
                        className="menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Abrir menú"
                    >
                        <span className="menu-icon"></span>
                    </button>

                    {/* Navegación principal */}
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

                {/* Menú móvil */}
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
