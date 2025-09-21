import fs from "fs";
import path from "path";

const CARDS_DATA_PATH = path.join(process.cwd(), "data", "flashcards.json");
const PROGRESS_DATA_PATH = path.join(process.cwd(), "data", "study-progress.json");

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(CARDS_DATA_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

function readCardsData() {
  ensureDataDir();
  if (!fs.existsSync(CARDS_DATA_PATH)) {
    return { cards: [], decks: [] };
  }
  try {
    const raw = fs.readFileSync(CARDS_DATA_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`spaced-repetition-db: failed to read/parse ${CARDS_DATA_PATH}:`, err.message);
    // Return a safe default so API routes don't crash
    return { cards: [], decks: [] };
  }
}

function writeCardsData(obj) {
  ensureDataDir();
  try {
    fs.writeFileSync(CARDS_DATA_PATH, JSON.stringify(obj, null, 2), "utf8");
  } catch (err) {
    console.error(`spaced-repetition-db: failed to write ${CARDS_DATA_PATH}:`, err.message);
    throw err; // rethrow so callers can handle write failures explicitly
  }
}

function readProgressData() {
  ensureDataDir();
  if (!fs.existsSync(PROGRESS_DATA_PATH)) {
    return { userProgress: {} };
  }
  try {
    const raw = fs.readFileSync(PROGRESS_DATA_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`spaced-repetition-db: failed to read/parse ${PROGRESS_DATA_PATH}:`, err.message);
    return { userProgress: {} };
  }
}

function writeProgressData(obj) {
  ensureDataDir();
  try {
    fs.writeFileSync(PROGRESS_DATA_PATH, JSON.stringify(obj, null, 2), "utf8");
  } catch (err) {
    console.error(`spaced-repetition-db: failed to write ${PROGRESS_DATA_PATH}:`, err.message);
    throw err;
  }
}

function ensureId(obj) {
  return (obj.id = obj.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
}

// Spaced Repetition Algorithm (Modified SM-2)
function calculateNextReview(quality, easeFactor, interval, repetitions) {
  // quality: 0-5 (0=blackout, 5=perfect)
  // easeFactor: 1.3-2.5 (difficulty multiplier)
  // interval: days until next review
  // repetitions: number of successful reviews

  if (quality < 3) {
    // Failed review - reset to beginning
    return {
      interval: 1,
      repetitions: 0,
      easeFactor: Math.max(1.3, easeFactor - 0.2)
    };
  }

  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEaseFactor = Math.max(1.3, newEaseFactor);

  let newInterval;
  let newRepetitions = repetitions + 1;

  if (newRepetitions === 1) {
    newInterval = 1;
  } else if (newRepetitions === 2) {
    newInterval = 6;
  } else {
    newInterval = Math.round(interval * newEaseFactor);
  }

  return {
    interval: newInterval,
    repetitions: newRepetitions,
    easeFactor: newEaseFactor
  };
}

// Card Management Functions
export function getAllDecks() {
  const data = readCardsData();
  return data.decks || [];
}

export function getDeckById(deckId) {
  const data = readCardsData();
  return data.decks.find(deck => deck.id === deckId) || null;
}

export function getCardsByDeckId(deckId) {
  const data = readCardsData();
  return data.cards.filter(card => card.deckId === deckId) || [];
}

export function getAllCards() {
  const data = readCardsData();
  return data.cards || [];
}

export function getCardById(cardId) {
  const data = readCardsData();
  return data.cards.find(card => card.id === cardId) || null;
}

export function createDeck(deckData) {
  const data = readCardsData();
  const deck = {
    ...deckData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  ensureId(deck);

  if (!data.decks) data.decks = [];
  data.decks.push(deck);
  writeCardsData(data);
  return deck;
}

export function createCard(cardData) {
  const data = readCardsData();
  const card = {
    ...cardData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  ensureId(card);

  if (!data.cards) data.cards = [];
  data.cards.push(card);
  writeCardsData(data);
  return card;
}

export function updateCard(cardId, updates) {
  const data = readCardsData();
  const cardIndex = data.cards.findIndex(card => card.id === cardId);
  if (cardIndex === -1) return null;

  data.cards[cardIndex] = {
    ...data.cards[cardIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  writeCardsData(data);
  return data.cards[cardIndex];
}

// Progress Tracking Functions
export function getUserProgress(userId = "default") {
  const data = readProgressData();
  return data.userProgress[userId] || {};
}

export function resetUserProgress(userId = "default") {
  const data = readProgressData();
  if (!data.userProgress) data.userProgress = {};
  data.userProgress[userId] = {};
  writeProgressData(data);
  return { success: true, userId };
}

export function getCardProgress(userId = "default", cardId) {
  const userProgress = getUserProgress(userId);
  return userProgress[cardId] || {
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    nextReview: new Date().toISOString(),
    lastReview: null,
    totalReviews: 0,
    correctCount: 0
  };
}

export function updateCardProgress(userId = "default", cardId, quality) {
  const data = readProgressData();
  if (!data.userProgress) data.userProgress = {};
  if (!data.userProgress[userId]) data.userProgress[userId] = {};

  const currentProgress = getCardProgress(userId, cardId);
  const { interval, repetitions, easeFactor } = calculateNextReview(
    quality,
    currentProgress.easeFactor,
    currentProgress.interval,
    currentProgress.repetitions
  );

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  const newProgress = {
    interval,
    repetitions,
    easeFactor,
    nextReview: nextReviewDate.toISOString(),
    lastReview: new Date().toISOString(),
    totalReviews: currentProgress.totalReviews + 1,
    correctCount: currentProgress.correctCount + (quality >= 3 ? 1 : 0)
  };

  data.userProgress[userId][cardId] = newProgress;
  writeProgressData(data);
  return newProgress;
}

export function getCardsForReview(userId = "default", deckId = null, limit = 20) {
  const data = readCardsData();
  const userProgress = getUserProgress(userId);
  const now = new Date();

  let cards = data.cards || [];
  if (deckId) {
    cards = cards.filter(card => card.deckId === deckId);
  }

  // Filter cards that are due for review
  const dueCards = cards.filter(card => {
    const progress = userProgress[card.id];
    if (!progress) return true; // New cards are due
    return new Date(progress.nextReview) <= now;
  });

  // Sort by priority (new cards first, then by due time)
  dueCards.sort((a, b) => {
    const progressA = userProgress[a.id];
    const progressB = userProgress[b.id];

    if (!progressA && !progressB) return 0;
    if (!progressA) return -1;
    if (!progressB) return 1;

    return new Date(progressA.nextReview) - new Date(progressB.nextReview);
  });

  return dueCards.slice(0, limit);
}

export function getStudyStats(userId = "default", deckId = null) {
  const data = readCardsData();
  const userProgress = getUserProgress(userId);

  let cards = data.cards || [];
  if (deckId) {
    cards = cards.filter(card => card.deckId === deckId);
  }

  const stats = {
    totalCards: cards.length,
    newCards: 0,
    learningCards: 0,
    matureCards: 0,
    dueCards: 0,
    totalReviews: 0,
    accuracy: 0
  };

  const now = new Date();
  let totalCorrect = 0;
  let totalReviews = 0;

  cards.forEach(card => {
    const progress = userProgress[card.id];
    if (!progress) {
      stats.newCards++;
      stats.dueCards++;
    } else {
      totalReviews += progress.totalReviews;
      totalCorrect += progress.correctCount;

      if (progress.repetitions === 0) {
        stats.newCards++;
      } else if (progress.repetitions < 3) {
        stats.learningCards++;
      } else {
        stats.matureCards++;
      }

      if (new Date(progress.nextReview) <= now) {
        stats.dueCards++;
      }
    }
  });

  stats.totalReviews = totalReviews;
  stats.accuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

  return stats;
}

// Initialize default Full Stack Open content
export function initializeFullStackOpenContent() {
  const data = readCardsData();
  if (data.decks && data.decks.length > 0) {
    return { message: "Content already exists", deckCount: data.decks.length };
  }

  // This will be populated with Full Stack Open content
  const decks = [];
  const cards = [];

  // We'll implement the full content in the next step
  writeCardsData({ decks, cards });
  return { message: "Initialized", deckCount: decks.length };
}