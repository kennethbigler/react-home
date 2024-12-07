import { GameFunctions } from "../../../jotai/blackjack-state";
import { DBHand, DBPlayer } from "../../../jotai/player-atom";
import { hitBotHelper, splitBotHelper, weighHand } from "./blackjackAI";

/** function that takes a hand of duplicates and makes 2 hands */
export const splitHelper = async (
  player: DBPlayer,
  handTurn: number,
): Promise<DBHand[]> => {
  const { hands } = player;
  const [hand1, hand2] = await splitBotHelper(hands[handTurn]);
  // update global hands
  const newHands = hands.map((item, i) => (i !== handTurn ? item : hand2));
  newHands.splice(handTurn, 0, hand1);
  return newHands;
};

/** function to get a new card */
export const hitHelper = async (
  player: DBPlayer,
  handTurn: number,
): Promise<DBHand[]> => {
  const { hands } = player;
  const newHand = await hitBotHelper(hands[handTurn]);
  const newHands = hands.map((item, i) => (i !== handTurn ? item : newHand));
  return newHands;
};

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
