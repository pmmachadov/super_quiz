const quizzesData = [];
const analyticsData = [];

export const fetchQuizzes = async () => {
  try {
    const response = await fetch("/api/quizzes", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();

    quizzesData.length = 0;

    if (Array.isArray(data)) {
      quizzesData.push(...data);
    } else if (data.quizzes && Array.isArray(data.quizzes)) {
      quizzesData.push(...data.quizzes);
    }

    return [...quizzesData];
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return [];
  }
};

export const getQuizById = id => {
  return quizzesData.find(quiz => quiz.id === id) || null;
};

export const fetchAnalytics = async () => {
  try {
    const response = await fetch("/api/analytics");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    analyticsData.length = 0;
    if (Array.isArray(data)) {
      analyticsData.push(...data);
    }

    return [...analyticsData];
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return [];
  }
};

export const getQuizzes = () => [...quizzesData];
export const getAnalytics = () => [...analyticsData];

export default {
  getQuizzes,
  getAnalytics,
  getQuizById,
  fetchQuizzes,
  fetchAnalytics,
};
