export const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    // In production use VITE_API_BASE if provided, otherwise fallback
    // to a deployed backend (update this URL to your deployed API).
    return import.meta.env.VITE_API_BASE || "https://backend-supersquiz.onrender.com";
  } else {
    return "http://localhost:3000";
  }
};

export const fetchFromStaticJSON = async endpoint => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}.json`;
  const response = await fetch(url, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`
    );
  }
  return await response.json();
};

// Fallback to local JSON when backend is unavailable
export const fetchWithFallback = async (endpoint) => {
  const baseUrl = getApiBaseUrl();
  
  try {
    // Try backend first
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "GET",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`Backend unavailable for ${endpoint}, using offline data:`, error.message);
    
    // Fallback to local static data
    // In development: use absolute path, in production: use base path
    const basePath = import.meta.env.PROD ? "/super_quiz" : "";
    const localUrl = `${basePath}/data${endpoint.replace('/api', '')}.json`;
    const fallbackResponse = await fetch(localUrl, { cache: "no-cache" });
    
    if (!fallbackResponse.ok) {
      throw new Error(`Offline data not found: ${localUrl}`);
    }
    
    return await fallbackResponse.json();
  }
};

export default getApiBaseUrl;
