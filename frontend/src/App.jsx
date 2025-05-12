import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./components/Home";
import QuizPage from "./components/QuizPage";
import Quizzes from "./components/Quizzes";
import CreateQuiz from "./components/CreateQuiz";
import Results from "./components/Results";
import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";
import Login from "./components/auth/Login";
import StudentRegister from "./components/auth/StudentRegister";
import TeacherRegister from "./components/auth/TeacherRegister";
import StudentDashboard from "./components/auth/StudentDashboard";
import TeacherDashboard from "./components/auth/TeacherDashboard";
import StudentLiveQuiz from "./components/student/StudentLiveQuiz";
import { AuthProvider } from "./context/AuthContext";
import { authRouteValidators } from "./utils/authHelpers";

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  // Get active user key from storage
  const activeUserKey =
    localStorage.getItem("quiz_active_user") || "quiz_auth_default";
  const token = localStorage.getItem(`${activeUserKey}_token`);
  const userDataString = localStorage.getItem(`${activeUserKey}_user`);
  let userData = null;

  if (userDataString) {
    try {
      userData = JSON.parse(userDataString);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (requiredRole && userData?.role !== requiredRole) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<StudentRegister />}
          />
          <Route
            path="/register/teacher"
            element={<TeacherRegister />}
          />{" "}
          {/* Protected Dashboard Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <Layout>
                  <StudentDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute requiredRole="teacher">
                <Layout>
                  <TeacherDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <Layout>
                <QuizPage />
              </Layout>
            }
          />
          <Route
            path="/quizzes"
            element={
              <Layout>
                <Quizzes />
              </Layout>
            }
          />
          <Route
            path="/create-quiz"
            element={
              <Layout>
                <CreateQuiz />
              </Layout>
            }
          />
          <Route
            path="/results/:id"
            element={
              <Layout>
                <Results />
              </Layout>
            }
          />{" "}
          <Route
            path="/analytics"
            element={
              <Layout>
                <AnalyticsDashboard />
              </Layout>
            }
          />
          {/* Live Quiz Route */}
          <Route
            path="/live-quiz/:code"
            element={
              <ProtectedRoute requiredRole="student">
                <Layout>
                  <StudentLiveQuiz />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* Default redirect */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
