import { getStudyStats } from '../../../lib/spaced-repetition-db.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { deckId } = req.query;
    const { userId = 'default' } = req.query;
    
    const stats = getStudyStats(userId, deckId);
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching deck stats:', error);
    res.status(500).json({ error: 'Failed to fetch deck statistics' });
  }
}