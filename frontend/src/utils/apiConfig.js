export const getApiBaseUrl = () => {
  return import.meta.env.PROD ? "/super_quiz" : "";
};

export const fetchFromStaticJSON = async endpoint => {
  if (import.meta.env.PROD) {
    const base = import.meta.env.BASE_URL;

    if (endpoint.startsWith("/api/quizzes/")) {
      const quizId = endpoint.split("/").pop();
      const response = await fetch(`${base}api/quizzes.json`);
      const data = await response.json();
      return data.quizzes.find(q => String(q.id) === quizId) || null;
    } else if (endpoint === "/api/quizzes") {
      const response = await fetch(`${base}api/quizzes.json`);
      const data = await response.json();
      return data.quizzes || [];
    } else {
      try {
        const cleanEndpoint = endpoint.startsWith("/")
          ? endpoint.slice(1)
          : endpoint;
        const response = await fetch(`${base}${cleanEndpoint}.json`);
        return await response.json();
      } catch (error) {
        console.error(`Error loading static JSON for ${endpoint}:`, error);
        return null;
      }
    }
  }

  return null;
};

export default {
  getApiBaseUrl,
  fetchFromStaticJSON,
};
