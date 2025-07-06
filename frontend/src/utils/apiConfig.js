export const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    // En producción (Vercel), usar las funciones serverless
    return "";
  } else {
    // En desarrollo, usar el backend local
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
