// Determine the base URL for API calls
export const getApiBaseUrl = () => {
  return import.meta.env.PROD ? "/super_quiz" : "";
};

export default getApiBaseUrl;
