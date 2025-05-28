// API configuration for Super Quiz
export const getApiBaseUrl = () => {
  return import.meta.env.PROD ? "https://backend-supersquiz.onrender.com" : "";
};

export default {
  getApiBaseUrl,
};
