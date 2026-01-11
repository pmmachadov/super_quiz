
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataPath = path.resolve(__dirname, '..', 'data', 'flashcards.json')
const backupPath = path.resolve(__dirname, '..', 'data', `flashcards.json.bak-${Date.now()}`)

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8')
}

function dedupe(data) {
  const origDeckCount = (data.decks || []).length
  const origCardCount = (data.cards || []).length

  // Keep first occurrence of deck by name
  const deckByName = new Map()
  const keptDecks = []
  for (const d of data.decks || []) {
    if (!deckByName.has(d.name)) {
      deckByName.set(d.name, d)
      keptDecks.push(d)
    }
  }

  // Map old deckId(s) to kept deck id (first seen)
  const deckIdMap = new Map()
  for (const d of data.decks || []) {
    const kept = deckByName.get(d.name)
    deckIdMap.set(d.id, kept.id)
  }

  // Deduplicate cards by (deckId, front, back)
  const seenCards = new Set()
  const keptCards = []
  for (const c of data.cards || []) {
    const mappedDeckId = deckIdMap.get(c.deckId) || c.deckId
    const key = `${mappedDeckId}::${(c.front||'').trim()}::${(c.back||'').trim()}`
    if (!seenCards.has(key)) {
      seenCards.add(key)
      // assign normalized deckId
      const newCard = Object.assign({}, c, { deckId: mappedDeckId })
      keptCards.push(newCard)
    }
  }

  const newData = Object.assign({}, data, { decks: keptDecks, cards: keptCards })
  return { newData, stats: { origDeckCount, origCardCount, newDeckCount: keptDecks.length, newCardCount: keptCards.length } }
}

function main() {
  if (!fs.existsSync(dataPath)) {
    console.error('data/flashcards.json not found at', dataPath)
    process.exit(1)
  }

  console.log('Backing up', dataPath, 'to', backupPath)
  fs.copyFileSync(dataPath, backupPath)

  const data = readJson(dataPath)
  const { newData, stats } = dedupe(data)

  console.log('Original decks:', stats.origDeckCount, 'cards:', stats.origCardCount)
  console.log('Cleaned decks:', stats.newDeckCount, 'cards:', stats.newCardCount)

  writeJson(dataPath, newData)
  console.log('Wrote cleaned data to', dataPath)
  console.log('Backup kept at', backupPath)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}

export { dedupe }
