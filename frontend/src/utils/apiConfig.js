// API configuration for Super Quiz
export const getApiBaseUrl = () => {
  // Si estamos en desarrollo, usar localhost, de lo contrario usar el JSON estático en GitHub Pages
  return import.meta.env.PROD ? "" : ""; // Ruta relativa a la raíz
};

// Función auxiliar para obtener datos de JSON estáticos cuando estamos en GitHub Pages
export const fetchFromStaticJSON = async endpoint => {
  // Si estamos en producción (GitHub Pages), cargamos los datos del JSON estático
  if (import.meta.env.PROD) {
    // Determinar qué archivo JSON cargar
    if (endpoint.startsWith("/api/quizzes/")) {
      // Si es un quiz individual, extraer el ID
      const quizId = endpoint.split("/").pop(); // Cargar todos los quizzes y filtrar el solicitado
      const response = await fetch("/api/quizzes.json"); // Ruta relativa a la raíz
      const data = await response.json();
      const quiz = data.quizzes.find(q => String(q.id) === quizId);
      return quiz || null;
    } else if (endpoint === "/api/quizzes") {
      // Si son todos los quizzes
      const response = await fetch("/api/quizzes.json"); // Ruta relativa a la raíz
      const data = await response.json();
      return data.quizzes || [];
    } else {
      // Para otros endpoints
      try {
        const response = await fetch(`${endpoint}.json`); // Ruta relativa a la raíz
        return await response.json();
      } catch (error) {
        console.error(`Error loading static JSON for ${endpoint}:`, error);
        return null;
      }
    }
  }

  // En desarrollo, usamos la API normal
  return null;
};

export default {
  getApiBaseUrl,
  fetchFromStaticJSON,
};
