#!/usr/bin/env node
import { createFullStackOpenDecks } from '../lib/fullstack-open-content.mjs';
import { mergeExtras } from '../lib/fso_extras.mjs';

(async function init() {
  try {
    console.log('Initializing Full Stack Open content...');
  mergeExtras();
  const result = await createFullStackOpenDecks();
  console.log(`Initialization complete: ${result.decks.length} decks, ${result.cards.length} cards added.`);
  } catch (err) {
    console.error('Initialization failed:', err);
    process.exit(1);
  }
})();
