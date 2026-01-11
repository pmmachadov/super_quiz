import { createFullStackOpenDecks } from '../../lib/fullstack-open-content.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await createFullStackOpenDecks();
    
    res.status(200).json({
      success: true,
      message: result.message,
      decksCreated: result.decks.length,
      cardsCreated: result.cards.length,
      decks: result.decks
    });
  } catch (error) {
    console.error('Error initializing Full Stack Open content:', error);
    res.status(500).json({ 
      error: 'Failed to initialize content',
      details: error.message 
    });
  }
}