import { getUserProgress } from '../../../lib/spaced-repetition-db.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId = 'default', days = 30 } = req.query;
    
    const userProgress = getUserProgress(userId);
    const studyHistory = {};
    
    // Process user progress to create daily study history
    Object.values(userProgress).forEach(progress => {
      if (progress.lastReview) {
        const reviewDate = new Date(progress.lastReview);
        const dateStr = reviewDate.toISOString().split('T')[0];
        
        if (!studyHistory[dateStr]) {
          studyHistory[dateStr] = { reviews: 0, newCards: 0 };
        }
        
        studyHistory[dateStr].reviews += 1;
        
        // Count as new card if it was the first review
        if (progress.totalReviews === 1) {
          studyHistory[dateStr].newCards += 1;
        }
      }
    });
    
    res.status(200).json(studyHistory);
  } catch (error) {
    console.error('Error fetching study history:', error);
    res.status(500).json({ error: 'Failed to fetch study history' });
  }
}