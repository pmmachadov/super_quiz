import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  }, [token]);

  // Login function
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

      setCurrentUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);

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

      setCurrentUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);

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
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    createTeacher,
    createStudent,
    token,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
