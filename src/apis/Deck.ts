import localForage from "localforage";

export interface DBCard {
  name: string;
  suit: string;
  weight: number;
}

const NEW_DECK: DBCard[] = [
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

/** immutably get a copy of new deck O(N) */
const getNewDeck = (): DBCard[] => NEW_DECK.map((card) => ({ ...card }));

/** get immutable copy of deck O(N) */
const getDeck = (): Promise<DBCard[]> =>
  localForage
    .getItem("deck")
    .then((data: unknown) => (data as DBCard[]) || getNewDeck())
    .catch(() => getNewDeck());

/** immutably update deck O(N) */
const setDeck = (deck: DBCard[]): Promise<DBCard[] | null> =>
  localForage.setItem("deck", deck).catch(() => null);

/** randomize order of the cards O(N + M) */
const shuffle = (): Promise<DBCard[] | null> => {
  // get a new deck
  const shuffledDeck = getNewDeck();
  // shuffle the cards
  for (let i = 0; i < 100; i += 1) {
    const j = Math.floor(Math.random() * 52);
    const k = Math.floor(Math.random() * 52);
    const temp = shuffledDeck[j];
    shuffledDeck[j] = shuffledDeck[k];
    shuffledDeck[k] = temp;
  }
  // update deck state
  return setDeck(shuffledDeck);
};

/** return an array of a specified length O(2N) */
const deal = (num = 0): Promise<DBCard[]> => {
  const cards: DBCard[] = [];
  return getDeck()
    .then((deck: DBCard[]): DBCard[] => {
      // verify we have enough cards
      if (num > deck.length) {
        return deck;
      }
      // get the cards
      for (let i = 0; i < num; i += 1) {
        const card: DBCard | undefined = deck.pop();
        card && cards.push(card);
      }
      return deck;
    })
    .then((deck: DBCard[]) => setDeck(deck))
    .then(() => cards);
};

/** sort by card weight */
const rankSort = (a: DBCard, b: DBCard): number => a.weight - b.weight;

export default { shuffle, deal, rankSort };
