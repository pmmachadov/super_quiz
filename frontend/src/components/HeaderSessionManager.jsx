// HeaderSessionManager.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./HeaderSessionManager.css";

const HeaderSessionManager = () => {
  const { currentUser, getAvailableSessions, switchSession } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [showSessions, setShowSessions] = useState(false);

  // Update the sessions list when component mounts or currentUser changes
  useEffect(() => {
    setSessions(getAvailableSessions());
  }, [getAvailableSessions, currentUser]);
  
  const handleSwitchSession = sessionKey => {
    // Primero cerramos el menú desplegable
    setShowSessions(false);
    
    // Pequeña espera para mejorar la experiencia de usuario
    setTimeout(() => {
      // Cambiamos la sesión
      switchSession(sessionKey);
    }, 100);
  };

  // Only show if there are multiple sessions available
  if (sessions.length <= 1) {
    return null;
  }

  return (
    <div className="header-session-manager">
      <button
        className="session-toggle-button"
        onClick={() => setShowSessions(!showSessions)}
        title="Switch between active sessions"
        data-sessions={sessions.length}
      >
        {currentUser && (
          <>
            <div className="session-mini-avatar">
              {currentUser.role === "teacher" ? "👨‍🏫" : "👨‍🎓"}
            </div>
            <div className="button-user-info">
              <span className="user-role">{currentUser.role}</span>
              <span className="user-name">{currentUser.name}</span>
            </div>
            <span className="dropdown-icon">{showSessions ? "▲" : "▼"}</span>
          </>
        )}
      </button>

      {showSessions && (
        <div className="session-dropdown">
          <h4>Switch Account</h4>
          <div className="sessions-list">
            {sessions.map(session => (
              <div
                key={session.key}
                className={`session-item ${
                  session.user.email === currentUser?.email ? "current" : ""
                }`}
                onClick={() => handleSwitchSession(session.key)}
              >
                {" "}
                <div className="session-avatar">
                  {session.user.role === "teacher" ? "👨‍🏫" : "👨‍🎓"}
                </div>
                <div className="session-info">
                  <div className="session-role">{session.user.role}</div>
                  <div className="session-name">{session.user.name}</div>
                  <div className="session-email">{session.user.email}</div>
                </div>
                {session.user.email === currentUser?.email && (
                  <div className="active-indicator">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderSessionManager;
