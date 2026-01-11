import { updateCardProgress } from '../../lib/spaced-repetition-db.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cardId, quality, userId = 'default', sessionId } = req.body;

    if (!cardId || quality === undefined) {
      return res.status(400).json({ error: 'cardId and quality are required' });
    }

    if (quality < 0 || quality > 5) {
      return res.status(400).json({ error: 'quality must be between 0 and 5' });
    }

    const updatedProgress = updateCardProgress(userId, cardId, quality);
    
    res.status(200).json({
      success: true,
      cardId,
      progress: updatedProgress,
      nextReview: updatedProgress.nextReview,
      interval: updatedProgress.interval
    });
  } catch (error) {
    console.error('Error updating card progress:', error);
    res.status(500).json({ 
      error: 'Failed to update card progress',
      details: error.message 
    });
  }
}