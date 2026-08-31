import { useSetAtom } from "jotai";
import { type DBCard, shuffleAtom, dealCardsAtom } from "@/jotai/deck-atom";

/**
 * Blackjack deck operations using shared Jotai deck state.
 * dealCardsAtom updates the deck and returns the dealt cards in one write,
 * so recursive/sequential deal calls never see a stale deck.
 */
const useBlackjackDeck = () => {
  const setShuffle = useSetAtom(shuffleAtom);
  const dealCards = useSetAtom(dealCardsAtom);

  const shuffle = (): Promise<void> => {
    setShuffle();
    return Promise.resolve();
  };

  const deal = (num: number): Promise<DBCard[]> =>
    Promise.resolve(dealCards(num));

  return { shuffle, deal };
};

export default useBlackjackDeck;
