import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import JoinQuiz from "../student/JoinQuiz";
import "./Auth.css";
import "./Dashboard.css";
import "./StudentDashboard.css";
import "./DashboardEffects.css";
import "./DashboardResponsive.css";

const StudentDashboard = () => {
  const { currentUser, token, logout } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/classes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }

        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setError("Failed to load your classes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchClasses();
    }
  }, [token]);

  const handleTakeQuiz = (classId, quizId) => {
    // Navigate to quiz
    window.location.href = `/quiz/${quizId}`;
  };
  return (
    <div className="dashboard-container student-dashboard">      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="user-welcome">
          {currentUser && (
            <span>Welcome, {currentUser.name || "Student"}!</span>
          )}
          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="dashboard-section join-quiz-section highlight-section">
        <h2>Join a Live Quiz</h2>
        <p className="section-description">
          Enter the 6-digit code provided by your teacher to join a live quiz
          session.
        </p>
        <div className="join-quiz-instruction">
          <div className="instruction-step">
            <div className="step-number">1</div>
            <p>Ask your teacher for the 6-digit quiz code</p>
          </div>
          <div className="instruction-step">
            <div className="step-number">2</div>
            <p>Enter or paste the code below</p>
          </div>
          <div className="instruction-step">
            <div className="step-number">3</div>
            <p>Click "Join Quiz" to participate</p>
          </div>
        </div>
        <JoinQuiz />
      </div>

      <div className="dashboard-section">
        <h2>Your Classes</h2>
        {loading ? (
          <div className="loading">Loading your classes...</div>
        ) : (
          <div className="classes-container">
            {classes.length === 0 ? (
              <p>You are not enrolled in any classes yet.</p>
            ) : (
              <div className="classes-grid">
                {classes.map(classItem => (
                  <div
                    className="class-card animate-card"
                    key={classItem.id}
                  >
                    <h3>{classItem.name}</h3>

                    <div className="class-quizzes">
                      <h4>Available Quizzes</h4>
                      {classItem.quizzes && classItem.quizzes.length > 0 ? (
                        <ul>
                          {classItem.quizzes.map(quizId => (
                            <li key={quizId}>
                              <button
                                onClick={() =>
                                  handleTakeQuiz(classItem.id, quizId)
                                }
                                className="take-quiz-button"
                              >
                                Take Quiz #{quizId}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No quizzes available for this class.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
