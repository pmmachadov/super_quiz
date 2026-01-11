import { getAllDecks, getStudyStats } from '../../../lib/spaced-repetition-db.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId = 'default' } = req.query;
    
    const decks = getAllDecks();
    const deckProgressData = [];
    
    for (const deck of decks) {
      const stats = getStudyStats(userId, deck.id);
      deckProgressData.push({
        deck,
        progress: stats
      });
    }
    
    res.status(200).json(deckProgressData);
  } catch (error) {
    console.error('Error fetching deck progress:', error);
    res.status(500).json({ error: 'Failed to fetch deck progress' });
  }
}