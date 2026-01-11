import { getUserProgress, getAllDecks, getStudyStats } from '../../../lib/spaced-repetition-db.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId = 'default', range = 'week' } = req.query;
    
    const userProgress = getUserProgress(userId);
    const decks = getAllDecks();
    
    // Calculate overall statistics
    let totalReviews = 0;
    let totalCorrect = 0;
    let matureCards = 0;
    let studyStreak = 0;
    
    const cardProgresses = Object.values(userProgress);
    
    cardProgresses.forEach(progress => {
      totalReviews += progress.totalReviews || 0;
      totalCorrect += progress.correctCount || 0;
      if (progress.repetitions >= 3) {
        matureCards++;
      }
    });
    
    const averageAccuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;
    
    // Calculate study streak (simplified - consecutive days with reviews)
    const today = new Date();
    const recentDays = 30;
    const studyDays = new Set();
    
    cardProgresses.forEach(progress => {
      if (progress.lastReview) {
        const reviewDate = new Date(progress.lastReview);
        const daysDiff = Math.floor((today - reviewDate) / (1000 * 60 * 60 * 24));
        if (daysDiff < recentDays) {
          studyDays.add(reviewDate.toDateString());
        }
      }
    });
    
    studyStreak = studyDays.size;
    
    // Generate accuracy history (mock data for demonstration)
    const accuracyHistory = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      accuracyHistory.push({
        date: date.toISOString().split('T')[0],
        accuracy: Math.max(0, averageAccuracy + (Math.random() - 0.5) * 20)
      });
    }
    
    const stats = {
      totalReviews,
      averageAccuracy,
      studyStreak,
      matureCards,
      reviewsTrend: Math.floor(Math.random() * 20) - 10, // Mock trend
      accuracyTrend: Math.floor(Math.random() * 10) - 5, // Mock trend
      masteredTrend: Math.floor(Math.random() * 15) - 5, // Mock trend
      accuracyHistory
    };
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching overall progress:', error);
    res.status(500).json({ error: 'Failed to fetch overall progress' });
  }
}