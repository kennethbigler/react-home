import localForage from "localforage";
import { DBCard, shuffle as shuffleAlg } from "../../../../jotai/deck-state";

/** get immutable copy of deck O(N) */
const getDeck = (): Promise<DBCard[]> =>
  localForage
    .getItem("deck")
    .then((data: unknown) => (data as DBCard[]) || shuffleAlg())
    .catch(() => shuffleAlg());

/** immutably update deck O(N) */
const setDeck = (deck: DBCard[]): Promise<DBCard[] | null> =>
  localForage.setItem("deck", deck).catch(() => null);

const useDeck = () => {
  /** randomize order of the cards O(N + M) */
  const shuffle = (): Promise<DBCard[] | null> => {
    return setDeck(shuffleAlg());
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
