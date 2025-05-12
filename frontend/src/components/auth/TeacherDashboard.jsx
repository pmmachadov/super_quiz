import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LiveQuiz from "../LiveQuiz";
import "./Auth.css";
import "./Dashboard.css";
import "./TeacherDashboard.css";
import "./DashboardEffects.css";
import "./DashboardResponsive.css";

const TeacherDashboard = () => {
  const { currentUser, token, logout } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, classes, students, liveQuiz

  useEffect(() => {
    const fetchClasses = async () => {
      if (!token) return;

      try {
        const response = await fetch("http://localhost:3000/api/classes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }

        const data = await response.json();
        setClasses(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching classes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [token]);

  if (!currentUser) {
    return <div className="loading">Loading...</div>;
  }
  return (
    <div className="dashboard-container teacher-dashboard">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>{" "}
        <div className="user-welcome">
          <span>Welcome, {currentUser.name}</span>
          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === "classes" ? "active" : ""}`}
          onClick={() => setActiveTab("classes")}
        >
          Classes
        </button>
        <button
          className={`tab-button ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          Students
        </button>
        <button
          className={`tab-button ${activeTab === "liveQuiz" ? "active" : ""}`}
          onClick={() => setActiveTab("liveQuiz")}
        >
          Live Quiz
        </button>
      </div>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {activeTab === "overview" && (
          <div className="dashboard-overview">
            <div className="stats-card">
              <h3>Classes</h3>
              <p className="stat-number">{classes.length}</p>
              <Link
                to="#"
                onClick={() => setActiveTab("classes")}
                className="action-link"
              >
                Manage Classes
              </Link>
            </div>

            <div className="stats-card">
              <h3>Students</h3>
              <p className="stat-number">
                {classes.reduce((total, cls) => total + cls.students.length, 0)}
              </p>
              <Link
                to="#"
                onClick={() => setActiveTab("students")}
                className="action-link"
              >
                Manage Students
              </Link>
            </div>

            <div className="stats-card">
              {" "}
              <h3>Launch Quiz</h3>
              <div className="quick-action">
                <button
                  className="primary-button live-quiz-button"
                  onClick={() => setActiveTab("liveQuiz")}
                >
                  Start Live Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "classes" && (
          <div className="classes-section">
            <h2>Your Classes</h2>
            {loading ? (
              <div className="loading">Loading classes...</div>
            ) : classes.length === 0 ? (
              <div className="empty-state">
                <p>You don't have any classes yet.</p>
                <button className="primary-button">Create Class</button>
              </div>
            ) : (
              <div className="classes-list">
                {classes.map(cls => (
                  <div
                    key={cls.id}
                    className="class-card"
                  >
                    <h3>{cls.name}</h3>
                    <p>
                      <strong>Students:</strong> {cls.students.length}
                    </p>
                    <p>
                      <strong>Quizzes:</strong> {cls.quizzes.length}
                    </p>
                    <div className="card-actions">
                      <button className="secondary-button">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "students" && (
          <div className="students-section">
            <h2>Manage Students</h2>
            <p>
              This page is under construction. You will be able to view and
              manage all your students here.
            </p>
          </div>
        )}

        {activeTab === "liveQuiz" && <LiveQuiz />}
      </div>
    </div>
  );
};

export default TeacherDashboard;
