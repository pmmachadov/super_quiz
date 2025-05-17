import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import "../auth/Auth.css";
import "../auth/Dashboard.css";
import "../auth/DashboardEffects.css";
import "../auth/DashboardResponsive.css";

const TeacherDashboard = () => {
  const { currentUser, token, logout } = useAuth();
  const [classes, setClasses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classes
        const classesResponse = await fetch(
          "http://localhost:3000/api/teacher/classes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fetch quizzes
        const quizzesResponse = await fetch(
          "http://localhost:3000/api/teacher/quizzes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!classesResponse.ok || !quizzesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const classesData = await classesResponse.json();
        const quizzesData = await quizzesResponse.json();

        setClasses(classesData);
        setQuizzes(quizzesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load your dashboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    <div className="dashboard-container teacher-dashboard">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="user-welcome">
          {currentUser && (
            <span>Welcome, {currentUser.name || "Teacher"}!</span>
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

      <div className="dashboard-section highlight-section">
        <h2>Create New Quiz</h2>
        <p className="section-description">
          Create a new quiz for your students to take.
        </p>
        <button className="create-quiz-button">Create Quiz</button>
      </div>

      <div className="dashboard-section">
        <h2>Your Classes</h2>
        {loading ? (
          <div className="loading">Loading your classes...</div>
        ) : (
          <div className="classes-container">
            {classes.length === 0 ? (
              <p>You haven't created any classes yet.</p>
            ) : (
              <div className="classes-grid">
                {classes.map(classItem => (
                  <div
                    className="class-card animate-card"
                    key={classItem.id}
                  >
                    <h3>{classItem.name}</h3>
                    <p>{classItem.students?.length || 0} Students</p>
                    <div className="class-actions">
                      <button className="view-class-button">View Class</button>
                      <button className="assign-quiz-button">
                        Assign Quiz
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="add-class-button">Add New Class</button>
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Your Quizzes</h2>
        {loading ? (
          <div className="loading">Loading your quizzes...</div>
        ) : (
          <div className="quizzes-container">
            {quizzes.length === 0 ? (
              <p>You haven't created any quizzes yet.</p>
            ) : (
              <div className="quizzes-grid">
                {quizzes.map(quiz => (
                  <div
                    className="quiz-card animate-card"
                    key={quiz.id}
                  >
                    <h3>{quiz.title}</h3>
                    <p>{quiz.questions?.length || 0} Questions</p>
                    <div className="quiz-actions">
                      <button className="edit-quiz-button">Edit Quiz</button>
                      <button className="start-quiz-button">
                        Start Live Quiz
                      </button>
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

export default TeacherDashboard;
