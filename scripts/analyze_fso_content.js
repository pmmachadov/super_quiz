import fs from 'fs';
import path from 'path';
import { FULLSTACK_OPEN_CONTENT } from '../lib/fullstack-open-content.mjs';

const report = {
  parts: {},
  totalParts: 0,
  totalCards: 0,
  byType: {},
};

for (const [partKey, partData] of Object.entries(FULLSTACK_OPEN_CONTENT)) {
  const partReport = { name: partData.name, cards: partData.cards.length, types: {}, cardsMissingHints: 0 };
  partData.cards.forEach(card => {
    report.totalCards++;
    partReport.types[card.type] = (partReport.types[card.type] || 0) + 1;
    report.byType[card.type] = (report.byType[card.type] || 0) + 1;
    if (!card.hints || card.hints.length === 0) {
      partReport.cardsMissingHints++;
    }
  });
  report.parts[partKey] = partReport;
  report.totalParts++;
}

console.log('Full Stack Open content analysis');
console.log('Parts:', report.totalParts);
console.log('Total cards:', report.totalCards);
console.log('Cards by type:', report.byType);
console.log('--- Per part details ---');
for (const [k, v] of Object.entries(report.parts)) {
  console.log(`${k}: ${v.name} — cards: ${v.cards}, missing hints: ${v.cardsMissingHints}, types: ${JSON.stringify(v.types)}`);
}

// Suggest improvements
console.log('\nSuggestions:');
if (report.byType['cloze'] === undefined) console.log('- No cloze cards found. Consider converting definitions/concepts into cloze deletions for stronger recall (e.g., remove key terms).');
console.log('- Many cards lack hints; adding 1-2 hints per card improves learning (contextual cues, mnemonics).');
console.log('- Consider adding exercise-specific cards that reverse tasks: e.g., given an exercise description produce the steps/code, and vice versa.');

process.exit(0);
