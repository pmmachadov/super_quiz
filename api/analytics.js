import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read game results from JSON file
    const dataPath = join(process.cwd(), 'backend', 'data', 'gameResults.json');
    
    let gameResults = [];
    try {
      const data = readFileSync(dataPath, 'utf8');
      const parsed = JSON.parse(data);
      // Handle both formats: {games: [...]} or direct array [...]
      gameResults = Array.isArray(parsed) ? parsed : (parsed.games || []);
    } catch (error) {
      // File doesn't exist or is empty
      gameResults = [];
    }

    // Calculate statistics
    const totalGames = gameResults.length;
    
    if (totalGames === 0) {
      return res.status(200).json({
        totalGames: 0,
        averageScore: 0,
        questionsData: [],
        gamesHistory: []
      });
    }

    const totalScore = gameResults.reduce((sum, game) => {
      return sum + ((game.score / game.totalQuestions) * 100);
    }, 0);
    
    const averageScore = Math.round(totalScore / totalGames);

    // Process questions data
    const questionsMap = new Map();
    gameResults.forEach(game => {
      game.questionResults?.forEach(q => {
        const key = q.questionId || q.question;
        const existing = questionsMap.get(key) || {
          questionId: key,
          question: q.questionText || q.question,
          correctCount: 0,
          totalAttempts: 0
        };
        
        existing.totalAttempts++;
        if (q.isCorrect) {
          existing.correctCount++;
        }
        
        questionsMap.set(key, existing);
      });
    });

    const questionsData = Array.from(questionsMap.values()).map(q => ({
      ...q,
      accuracy: Math.round((q.correctCount / q.totalAttempts) * 100)
    }));

    // Process games history
    const gamesHistory = gameResults.map(game => ({
      id: game.id,
      quizTitle: game.quizTitle || `Quiz ${game.quizId}`,
      score: game.score,
      totalQuestions: game.totalQuestions,
      percentage: Math.round((game.score / game.totalQuestions) * 100),
      date: game.date,
      timeSpent: game.timeSpent || 0
    })).sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      totalGames,
      averageScore,
      questionsData,
      gamesHistory
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
}
