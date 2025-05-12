// Helper function to load the active user based on our multi-session logic
export const loadActiveUser = () => {
  // Get active user key from storage
  const activeUserKey =
    localStorage.getItem("quiz_active_user") || "quiz_auth_default";
  const token = localStorage.getItem(`${activeUserKey}_token`);
  const userDataString = localStorage.getItem(`${activeUserKey}_user`);

  if (token && userDataString) {
    try {
      return {
        user: JSON.parse(userDataString),
        token,
        activeUserKey,
      };
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }

  return {
    user: null,
    token: null,
    activeUserKey: null,
  };
};

// Authentication validators for routes
export const authRouteValidators = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const { token } = loadActiveUser();
    return !!token;
  },

  // Check if user has a specific role
  hasRole: role => {
    const { user } = loadActiveUser();
    return user && user.role === role;
  },
};
