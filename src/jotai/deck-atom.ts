import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface DBCard {
  name: string;
  suit: string;
  weight: number;
}

const newDeck: DBCard[] = [
  { name: "2", weight: 2, suit: "♣" },
  { name: "3", weight: 3, suit: "♣" },
  { name: "4", weight: 4, suit: "♣" },
  { name: "5", weight: 5, suit: "♣" },
  { name: "6", weight: 6, suit: "♣" },
  { name: "7", weight: 7, suit: "♣" },
  { name: "8", weight: 8, suit: "♣" },
  { name: "9", weight: 9, suit: "♣" },
  { name: "10", weight: 10, suit: "♣" },
  { name: "J", weight: 11, suit: "♣" },
  { name: "Q", weight: 12, suit: "♣" },
  { name: "K", weight: 13, suit: "♣" },
  { name: "A", weight: 14, suit: "♣" },
  { name: "2", weight: 2, suit: "♦" },
  { name: "3", weight: 3, suit: "♦" },
  { name: "4", weight: 4, suit: "♦" },
  { name: "5", weight: 5, suit: "♦" },
  { name: "6", weight: 6, suit: "♦" },
  { name: "7", weight: 7, suit: "♦" },
  { name: "8", weight: 8, suit: "♦" },
  { name: "9", weight: 9, suit: "♦" },
  { name: "10", weight: 10, suit: "♦" },
  { name: "J", weight: 11, suit: "♦" },
  { name: "Q", weight: 12, suit: "♦" },
  { name: "K", weight: 13, suit: "♦" },
  { name: "A", weight: 14, suit: "♦" },
  { name: "2", weight: 2, suit: "♥" },
  { name: "3", weight: 3, suit: "♥" },
  { name: "4", weight: 4, suit: "♥" },
  { name: "5", weight: 5, suit: "♥" },
  { name: "6", weight: 6, suit: "♥" },
  { name: "7", weight: 7, suit: "♥" },
  { name: "8", weight: 8, suit: "♥" },
  { name: "9", weight: 9, suit: "♥" },
  { name: "10", weight: 10, suit: "♥" },
  { name: "J", weight: 11, suit: "♥" },
  { name: "Q", weight: 12, suit: "♥" },
  { name: "K", weight: 13, suit: "♥" },
  { name: "A", weight: 14, suit: "♥" },
  { name: "2", weight: 2, suit: "♠" },
  { name: "3", weight: 3, suit: "♠" },
  { name: "4", weight: 4, suit: "♠" },
  { name: "5", weight: 5, suit: "♠" },
  { name: "6", weight: 6, suit: "♠" },
  { name: "7", weight: 7, suit: "♠" },
  { name: "8", weight: 8, suit: "♠" },
  { name: "9", weight: 9, suit: "♠" },
  { name: "10", weight: 10, suit: "♠" },
  { name: "J", weight: 11, suit: "♠" },
  { name: "Q", weight: 12, suit: "♠" },
  { name: "K", weight: 13, suit: "♠" },
  { name: "A", weight: 14, suit: "♠" },
];

/** sort by card weight */
export const rankSort = (a: DBCard, b: DBCard): number => a.weight - b.weight;

/** randomize order of the cards O(N + M) */
const shuffleDeck = (deck: DBCard[]): DBCard[] => {
  const shuffledDeck: DBCard[] = [];
  // create immutable copy of deck
  deck.map((card) => shuffledDeck.push(card));
  // shuffle the cards
  for (let i = 0; i < 100; i += 1) {
    const j = Math.floor(Math.random() * shuffledDeck.length);
    const k = Math.floor(Math.random() * shuffledDeck.length);
    const temp = shuffledDeck[j];
    shuffledDeck[j] = shuffledDeck[k];
    shuffledDeck[k] = temp;
  }
  // update deck state
  return shuffledDeck;
};

export const deckAtom = atomWithStorage(
  "deckAtom",
  newDeck.map((card) => ({ ...card })),
);

export const handAtom = atom<DBCard[]>([]);

export const shuffleDeckAtom = atom(null, (get, set) => {
  const deck = get(deckAtom);
  const newDeck = shuffleDeck(deck);
  set(deckAtom, newDeck);
});

export const dealDeckAtom = atom(null, (get, set, num: number = 0) => {
  const deck = get(deckAtom);
  const tempDeck = deck.map((card) => ({ ...card }));
  const cards: DBCard[] = [];
  // verify we have enough cards
  if (num <= tempDeck.length) {
    // get the cards
    for (let i = 0; i < num; i += 1) {
      const card: DBCard | undefined = tempDeck.pop();
      if (card) {
        cards.push(card);
      }
    }
    set(deckAtom, tempDeck);
    set(handAtom, cards);
  } else {
    set(handAtom, []);
  }
});
