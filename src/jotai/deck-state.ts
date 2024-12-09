import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import playerAtom from "./player-atom";

export interface DBCard {
  name: string;
  suit: string;
  weight: number;
}

/** sort by card weight */
const rankSort = (a: DBCard, b: DBCard): number => a.weight - b.weight;

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

export const deckAtom = atomWithStorage("deckAtom", newDeck);

/** randomize order of the cards O(N + M) */
const shuffleDeck = (deck: DBCard[]): DBCard[] => {
  const shuffledDeck: DBCard[] = [];
  // create immutable copy of deck
  deck.forEach((card) => shuffledDeck.push(card));
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

export const shuffleAtom = atom(null, (_get, set) => {
  set(deckAtom, shuffleDeck(newDeck));
});

/** return an array of a specified length O(2N) */
export const dealAtom = atom(
  null,
  (
    get,
    set,
    num: number = 0,
    playerId: number = 0,
    prevCards: DBCard[] = [],
  ) => {
    // get deck
    const deck = get(deckAtom);
    const nextDeck: DBCard[] = [];
    deck.forEach((card) => nextDeck.push(card));

    // draw cards
    const cards: DBCard[] = [];
    // verify we have enough cards
    if (num <= nextDeck.length) {
      // get the cards
      for (let i = 0; i < num; i += 1) {
        const card: DBCard | undefined = nextDeck.pop();
        if (card) {
          cards.push(card);
        }
      }
    }

    // get players
    const players = get(playerAtom);
    const nextPlayers = [...players];

    // have player draw cards
    const pIdx = nextPlayers.findIndex((player) => player.id === playerId);
    const nextPlayer = nextPlayers[pIdx];
    nextPlayer.hands[0] = {
      cards: [...prevCards, ...cards],
      weight: 0,
      soft: false,
    };
    // sort
    nextPlayer.hands[0].cards.sort(rankSort);

    // update state
    set(deckAtom, nextDeck);
    set(playerAtom, nextPlayers);
  },
);
