/**
 * Helper utility to open a specific user session in a new browser window
 */

// Function to get a user's storage key
const getUserStorageKey = user => {
  return user
    ? `quiz_auth_${user.role}_${user.email.replace(/[^a-zA-Z0-9]/g, "_")}`
    : null;
};

// Function to open a link with a specific user session
export const openSessionWindow = (url, userEmail, userRole) => {
  // Scan localStorage for this user
  let userKey = null;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key &&
      key.endsWith("_user") &&
      key.includes(userRole) &&
      key.includes(userEmail.replace(/[^a-zA-Z0-9]/g, "_"))
    ) {
      userKey = key.replace("_user", "");
      break;
    }
  }

  if (!userKey) {
    console.error("User session not found");
    return false;
  }

  // Open a new window with this session
  const newWindow = window.open(url, "_blank");

  // We need to wait for the new window to load
  newWindow.addEventListener("DOMContentLoaded", () => {
    // Set the active user in the new window
    newWindow.localStorage.setItem("quiz_active_user", userKey);
  });

  return true;
};

// Function to get all available sessions
export const getAvailableSessions = () => {
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
};
