import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Welcome, {currentUser?.name}!</p>
        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading your classes...</div>
      ) : (
        <div className="classes-container">
          <h2>Your Classes</h2>

          {classes.length === 0 ? (
            <p>You are not enrolled in any classes yet.</p>
          ) : (
            <div className="classes-grid">
              {classes.map(classItem => (
                <div
                  className="class-card"
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
  );
};

export default StudentDashboard;
