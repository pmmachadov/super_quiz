export const getApiBaseUrl = () => {
  return import.meta.env.PROD ? "/super_quiz" : "";
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
