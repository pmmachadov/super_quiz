import { getCardsForReview, getAllCards, getCardsByDeckId, getUserProgress } from '../../lib/spaced-repetition-db.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { deckId, limit = 20, mode = 'mixed', userId = 'default' } = req.query;
    
    let cards = [];
    
    if (mode === 'mixed' || mode === 'due') {
      // Get cards that are due for review
      const dueCards = getCardsForReview(userId, deckId, parseInt(limit));
      cards = dueCards;
    }
    
    if (mode === 'new' || (mode === 'mixed' && cards.length < parseInt(limit))) {
      // Get new cards (cards never studied)
      const allCards = deckId ? getCardsByDeckId(deckId) : getAllCards();
      const userProgress = getUserProgress(userId);
      const newCards = allCards.filter(card => {
        // Check if card has never been studied
        return !userProgress[card.id];
      });
      
      const remainingSlots = parseInt(limit) - cards.length;
      cards.push(...newCards.slice(0, remainingSlots));
    }
    
    // Remove duplicates
    const uniqueCards = cards.filter((card, index, self) => 
      self.findIndex(c => c.id === card.id) === index
    );
    
    res.status(200).json(uniqueCards.slice(0, parseInt(limit)));
  } catch (error) {
    console.error('Error fetching study cards:', error);
    res.status(500).json({ error: 'Failed to fetch study cards' });
  }
}