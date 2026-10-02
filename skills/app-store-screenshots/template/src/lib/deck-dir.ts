import path from "node:path";

/**
 * The folder that holds the deck: app-store-screenshots.json and its public/ assets.
 * DECK_DIR lets one installed editor work on any app's deck (scripts/deck); without it the
 * editor's own folder is the deck, as in a scaffolded copy.
 */
export function deckDir(): string {
  return process.env.DECK_DIR ? path.resolve(process.env.DECK_DIR) : process.cwd();
}
