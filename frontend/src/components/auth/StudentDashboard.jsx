import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentDashboard from "../student/StudentDashboard";

// This is a redirection component to maintain backward compatibility
// Old imports will still work but we'll show a console warning
const StudentDashboardRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.warn(
      "StudentDashboard has been moved to the student folder. " +
        "Please update your imports to use the new location: " +
        'import StudentDashboard from "../components/student/StudentDashboard"'
    );

    // Optional: Automatic redirect in development for better navigation
    // navigate('/student-dashboard');
  }, []);

  // Return the actual component to maintain functionality
  return <StudentDashboard />;
};

export default StudentDashboardRedirect;
