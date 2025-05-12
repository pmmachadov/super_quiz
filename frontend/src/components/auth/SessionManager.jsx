import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const SessionManager = () => {
  const { currentUser, getAvailableSessions, switchSession } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [showSessions, setShowSessions] = useState(false);

  // Update the sessions list when component mounts or currentUser changes
  useEffect(() => {
    setSessions(getAvailableSessions());
  }, [getAvailableSessions, currentUser]);

  const handleSwitchSession = sessionKey => {
    switchSession(sessionKey);
    setShowSessions(false);
  };

  // Only show if there are multiple sessions available
  if (sessions.length <= 1) {
    return null;
  }

  return (
    <div className="session-manager">
      <button
        className="session-toggle-button"
        onClick={() => setShowSessions(!showSessions)}
      >
        {currentUser
          ? `${currentUser.role}: ${currentUser.name}`
          : "Switch Session"}{" "}
        ▼
      </button>

      {showSessions && (
        <div className="session-dropdown">
          <h4>Available Sessions</h4>
          {sessions.map(session => (
            <div
              key={session.key}
              className={`session-item ${
                session.user.email === currentUser?.email ? "current" : ""
              }`}
              onClick={() => handleSwitchSession(session.key)}
            >
              <div className="session-role">{session.user.role}</div>
              <div className="session-name">{session.user.name}</div>
              <div className="session-email">{session.user.email}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionManager;
