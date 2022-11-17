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

/** randomize order of the cards O(N + M) */
const shuffle = (): Promise<DBCard[] | null> =>
  setDeck(shuffleDeck(getNewDeck()));

/** return an array of a specified length O(2N) */
const dealDeck = (deck: DBCard[], num = 0) => {
  const cards: DBCard[] = [];
  // verify we have enough cards
  if (num > deck.length) {
    return { deck, cards };
  }
  // get the cards
  for (let i = 0; i < num; i += 1) {
    const card: DBCard | undefined = deck.pop();
    card && cards.push(card);
  }
  return { deck, cards };
};

/** return an array of a specified length O(2N) */
const deal = async (num = 0): Promise<DBCard[]> => {
  const dbDeck = await getDeck();
  const { deck, cards } = dealDeck(dbDeck, num);
  await setDeck(deck);
  return cards;
};

/** sort by card weight */
const rankSort = (a: DBCard, b: DBCard): number => a.weight - b.weight;

/**
 * Take a full deck,
 * split out face cards and base cards,
 * optionally add jokers based on player count,
 * return the player and monster decks
 *
 * https://www.badgersfrommars.com/assets/RegicideRulesA4.pdf
 */
const getNewRegicideDeck = (playerCount: number) => {
  const castleDeck = getNewDeck();
  const tavernDeck: DBCard[] = [];

  // set animal companion weight to 1
  castleDeck[51].weight = 1;
  castleDeck[38].weight = 1;
  castleDeck[25].weight = 1;
  castleDeck[12].weight = 1;

  // split out king tavern cards
  shuffleDeck([
    castleDeck.splice(50, 1)[0],
    castleDeck.splice(37, 1)[0],
    castleDeck.splice(24, 1)[0],
    castleDeck.splice(11, 1)[0],
  ]).forEach((card) => tavernDeck.push({ ...card, weight: 20 }));
  // split out queen tavern cards
  shuffleDeck([
    castleDeck.splice(46, 1)[0],
    castleDeck.splice(34, 1)[0],
    castleDeck.splice(22, 1)[0],
    castleDeck.splice(10, 1)[0],
  ]).forEach((card) => tavernDeck.push({ ...card, weight: 15 }));
  // split out jack tavern cards
  shuffleDeck([
    castleDeck.splice(42, 1)[0],
    castleDeck.splice(31, 1)[0],
    castleDeck.splice(20, 1)[0],
    castleDeck.splice(9, 1)[0],
  ]).forEach((card) => tavernDeck.push({ ...card, weight: 10 }));

  // add jesters based on player count
  playerCount >= 3 && castleDeck.push({ name: "R", weight: 0, suit: "" });
  playerCount === 4 && castleDeck.push({ name: "R", weight: 0, suit: "" });

  return {
    castleDeck: shuffleDeck(castleDeck),
    tavernDeck,
  };
};

export default { shuffle, deal, dealDeck, rankSort, getNewRegicideDeck };
