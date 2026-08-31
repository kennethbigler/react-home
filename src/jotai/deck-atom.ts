import { atom } from "jotai";
import persistentAtom from "./storage";
import shuffleArray from "../apis/shuffleArray";
import playerAtom from "./player-atom";

export interface DBCard {
  name: string;
  suit: string;
  weight: number;
}

const SUITS = ["♣", "♦", "♥", "♠"] as const;
const NAMES = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
] as const;

const newDeck: DBCard[] = SUITS.flatMap((suit) =>
  NAMES.map((name, i) => ({ name, suit, weight: i + 2 })),
);

/** sort by card weight */
export const rankSort = (a: DBCard, b: DBCard): number => a.weight - b.weight;

/** a fresh 52-card deck in random order */
export const shuffle = (): DBCard[] => shuffleArray(newDeck);

export const deckAtom = persistentAtom("deckAtom", newDeck);

export const shuffleAtom = atom(null, (_get, set) => {
  set(deckAtom, shuffle());
});
shuffleAtom.debugLabel = "shuffleAtom";

/** Deal n cards off the deck and return them (used by Blackjack). */
export const dealCardsAtom = atom(null, (get, set, num: number): DBCard[] => {
  const deck = get(deckAtom);
  const nextDeck: DBCard[] = [...deck];
  const cards: DBCard[] = [];
  const toDraw = Math.min(num, nextDeck.length);
  for (let i = 0; i < toDraw; i += 1) {
    const card = nextDeck.pop();
    if (card) cards.push(card);
  }
  set(deckAtom, nextDeck);
  return cards;
});
dealCardsAtom.debugLabel = "dealCardsAtom";

/** Deal n cards off the deck into a player's first hand (used by Poker). */
export const dealPokerAtom = atom(
  null,
  (
    get,
    set,
    num: number, // number of cards to draw
    playerId: number, // for which player
    prevCards: DBCard[] = [], // any existing cards in their hand (optional)
  ) => {
    // get deck
    const deck = get(deckAtom);
    const nextDeck: DBCard[] = [...deck];

    // draw cards, only when the deck has enough left
    const cards: DBCard[] = [];
    if (num <= nextDeck.length) {
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
    const newHands = [...nextPlayer.hands];
    newHands[0] = {
      cards: [...prevCards, ...cards],
      weight: 0,
      soft: false,
    };
    newHands[0].cards.sort(rankSort);
    nextPlayers[pIdx] = { ...nextPlayer, hands: newHands };

    // update state
    set(deckAtom, nextDeck);
    set(playerAtom, nextPlayers);
  },
);
dealPokerAtom.debugLabel = "dealPokerAtom";
