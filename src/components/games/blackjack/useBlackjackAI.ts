import { useAtom } from "jotai";
import blackjackState, {
  BlackjackState,
  GameFunctions,
  newBlackjackGame,
} from "../../../jotai/blackjack-state";
import { DBHand, DBPlayer } from "../../../jotai/player-atom";
import { TurnState } from "../../../jotai/turn-atom";
import { rankSort } from "../../../jotai/deck-state";
import useDeck, { asyncForEach } from "./api/useDeck";
import {
  banking,
  DEALER,
  getGameFunctions,
  weighHand,
} from "./blackjackHelpers";

const D_H_TURN = 0;

interface FullBlackJackState {
  turn: TurnState;
  players: DBPlayer[];
  bj: BlackjackState;
}

interface PlayBotState {
  hands: DBHand[];
  doubled?: boolean;
}

/* ------------------------------     Custom Hook     ------------------------------ */
const useBlackjackAI = () => {
  const [
    {
      turn,
      players,
      bj: { gameFunctions, hideHands },
    },
    setState,
  ] = useAtom(blackjackState);
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

  /* ------------------------------     State Manipulators     ------------------------------ */
  /** function that takes a hand of duplicates and makes 2 hands */
  const split = async (): Promise<void> => {
    // split helper
    const { hands } = players[turn.player];
    const [hand1, hand2] = await splitBotHelper(hands[turn.hand]);
    // update global hands
    const newHands = hands.map((item, i) => (i !== turn.hand ? item : hand2));
    newHands.splice(turn.hand, 0, hand1);

    // set players
    const newPlayers = [...players];
    newPlayers[turn.player] = { ...players[turn.player], hands: newHands };
    // set gameFunctions
    const newGameFunctions: GameFunctions[] = getGameFunctions(
      newPlayers[turn.player].hands[turn.hand],
    );
    // update game state
    setState({
      players: newPlayers,
      bj: { gameFunctions: newGameFunctions, hideHands },
    });
  };

  /** function to pass to the next player */
  const stay = () => {
    // get state values
    const numHands = players[turn.player].hands.length - 1;
    const newTurn =
      turn.hand < numHands
        ? { ...turn, hand: turn.hand + 1 }
        : { player: turn.player + 1, hand: 0 };
    const newGameFunctions: GameFunctions[] = getGameFunctions(
      players[newTurn.player].hands[newTurn.hand],
    );
    setState({
      turn: newTurn,
      bj: { gameFunctions: newGameFunctions, hideHands },
    });
  };

  /** function that doubles your bet, but you only get 1 card */
  const double = async (): Promise<void> => {
    const newHands = await hitHelper(players[turn.player], turn.hand);
    // set players
    const newPlayers = [...players];
    newPlayers[turn.player] = {
      ...players[turn.player],
      hands: newHands,
      bet: players[turn.player].bet * 2,
    };
    // set turn
    const lastHand = players[turn.player].hands.length - 1;
    const newTurn =
      turn.hand < lastHand
        ? { ...turn, hand: turn.hand + 1 }
        : { player: turn.player + 1, hand: 0 };
    // set gameFunctions
    let newGameFunctions: GameFunctions[] = [];
    if (!newPlayers[newTurn.player].isBot) {
      newGameFunctions = getGameFunctions(
        newPlayers[newTurn.player].hands[newTurn.hand],
      );
    }
    // update state
    setState({
      turn: newTurn,
      players: newPlayers,
      bj: { gameFunctions: newGameFunctions, hideHands },
    });
  };

  /** function to get a new card */
  const hit = async (): Promise<void> => {
    const newHands = await hitHelper(players[turn.player], turn.hand);
    // set players
    const newPlayers = [...players];
    newPlayers[turn.player] = { ...players[turn.player], hands: newHands };
    // set gameFunctions
    const newGameFunctions: GameFunctions[] = getGameFunctions(
      newPlayers[turn.player].hands[turn.hand],
    );
    // update state
    setState({
      players: newPlayers,
      bj: { gameFunctions: newGameFunctions, hideHands },
    });
  };

  /**
   * Triggered in handleGameFunctionClick
   * Starts a new game
   */
  const newGame = () => {
    setState({
      bj: newBlackjackGame(),
      players: players.map((player) => ({
        ...player,
        status: "",
        hands: [],
        bet: 5,
      })),
      turn: { player: 0, hand: 0 },
    });
  };

  /**
   * Triggered in handleGameFunctionClick
   * Finish betting and start the game
   */
  const finishBetting = async (): Promise<void> => {
    const newPlayers: DBPlayer[] = [];
    // shuffle the deck
    await shuffle().then(async () => {
      // deal the hands
      await asyncForEach(players, async (player: DBPlayer) => {
        const newCards = await deal(player.id !== DEALER ? 2 : 1);
        const cards = [...newCards];
        cards.sort(rankSort);
        const { weight, soft } = weighHand(cards);
        newPlayers.push({ ...player, hands: [{ cards, weight, soft }] });
      });
    });
    // get game functions
    const newGameFunctions: GameFunctions[] = getGameFunctions(
      newPlayers[turn.player].hands[turn.hand],
    );
    // update game state
    setState({
      players: newPlayers,
      bj: { gameFunctions: newGameFunctions, hideHands: false },
    });
  };

  const checkUpdate = async (): Promise<void> => {
    if (!hideHands && gameFunctions[0] !== (GameFunctions.NEW_GAME as string)) {
      const player = players[turn.player];
      if (!player.isBot) {
        return;
      }
      const newState = await playBots(players, turn);
      setState(newState);
    }
  };

  /** function to be called on card clicks */
  const betHandler = (id: number, bet: number) => {
    setState({
      bj: { gameFunctions, hideHands },
      players: players.map((player) =>
        player.id === id ? { ...player, bet } : player,
      ),
    });
  };

  /** function to route click actions */
  const handleClick = (type: GameFunctions) => {
    switch (type) {
      case GameFunctions.NEW_GAME:
        newGame();
        break;
      case GameFunctions.FINISH_BETTING:
        finishBetting().catch((e) => console.error(e));
        break;
      case GameFunctions.STAY:
        stay();
        break;
      case GameFunctions.HIT:
        hit().catch((e) => console.error(e));
        break;
      case GameFunctions.DOUBLE:
        double().catch((e) => console.error(e));
        break;
      case GameFunctions.SPLIT:
        split().catch((e) => console.error(e));
        break;
      default:
        // eslint-disable-next-line no-console
        console.error("Unknown Game Function: ", type);
    }
  };

  /* ------------------------------     Return used items     ------------------------------ */

  return {
    betHandler,
    checkUpdate,
    gameFunctions,
    handleClick,
    hideHands,
    players,
    turn,
  };
};

export default useBlackjackAI;
