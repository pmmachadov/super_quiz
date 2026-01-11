export const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE || "https://backend-supersquiz.onrender.com";
  } else {
    return "http://localhost:3000";
  }
};

// Fetch quizzes - tries backend first, falls back to local JSON
export const fetchQuizzes = async () => {
  const baseUrl = getApiBaseUrl();
  
  try {
    const response = await fetch(`${baseUrl}/api/quizzes`, {
      method: "GET",
      cache: "no-cache",
      headers: { Accept: "application/json" },
    });
    
    if (!response.ok) throw new Error(`Backend error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("Backend unavailable, using local JSON:", error.message);
    
    // Fallback to local static JSON
    const basePath = import.meta.env.BASE_URL || "/";
    const fallbackResponse = await fetch(`${basePath}quizzes.json`, { cache: "no-cache" });
    
    if (!fallbackResponse.ok) {
      throw new Error("Could not load quizzes from backend or local file");
    }
    
    return await fallbackResponse.json();
  }
};

// Fetch single quiz by ID - tries backend first, falls back to local JSON
export const fetchQuizById = async (id) => {
  const baseUrl = getApiBaseUrl();
  
  try {
    const response = await fetch(`${baseUrl}/api/quizzes/${id}`, {
      method: "GET",
      cache: "no-cache",
      headers: { Accept: "application/json" },
    });
    
    if (!response.ok) throw new Error(`Backend error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Backend unavailable for quiz ${id}, using local JSON:`, error.message);
    
    // Fallback: load all quizzes and find the one we need
    const basePath = import.meta.env.BASE_URL || "/";
    const fallbackResponse = await fetch(`${basePath}quizzes.json`, { cache: "no-cache" });
    
    if (!fallbackResponse.ok) {
      throw new Error("Could not load quiz from backend or local file");
    }
    
    const quizzes = await fallbackResponse.json();
    const quiz = quizzes.find(q => q._id === id || String(q.id) === id || q._id === String(id));
    
    if (!quiz) {
      throw new Error(`Quiz with ID ${id} not found`);
    }
    
    return quiz;
  }
};

export default getApiBaseUrl;
