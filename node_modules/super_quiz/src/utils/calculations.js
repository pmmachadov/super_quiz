/**
 * Calculates accuracy percentage from correct answers and total questions
 * @param {number} correct - Number of correct answers
 * @param {number} total - Total number of questions
 * @param {number} [decimals=1] - Number of decimal places to round to
 * @returns {string} - Formatted percentage string with specified decimal places
 */
export const calculateAccuracy = (correct, total, decimals = 1) => {
  if (!total) return "0";
  return ((correct / total) * 100).toFixed(decimals);
};
