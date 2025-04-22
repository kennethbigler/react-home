import { GameFunctions } from "../../../jotai/blackjack-state";
import { DBCard } from "../../../jotai/deck-state";
import { DBHand, DBPlayer } from "../../../jotai/player-atom";

export const DEALER = 0;

interface PlayerStats {
  house: number;
  payout: number;
  status: string;
}

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
  // state variables
  const dealer = players.filter((p) => p.id === DEALER)[0];
  const dWeight = dealer.hands[0].weight || 0;
  const dLength = dealer.hands[0].cards.length;
  // track and find the winners
  const playerStats: PlayerStats = { house: 0, payout: 0, status: "" };
  // helper functions
  const win = (ps: PlayerStats, bet: number, mul = 1) => {
    ps.house -= Math.floor(mul * bet);
    ps.payout = Math.floor(mul * bet);
    ps.status = "win";
  };
  const loss = (ps: PlayerStats, bet: number) => {
    ps.house += bet;
    ps.payout = -bet;
    ps.status = "lose";
  };
  return players.map((player) => {
    const { id, bet } = player;
    if (id === DEALER) {
      if (playerStats.house > 0) {
        playerStats.status = "win";
      } else if (playerStats.house < 0) {
        playerStats.status = "lose";
      } else {
        playerStats.status = "push";
      }
      return {
        ...player,
        status: playerStats.status,
        money: player.money + playerStats.house,
      };
    }
    player.hands.forEach((hand) => {
      const { weight = 0, cards } = hand;
      if (dWeight === 21 && dLength === 2) {
        // dealer BlackJack
        loss(playerStats, bet);
      } else if (weight === 21 && cards.length === 2) {
        // player BlackJack
        win(playerStats, bet, 6 / 5);
      } else if (weight <= 21 && (weight > dWeight || dWeight > 21)) {
        win(playerStats, bet);
      } else if (weight <= 21 && weight === dWeight) {
        playerStats.payout = 0;
        playerStats.status = "push";
      } else {
        loss(playerStats, bet);
      }
    });
    return {
      ...player,
      status: playerStats.status,
      money: player.money + playerStats.payout,
    };
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
