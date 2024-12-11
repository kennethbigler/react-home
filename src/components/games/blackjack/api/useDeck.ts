import localForage from "localforage";
import { DBCard, newDeck } from "../../../../jotai/deck-state";

/** immutably get a copy of new deck O(N) */
const getNewDeck = (): DBCard[] => newDeck.map((card) => ({ ...card }));

/** get immutable copy of deck O(N) */
const getDeck = (): Promise<DBCard[]> =>
  localForage
    .getItem("deck")
    .then((data: unknown) => (data as DBCard[]) || getNewDeck())
    .catch(() => getNewDeck());

/** immutably update deck O(N) */
const setDeck = (deck: DBCard[]): Promise<DBCard[] | null> =>
  localForage.setItem("deck", deck).catch(() => null);

const useDeck = () => {
  /** randomize order of the cards O(N + M) */
  const shuffle = (): Promise<DBCard[] | null> => {
    const shuffledDeck: DBCard[] = [];
    // create immutable copy of deck
    newDeck.map((card) => shuffledDeck.push(card));
    // shuffle the cards
    for (let i = 0; i < 100; i += 1) {
      const j = Math.floor(Math.random() * shuffledDeck.length);
      const k = Math.floor(Math.random() * shuffledDeck.length);
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
          if (card) {
            cards.push(card);
          }
        }
        return deck;
      })
      .then((deck: DBCard[]) => setDeck(deck))
      .then(() => cards);
  };

  return { shuffle, deal };
};

export default useDeck;
