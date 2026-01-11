#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'flashcards.json');

function readData() {
  if (!fs.existsSync(DATA_PATH)) {
    console.log('No flashcards data file found at', DATA_PATH);
    process.exit(0);
  }
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

const data = readData();
console.log('Decks:', (data.decks || []).length);
console.log('Cards:', (data.cards || []).length);

const byType = {};
for (const c of (data.cards || [])) {
  byType[c.type] = (byType[c.type] || 0) + 1;
}

console.log('Cards by type:', byType);
