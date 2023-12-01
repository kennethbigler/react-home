import Deck, { DBCard } from "../../../apis/Deck";
import asyncForEach from "../../../helpers/asyncForEach";
import { BlackjackState, GameFunctions } from "../../../recoil/blackjack-state";
import { DBHand, DBPlayer } from "../../../recoil/player-atom";
import { TurnState } from "../../../recoil/turn-atom";

// Dealer constant
export const DEALER = 0;
const D_H_TURN = 0;

export interface PlayerStats {
  house: number;
  payout: number;
  status: string;
}

interface FullBlackJackState {
  turn: TurnState;
  players: DBPlayer[];
  bj: BlackjackState;
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
  const win = (ps: PlayerStats, bet: number, mul = 1): void => {
    ps.house -= Math.floor(mul * bet);
    ps.payout = Math.floor(mul * bet);
    ps.status = "win";
  };
  const loss = (ps: PlayerStats, bet: number): void => {
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

/** function that takes a hand of duplicates and makes 2 hands */
export const splitHelper = async (
  player: DBPlayer,
  handTurn: number,
): Promise<DBHand[]> => {
  const { hands } = player;
  const hand = hands[handTurn];
  // get new cards
  const newCards = await Deck.deal(2);
  // create 2 hands
  const hand1: DBHand = { cards: [hand.cards[0]] };
  const hand2: DBHand = { cards: [hand.cards[1]] };
  hand1.cards.push(newCards[0]);
  hand2.cards.push(newCards[1]);
  // update hand weights
  Object.assign(hand1, weighHand(hand1.cards));
  Object.assign(hand2, weighHand(hand2.cards));
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
  // draw 1 card
  const drawnCards = await Deck.deal(1);
  // update hands
  const cards = [...hands[handTurn].cards, ...drawnCards];
  const { weight, soft } = weighHand(cards);
  const newHands = hands.map((item, i) =>
    i !== handTurn ? item : { cards, weight, soft },
  );
  return newHands;
};

/** dealer recursive function */
const playDealer = async (dealer: DBPlayer): Promise<DBPlayer> => {
  const { weight: pW, soft: pS } = weighHand(dealer.hands[D_H_TURN].cards);

  // Dealer hits on 16 or less and soft 17
  if (pW <= 16 || (pW === 17 && pS)) {
    // get state values
    const { hands } = dealer;
    // logic to hit
    const drawnCards = await Deck.deal(1);
    const cards = [...hands[D_H_TURN].cards, ...drawnCards];
    const { weight, soft } = weighHand(cards);
    const newHands = [{ cards, weight, soft }];
    // recursion
    return playDealer({ ...dealer, hands: newHands });
  }
  return dealer;
};

/** Function to play all AI players
 * AI: https://www.blackjackinfo.com/blackjack-basic-strategy-engine/
 */
export const playBots = async (
  statePlayers: DBPlayer[],
  stateTurn: TurnState,
): Promise<FullBlackJackState> => {
  const players = [...statePlayers];
  let turn = { ...stateTurn };

  /** function to pass to the next player */
  const stay = (): void => {
    const numHands = players[turn.player].hands.length - 1;
    // iterate to next hand or player
    const newTurn =
      turn.hand < numHands
        ? { ...turn, hand: turn.hand + 1 }
        : { player: turn.player + 1, hand: 0 };
    turn = newTurn;
  };

  /** function that takes a hand of duplicates and makes 2 hands */
  const split = async (): Promise<void> => {
    const newHands = await splitHelper(players[turn.player], turn.hand);
    players[turn.player] = { ...players[turn.player], hands: newHands };
  };

  /** function to get a new card */
  const hit = async (): Promise<void> => {
    const newHands = await hitHelper(players[turn.player], turn.hand);
    players[turn.player] = { ...players[turn.player], hands: newHands };
  };

  /** function that doubles your bet, but you only get 1 card */
  const double = async (): Promise<void> => {
    const newHands = await hitHelper(players[turn.player], turn.hand);
    players[turn.player] = {
      ...players[turn.player],
      hands: newHands,
      bet: players[turn.player].bet * 2,
    };
    stay();
  };

  /** function to play 1 player, link to AI above, return to stay (recursion) */
  const playBot = async (hand: DBHand, dealer: DBHand): Promise<void> => {
    if (!hand) {
      return;
    }
    const n = hand.weight || 0;
    const { soft } = hand;
    // card / dealer weight
    const { weight: d } = weighHand([dealer.cards[0]]);
    const { weight: x } = weighHand([hand.cards[0]]);
    const { weight: y } = weighHand([hand.cards[1]]);

    // play AI logic
    if (n < 22) {
      // split algorithm
      if (x === y) {
        if (x === 2 || x === 3 || x === 7) {
          // 2,3,7, split d2-7, hit d8+
          d <= 7 ? await split() : await hit();
        } else if (x === 4) {
          // 4, split d5-6, else hit
          d === 5 || d === 6 ? await split() : await hit();
        } else if (x === 5) {
          // 5, double d2-9, hit d10+
          d <= 9 ? await double() : await hit();
        } else if (x === 6) {
          // 6, split d2-6, else hit
          d <= 6 ? await split() : await hit();
        } else if (x === 9) {
          // 9, d7,10+ stay, else split
          d === 7 || d >= 10 ? stay() : await split();
        } else if (x === 8 || x === 11) {
          // 8,A split
          await split();
        } else {
          // 10 Stay
          stay();
        }
      } else if (n < 20 && soft) {
        // soft hands, A9+ stays
        if (n === 13 || n === 14) {
          // A2-A3 double d5-6, hit d2-4, d7-A
          d === 5 || d === 6 ? await double() : await hit();
        } else if (n === 15 || n === 16) {
          // A4-A5 double d4-6, hit d2-3, d7-A
          d >= 4 && d <= 6 ? await double() : await hit();
        } else if (n === 17) {
          // A6 double d3-6, hit d2, d7-A
          d >= 3 && d <= 6 ? await double() : await hit();
        } else if (n === 18) {
          // A7 double d2-6, stay d7-8, hit d9-A
          if (d >= 2 && d <= 6) {
            await double();
          } else if (d === 7 || d === 8) {
            stay();
          } else {
            await hit();
          }
        } else if (n === 19) {
          // A8 double d6, else stay
          d === 6 ? await double() : stay();
        }
      } else if (n < 17 && !soft) {
        // hard hands, 17+ stays
        if (n >= 5 && n <= 8) {
          // 5-8 hit
          await hit();
        } else if (n === 9) {
          // 9 double d3-6, hit d2, d7-A
          d >= 3 && d <= 6 ? await double() : await hit();
        } else if (n === 10) {
          // 10 double d2-9, hit d10-A
          d >= 2 && d <= 9 ? await double() : await hit();
        } else if (n === 11) {
          // 11 double
          await double();
        } else if (n === 12) {
          // 12 hit d2-3, stay d4-6, hit 7-A
          d >= 4 && d <= 6 ? stay() : await hit();
        } else if (n >= 13 && n <= 16) {
          // 13-16 stay d2-6, hit 7-A
          d >= 2 && d <= 6 ? stay() : await hit();
        }
      } else {
        stay();
      }
    } else {
      // bust
      stay();
    }
  };

  const DEALER_IDX = players.length - 1;

  const bots = players.slice(turn.player, DEALER_IDX);
  await asyncForEach(bots, async () => {
    const hand = players[turn.player].hands[turn.hand];
    const dealer = players[DEALER_IDX].hands[D_H_TURN];

    // validate hand exists
    await playBot(hand, dealer);
  });

  // play dealer
  const dealer = players[DEALER_IDX];
  const newDealer = await playDealer({ ...dealer });
  players[DEALER_IDX] = newDealer;

  // return new state
  return {
    turn,
    players: banking(players),
    bj: { gameFunctions: [GameFunctions.NEW_GAME], hideHands: false },
  };
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
