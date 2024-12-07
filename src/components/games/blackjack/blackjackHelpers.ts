import { GameFunctions } from "../../../jotai/blackjack-state";
import { DBHand } from "../../../jotai/player-atom";
import { weighHand } from "./useBlackjackAI";

/** get the game functions for the present hand */
export const getGameFunctions = (hand: DBHand): GameFunctions[] => {
  if (!hand) {
    return [];
  }

  // reset game functions
  const newGameFunctions = [GameFunctions.STAY];
  const handWeight = hand.weight || 0;

  // check if not a bust
  if (handWeight < 21) {
    newGameFunctions.push(GameFunctions.HIT);
    // check if you only have 2 cards
    if (hand.cards.length === 2) {
      newGameFunctions.push(GameFunctions.DOUBLE);
      // check if card1 and card2 have equal weight
      const { weight: weight1 } = weighHand([hand.cards[0]]);
      const { weight: weight2 } = weighHand([hand.cards[1]]);
      if (weight1 === weight2) {
        newGameFunctions.push(GameFunctions.SPLIT);
      }
    }
  }

  return newGameFunctions;
};
