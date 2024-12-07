import useDeck, { DBCard } from "../../../apis/useDeck";
import asyncForEach from "../../../apis/asyncForEach";
import { BlackjackState, GameFunctions } from "../../../jotai/blackjack-state";
import { DBHand, DBPlayer } from "../../../jotai/player-atom";
import { TurnState } from "../../../jotai/turn-atom";

// Dealer constant
export const DEALER = 0;
const D_H_TURN = 0;

interface PlayerStats {
  house: number;
  payout: number;
  status: string;
}

interface FullBlackJackState {
  turn: TurnState;
  players: DBPlayer[];
  bj: BlackjackState;
}

interface PlayBotState {
  hands: DBHand[];
  doubled?: boolean;
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
const banking = (players: DBPlayer[]): DBPlayer[] => {
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

const useBlackjackAI = () => {
  const { shuffle, deal } = useDeck();
  /** function to get a new card */
  const hitBotHelper = async (hand: DBHand): Promise<DBHand> => {
    // draw 1 card
    const drawnCards = await deal(1);
    // update hands
    const cards = [...hand.cards, ...drawnCards];
    const { weight, soft } = weighHand(cards);
    const newHand = { cards, weight, soft };
    return newHand;
  };

  /** function that takes a hand of duplicates and makes 2 hands */
  const splitBotHelper = async (hand: DBHand): Promise<DBHand[]> => {
    // get new cards
    const newCards = await deal(2);
    // create 2 hands
    const hand1: DBHand = { cards: [hand.cards[0]] };
    const hand2: DBHand = { cards: [hand.cards[1]] };
    hand1.cards.push(newCards[0]);
    hand2.cards.push(newCards[1]);
    // update hand weights
    Object.assign(hand1, weighHand(hand1.cards));
    Object.assign(hand2, weighHand(hand2.cards));
    // return new hands
    return [hand1, hand2];
  };

  /** dealer recursive function */
  const playDealer = async (dealer: DBPlayer): Promise<DBPlayer> => {
    const { weight: pW, soft: pS } = weighHand(dealer.hands[D_H_TURN].cards);

    // Dealer hits on 16 or less and soft 17
    if (pW <= 16 || (pW === 17 && pS)) {
      // get state values
      const { hands } = dealer;
      // logic to hit
      const drawnCards = await deal(1);
      const cards = [...hands[D_H_TURN].cards, ...drawnCards];
      const { weight, soft } = weighHand(cards);
      const newHands = [{ cards, weight, soft }];
      // recursion
      return playDealer({ ...dealer, hands: newHands });
    }
    return dealer;
  };

  /** function to play 1 player, link to AI above, return to stay (recursion) */
  const playBot = async (
    hand: DBHand,
    dealer: DBHand,
  ): Promise<PlayBotState> => {
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
          if (d <= 7) {
            // split
            const [hand1, hand2] = await splitBotHelper(hand);
            const { hands: hands1 } = await playBot(hand1, dealer);
            const { hands: hands2 } = await playBot(hand2, dealer);
            return { hands: [...hands1, ...hands2] };
          }
          // hit
          const newHand = await hitBotHelper(hand);
          return playBot(newHand, dealer);
        }
        if (x === 4) {
          // 4, split d5-6, else hit
          if (d === 5 || d === 6) {
            // split
            const [hand1, hand2] = await splitBotHelper(hand);
            const { hands: hands1 } = await playBot(hand1, dealer);
            const { hands: hands2 } = await playBot(hand2, dealer);
            return { hands: [...hands1, ...hands2] };
          }
          // hit
          const newHand = await hitBotHelper(hand);
          return playBot(newHand, dealer);
        }
        if (x === 5) {
          // 5, double d2-9, hit d10+
          if (d <= 9) {
            // double
            const newHand = await hitBotHelper(hand);
            return { hands: [newHand], doubled: true };
          }
          // hit
          const newHand = await hitBotHelper(hand);
          return playBot(newHand, dealer);
        }
        if (x === 6) {
          // 6, split d2-6, else hit
          if (d <= 6) {
            // split
            const [hand1, hand2] = await splitBotHelper(hand);
            const { hands: hands1 } = await playBot(hand1, dealer);
            const { hands: hands2 } = await playBot(hand2, dealer);
            return { hands: [...hands1, ...hands2] };
          }
          // hit
          const newHand = await hitBotHelper(hand);
          return playBot(newHand, dealer);
        }
        if (x === 9) {
          // 9, d7,10+ stay, else split
          if (d === 7 || d >= 10) {
            return { hands: [hand] }; // stay
          }
          // split
          const [hand1, hand2] = await splitBotHelper(hand);
          const { hands: hands1 } = await playBot(hand1, dealer);
          const { hands: hands2 } = await playBot(hand2, dealer);
          return { hands: [...hands1, ...hands2] };
        }
        if (x === 8 || x === 11) {
          // 8,A split
          const [hand1, hand2] = await splitBotHelper(hand);
          const { hands: hands1 } = await playBot(hand1, dealer);
          const { hands: hands2 } = await playBot(hand2, dealer);
          return { hands: [...hands1, ...hands2] };
        }
        // 10 Stay
        return { hands: [hand] }; // stay
      }
      if (n < 20 && soft) {
        // soft hands, A9+ stays
        if (n === 13 || n === 14) {
          // A2-A3 double d5-6, hit d2-4, d7-A
          if (d === 5 || d === 6) {
            // double
            const newHand = await hitBotHelper(hand);
            return { hands: [newHand], doubled: true };
          }
          // hit
          const newHand = await hitBotHelper(hand);
          return playBot(newHand, dealer);
        }
        if (n === 15 || n === 16) {
          // A4-A5 double d4-6, hit d2-3, d7-A
          if (d >= 4 && d <= 6) {
            // double
            const newHand = await hitBotHelper(hand);
            return { hands: [newHand], doubled: true };
          }
          // hit
          const newHand = await hitBotHelper(hand);
          return playBot(newHand, dealer);
        }
        if (n === 17) {
          // A6 double d3-6, hit d2, d7-A
          if (d >= 3 && d <= 6) {
            // double
            const newHand = await hitBotHelper(hand);
            return { hands: [newHand], doubled: true };
          }
          // hit
          const newHand = await hitBotHelper(hand);
          return playBot(newHand, dealer);
        }
        if (n === 18) {
          // A7 double d2-6, stay d7-8, hit d9-A
          if (d >= 2 && d <= 6) {
            // double
            const newHand = await hitBotHelper(hand);
            return { hands: [newHand], doubled: true };
          }
          if (d === 7 || d === 8) {
            return { hands: [hand] }; // stay
          }
          // hit
          const newHand = await hitBotHelper(hand);
          return playBot(newHand, dealer);
        }
        if (n === 19) {
          // A8 double d6, else stay
          if (d === 6) {
            // double
            const newHand = await hitBotHelper(hand);
            return { hands: [newHand], doubled: true };
          }
          return { hands: [hand] }; // stay
        }
      } else if (n < 17 && !soft) {
        // hard hands, 17+ stays
        if (n >= 5 && n <= 8) {
          // 5-8 hit
          // hit
          const newHand = await hitBotHelper(hand);
          return playBot(newHand, dealer);
        }
        if (n === 9) {
          // 9 double d3-6, hit d2, d7-A
          if (d >= 3 && d <= 6) {
            // double
            const newHand = await hitBotHelper(hand);
            return { hands: [newHand], doubled: true };
          }
          // hit
          const newHand = await hitBotHelper(hand);
          return playBot(newHand, dealer);
        }
        if (n === 10) {
          // 10 double d2-9, hit d10-A
          if (d >= 2 && d <= 9) {
            // double
            const newHand = await hitBotHelper(hand);
            return { hands: [newHand], doubled: true };
          }
          // hit
          const newHand = await hitBotHelper(hand);
          return playBot(newHand, dealer);
        }
        if (n === 11) {
          // 11 double
          const newHand = await hitBotHelper(hand);
          return { hands: [newHand], doubled: true };
        }
        if (n === 12) {
          // 12 hit d2-3, stay d4-6, hit 7-A
          if (d >= 4 && d <= 6) {
            return { hands: [hand] };
          }
          // hit
          const newHand = await hitBotHelper(hand);
          return playBot(newHand, dealer);
        }
        if (n >= 13 && n <= 16) {
          // 13-16 stay d2-6, hit 7-A
          if (d >= 2 && d <= 6) {
            return { hands: [hand] }; // stay
          }
          // hit
          const newHand = await hitBotHelper(hand);
          return playBot(newHand, dealer);
        }
      } else {
        return { hands: [hand] }; // stay
      }
    } else {
      // bust
      return { hands: [hand] }; // stay
    }
    return { hands: [hand] }; // stay
  };

  /** Function to play all AI players
   * AI: https://www.blackjackinfo.com/blackjack-basic-strategy-engine/
   */
  const playBots = async (
    statePlayers: DBPlayer[],
    stateTurn: TurnState,
  ): Promise<FullBlackJackState> => {
    // get state
    const players = [...statePlayers];
    let turn = { ...stateTurn };

    // play each bot
    const DEALER_IDX = players.length - 1;
    const dealerHand = players[DEALER_IDX].hands[D_H_TURN];
    const bots = players.slice(turn.player, DEALER_IDX);
    await asyncForEach(bots, async (bot) => {
      const { hands, doubled } = await playBot(bot.hands[D_H_TURN], dealerHand);
      players[turn.player] = {
        ...players[turn.player],
        hands,
        bet: players[turn.player].bet * (doubled ? 2 : 1),
      };
      turn = { player: turn.player + 1, hand: D_H_TURN };
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

  /** function that takes a hand of duplicates and makes 2 hands */
  const splitHelper = async (
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
  const hitHelper = async (
    player: DBPlayer,
    handTurn: number,
  ): Promise<DBHand[]> => {
    const { hands } = player;
    const newHand = await hitBotHelper(hands[handTurn]);
    const newHands = hands.map((item, i) => (i !== handTurn ? item : newHand));
    return newHands;
  };

  return { playBots, hitHelper, splitHelper, shuffle, deal };
};

export default useBlackjackAI;
