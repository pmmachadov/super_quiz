import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// Function to generate a unique storage key for a user
const getUserStorageKey = user => {
  return user
    ? `quiz_auth_${user.role}_${user.email.replace(/[^a-zA-Z0-9]/g, "_")}`
    : null;
};

// Helper function to get the current active user key
const getActiveUserKey = () =>
  localStorage.getItem("quiz_active_user") || "quiz_auth_default";

export const AuthProvider = ({ children }) => {
  // Get currently active user key
  const activeUserKey = getActiveUserKey();

  // Initialize state from the user-specific storage or defaults
  const savedUserData = localStorage.getItem(`${activeUserKey}_user`);
  const savedToken = localStorage.getItem(`${activeUserKey}_token`);

  const [currentUser, setCurrentUser] = useState(
    savedUserData ? JSON.parse(savedUserData) : null
  );
  const [token, setToken] = useState(savedToken || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Logout function - using useCallback to avoid dependency issues
  const logout = useCallback(() => {
    // Clear current user data first
    if (currentUser) {
      const userKey = getUserStorageKey(currentUser);
      if (userKey) {
        localStorage.removeItem(`${userKey}_token`);
        localStorage.removeItem(`${userKey}_user`);
      }
    }

    // Force clear all active user session data
    localStorage.removeItem("quiz_active_user");
    
    // Clear AuthContext state
    setCurrentUser(null);
    setToken(null);
    
    // Force clean all session storage to ensure no lingering data
    sessionStorage.clear();
    
    // Redirect to login
    navigate("/login");
  }, [currentUser, navigate]);

  // Check if user is authenticated on load
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const userKey = getUserStorageKey(data.user);

          // Store user data in their specific key
          localStorage.setItem(`${userKey}_user`, JSON.stringify(data.user));
          localStorage.setItem(`${userKey}_token`, token);

          // Set this as active user key
          localStorage.setItem("quiz_active_user", userKey);

          setCurrentUser(data.user);
        } else {
          // If token is invalid, clear it
          logout();
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token, logout]);  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Clear any previous active user data to avoid session confusion
      if (currentUser) {
        // Only remove the active_user marker, keep the other sessions intact
        localStorage.removeItem("quiz_active_user");
      }

      // Generate a unique storage key for this user
      const userKey = getUserStorageKey(data.user);

      // Store user data using user-specific keys
      localStorage.setItem(`${userKey}_user`, JSON.stringify(data.user));
      localStorage.setItem(`${userKey}_token`, data.token);
      localStorage.setItem("quiz_active_user", userKey);

      // Update state with the new user
      setCurrentUser(data.user);
      setToken(data.token);

      // Redirect based on role
      if (data.user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (data.user.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/");
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  // Register function
  const register = async userData => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Generate a unique storage key for this user
      const userKey = getUserStorageKey(data.user);

      // Store user data using user-specific keys
      localStorage.setItem(`${userKey}_user`, JSON.stringify(data.user));
      localStorage.setItem(`${userKey}_token`, data.token);
      localStorage.setItem("quiz_active_user", userKey);

      setCurrentUser(data.user);
      setToken(data.token);

      // Redirect based on role
      if (data.user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (data.user.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/");
      }

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Create teacher function
  const createTeacher = async teacherData => {
    try {
      const response = await fetch("http://localhost:3000/api/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(teacherData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create teacher");
      }

      return data;
    } catch (error) {
      console.error("Create teacher error:", error);
      throw error;
    }
  };

  // Create student function
  const createStudent = async studentData => {
    try {
      const response = await fetch("http://localhost:3000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create student");
      }

      return data;
    } catch (error) {
      console.error("Create student error:", error);
      throw error;
    }
  };  // Function to switch to a different user session
  const switchSession = useCallback(userKey => {
    // Check if the session exists
    const userData = localStorage.getItem(`${userKey}_user`);
    const sessionToken = localStorage.getItem(`${userKey}_token`);

    if (!userData || !sessionToken) {
      console.error("Session not found");
      return false;
    }

    try {
      // First, clear the currentUser state to ensure a clean switch
      setCurrentUser(null);
      setToken(null);
      
      // Short delay to ensure state is reset before setting new values
      setTimeout(() => {
        // Set this as the active user
        localStorage.setItem("quiz_active_user", userKey);
        
        // Update state with parsed user data
        const parsedUserData = JSON.parse(userData);
        setCurrentUser(parsedUserData);
        setToken(sessionToken);
        
        // Redirect to the appropriate dashboard based on role
        if (parsedUserData.role === "teacher") {
          navigate("/teacher/dashboard");
        } else if (parsedUserData.role === "student") {
          navigate("/student/dashboard");
        }
      }, 50);
      
      return true;
    } catch (error) {
      console.error("Error switching session:", error);
      return false;
    }
  }, [navigate]);

  // Function to list all available sessions
  const getAvailableSessions = useCallback(() => {
    const sessions = [];
    // Scan localStorage for our prefixed keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.endsWith("_user") && key.startsWith("quiz_auth_")) {
        try {
          const userKey = key.replace("_user", "");
          const userData = JSON.parse(localStorage.getItem(key));
          if (userData) {
            sessions.push({
              key: userKey,
              user: userData,
            });
          }
        } catch (err) {
          console.error("Error parsing session data", err);
        }
      }
    }
    return sessions;
  }, []);
  // Use useMemo to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentUser,
    login,
    register,
    logout,
    createTeacher,
    createStudent,
    token,
    loading,
    switchSession,
    getAvailableSessions,
  }), [
    currentUser, 
    login, 
    register, 
    logout, 
    createTeacher, 
    createStudent, 
    token, 
    loading, 
    switchSession, 
    getAvailableSessions
  ]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Add PropTypes validation for children
import PropTypes from 'prop-types';

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
