import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dataPath = join(process.cwd(), 'backend', 'data', 'gameResults.json');
    
    // Ensure directory exists
    const dir = dirname(dataPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    // Reset to empty games array
    const emptyData = { games: [] };
    writeFileSync(dataPath, JSON.stringify(emptyData, null, 2), 'utf8');

    res.status(200).json({ message: 'Game results reset successfully' });
  } catch (error) {
    console.error('Error resetting game results:', error);
    res.status(500).json({ error: 'Failed to reset game results' });
  }
}
