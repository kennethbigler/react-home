import { GameFunctions } from "../../../jotai/blackjack-state";
import { DBCard } from "../../../jotai/deck-state";
import { DBHand, DBPlayer } from "../../../jotai/player-atom";

export const DEALER = 0;

/** calculate the weight of a hand */
export function weighHand(hand: DBCard[] = []): {
  weight: number;
  soft: boolean;
} {
  // set return values
  let weight = 0;
  let soft = false;

  // find the weight of the hand
  hand.forEach((card) => {
    const cardWeight = card.weight || 0;
    if (cardWeight === 14) {
      // A
      if (weight <= 10) {
        weight += 11;
        soft = true;
      } else {
        weight += 1;
      }
    } else if (cardWeight > 10) {
      // J - K
      weight += 10;
    } else {
      // 2 - 10
      weight += cardWeight;
    }
    // reduce by 10 if bust and soft
    if (weight > 21 && soft) {
      weight -= 10;
      soft = false;
    }
  });

  // return object w/ useful information
  return { weight, soft };
}

/** finish the game and check for a winner */
export const banking = (players: DBPlayer[]): DBPlayer[] => {
  const dealer = players.find((p) => p.id === DEALER);
  const dWeight = dealer?.hands[0].weight || 0;
  const dLength = dealer?.hands[0].cards.length || 0;

  // Accumulate house winnings across all non-dealer players
  let houseTotal = 0;

  // Settle each non-dealer player independently, tracking per-hand payouts
  const settledPlayers = players.map((player) => {
    if (player.id === DEALER) return player; // update dealer below

    const { bet } = player;
    let playerPayout = 0;

    player.hands.forEach((hand) => {
      const { weight = 0, cards } = hand;
      if (dWeight === 21 && dLength === 2) {
        // dealer Blackjack beats everyone
        houseTotal += bet;
        playerPayout -= bet;
      } else if (weight === 21 && cards.length === 2) {
        // player Blackjack pays 6:5
        const winAmount = Math.floor((6 / 5) * bet);
        houseTotal -= winAmount;
        playerPayout += winAmount;
      } else if (weight <= 21 && (weight > dWeight || dWeight > 21)) {
        // player wins
        houseTotal -= bet;
        playerPayout += bet;
      } else if (weight <= 21 && weight === dWeight) {
        // push — no money changes hands
      } else {
        // player loses
        houseTotal += bet;
        playerPayout -= bet;
      }
    });

    const status =
      playerPayout > 0 ? "win" : playerPayout < 0 ? "lose" : "push";
    return { ...player, status, money: player.money + playerPayout };
  });

  // Update dealer using the fully accumulated house total
  const dealerStatus =
    houseTotal > 0 ? "win" : houseTotal < 0 ? "lose" : "push";
  return settledPlayers.map((player) => {
    if (player.id === DEALER) {
      return {
        ...player,
        status: dealerStatus,
        money: player.money + houseTotal,
      };
    }
    return player;
  });
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
