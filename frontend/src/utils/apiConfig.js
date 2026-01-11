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

export default getApiBaseUrl;
