import { useSetAtom, useStore } from "jotai";
import {
  type DBCard,
  shuffleAtom,
  dealCardsAtom,
  lastDealtCardsAtom,
} from "../../../jotai/deck-state";

/**
 * Blackjack deck operations using shared Jotai deck state.
 * Each deal() is synchronous in state: we update deck and lastDealt in one tick
 * so recursive/sequential deal calls never see stale deck (avoids duplicate cards).
 */
const useBlackjackDeck = () => {
  const store = useStore();
  const setShuffle = useSetAtom(shuffleAtom);
  const setDealCards = useSetAtom(dealCardsAtom);

  const shuffle = (): Promise<void> => {
    setShuffle();
    return Promise.resolve();
  };

  const deal = (num: number): Promise<DBCard[]> => {
    setDealCards(num);
    const cards = store.get(lastDealtCardsAtom);
    return Promise.resolve(cards);
  };

  return { shuffle, deal };
};

export default useBlackjackDeck;
