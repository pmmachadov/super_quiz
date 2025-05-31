// API configuration for Super Quiz
export const getApiBaseUrl = () => {
  // Si estamos en desarrollo, usar localhost, de lo contrario usar el JSON estático en GitHub Pages
  return import.meta.env.PROD ? "/super_quiz" : ""; // Ruta relativa a la raíz en GitHub Pages
};

// Función auxiliar para obtener datos de JSON estáticos cuando estamos en GitHub Pages
export const fetchFromStaticJSON = async endpoint => {
  // Si estamos en producción (GitHub Pages), cargamos los datos del JSON estático
  if (import.meta.env.PROD) {
    const base = import.meta.env.BASE_URL; // Dynamically get base path

    // Determinar qué archivo JSON cargar
    if (endpoint.startsWith("/api/quizzes/")) {
      // Si es un quiz individual, extraer el ID
      const quizId = endpoint.split("/").pop();
      // Cargar todos los quizzes y filtrar el solicitado
      const response = await fetch(`${base}api/quizzes.json`);
      const data = await response.json();
      return data.quizzes.find(q => String(q.id) === quizId) || null;
    } else if (endpoint === "/api/quizzes") {
      // Si son todos los quizzes
      const response = await fetch(`${base}api/quizzes.json`);
      const data = await response.json();
      return data.quizzes || [];
    } else {
      // Para otros endpoints
      try {
        // Remove leading slash from endpoint when concatenating
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

  // En desarrollo, usamos la API normal
  return null;
};

export default {
  getApiBaseUrl,
  fetchFromStaticJSON,
};
