/* Theoretical Max Score:   386 everyone splits 3 times and busts with 30, dealer bust with 26
 * Card Point Value:        340-380
 * split aces is not blackjack
 * get second card for dealer and hide it
 * buy insurance on dealer's Ace
 */
import * as React from "react";
import { useRecoilState } from "recoil";
import asyncForEach from "../../../helpers/asyncForEach";
import {
  weighHand,
  playBot,
  banking,
  DEALER,
  getGameFunctions,
} from "./blackjackHelpers";
import Header from "./Header";
import GameTable from "../game-table";
import Deck from "../../../apis/Deck";
import { DBHand, DBPlayer } from "../../../recoil/player-atom";
import blackjackState, {
  GameFunctions,
  newBlackjackGame,
} from "../../../recoil/blackjack-state";

const BlackJack: React.FC = () => {
  const [
    {
      turn,
      players,
      bj: { gameFunctions, hideHands },
    },
    setState,
  ] = useRecoilState(blackjackState);

  /** function that takes a hand of duplicates and makes 2 hands */
  const split = async (): Promise<void> => {
    // get state values
    const { hands } = players[turn.player];

    const newCards = await Deck.deal(2);

    const hand = hands[turn.hand];
    // split the hands into 2
    const hand1: DBHand = { cards: [hand.cards[0]] };
    const hand2: DBHand = { cards: [hand.cards[1]] };

    hand1.cards.push(newCards[0]);
    hand2.cards.push(newCards[1]);

    // update the weights
    Object.assign(hand1, weighHand(hand1.cards));
    Object.assign(hand2, weighHand(hand2.cards));
    // update global hands
    const newHands = hands.map((item, i) => (i !== turn.hand ? item : hand2));
    newHands.splice(turn.hand, 0, hand1);

    const newPlayers = [...players];
    newPlayers[turn.player] = { ...players[turn.player], hands: newHands };

    let newGameFunctions: GameFunctions[] = [];
    if (!newPlayers[turn.player].isBot) {
      newGameFunctions = getGameFunctions(
        newPlayers[turn.player].hands[turn.hand],
      );
    }

    // update game state
    setState({
      turn,
      players: newPlayers,
      bj: { gameFunctions: newGameFunctions, hideHands },
    });
  };

  /** function to pass to the next player */
  const stay = (): void => {
    // get state values
    const numHands = players[turn.player].hands.length - 1;
    const newTurn =
      turn.hand < numHands
        ? { ...turn, hand: turn.hand + 1 }
        : { player: turn.player + 1, hand: 0 };
    let newGameFunctions: GameFunctions[] = [];
    if (!players[newTurn.player].isBot) {
      newGameFunctions = getGameFunctions(
        players[newTurn.player].hands[newTurn.hand],
      );
    }
    // check if the player has more than 1 hand
    setState({
      turn: newTurn,
      players,
      bj: { gameFunctions: newGameFunctions, hideHands },
    });
  };

  /** function that doubles your bet, but you only get 1 card */
  const double = async (): Promise<void> => {
    const { hands } = players[turn.player];

    // Draw Card
    const drawnCards = await Deck.deal(1);
    const cards = [...hands[turn.hand].cards, ...drawnCards];
    const { weight, soft } = weighHand(cards);
    const newHands = hands.map((item, i) =>
      i !== turn.hand ? item : { cards, weight, soft },
    );
    // create new players object
    const newPlayers = [...players];
    newPlayers[turn.player] = {
      ...players[turn.player],
      hands: newHands,
      bet: players[turn.player].bet * 2,
    };
    // get state values
    const lastHand = players[turn.player].hands.length - 1;
    const newTurn =
      turn.hand < lastHand
        ? { ...turn, hand: turn.hand + 1 }
        : { player: turn.player + 1, hand: 0 };
    let newGameFunctions: GameFunctions[] = [];
    if (!newPlayers[newTurn.player].isBot) {
      newGameFunctions = getGameFunctions(
        newPlayers[newTurn.player].hands[newTurn.hand],
      );
    }
    // check if the player has more than 1 hand
    setState({
      turn: newTurn,
      players: newPlayers,
      bj: { gameFunctions: newGameFunctions, hideHands },
    });
  };

  /** function to get a new card */
  const hit = async (): Promise<void> => {
    // get state values
    const { hands } = players[turn.player];

    // logic to hit
    const drawnCards = await Deck.deal(1);
    const cards = [...hands[turn.hand].cards, ...drawnCards];
    const { weight, soft } = weighHand(cards);
    const newHands = hands.map((item, i) =>
      i !== turn.hand ? item : { cards, weight, soft },
    );
    // create new players object
    const newPlayers = [...players];
    newPlayers[turn.player] = { ...players[turn.player], hands: newHands };
    // get new game functions
    let newGameFunctions: GameFunctions[] = [];
    if (!newPlayers[turn.player].isBot) {
      newGameFunctions = getGameFunctions(
        newPlayers[turn.player].hands[turn.hand],
      );
    }
    // update state
    setState({
      turn,
      players: newPlayers,
      bj: { gameFunctions: newGameFunctions, hideHands },
    });
  };

  /**
   * Triggered in handleGameFunctionClick
   * Starts a new game
   */
  const newGame = (): void => {
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
    await Deck.shuffle().then(async () => {
      // deal the hands
      await asyncForEach(players, async (player: DBPlayer) => {
        const newCards = await Deck.deal(player.id !== DEALER ? 2 : 1);
        const cards = [...newCards];
        cards.sort(Deck.rankSort);
        const { weight, soft } = weighHand(cards);
        newPlayers.push({ ...player, hands: [{ cards, weight, soft }] });
      });
    });
    // get game functions
    let newGameFunctions: GameFunctions[] = [];
    if (!newPlayers[turn.player].isBot) {
      newGameFunctions = getGameFunctions(
        newPlayers[turn.player].hands[turn.hand],
      );
    }
    // update game state
    setState({
      turn,
      players: newPlayers,
      bj: { gameFunctions: newGameFunctions, hideHands: false },
    });
  };

  /** function to execute dealer logic */
  const playDealer = async (): Promise<void> => {
    const dealer = players.filter((p) => p.id === DEALER)[0];
    const { weight: tempW, soft: tempS } = weighHand(dealer.hands[0].cards);

    // Dealer hits on 16 or less and soft 17
    if (tempW <= 16 || (tempW === 17 && tempS)) {
      // get state values
      const { hands } = players.filter((p) => p.id === DEALER)[0];
      // logic to hit
      const drawnCards = await Deck.deal(1);
      const cards = [...hands[turn.hand].cards, ...drawnCards];
      const { weight, soft } = weighHand(cards);
      const newHands = hands.map((item, i) =>
        i !== turn.hand ? item : { cards, weight, soft },
      );
      // create new players object
      const newPlayers = [...players];
      newPlayers[players.length - 1] = {
        ...players[players.length - 1],
        hands: newHands,
      };
      // update state
      setState({
        bj: { gameFunctions, hideHands },
        turn,
        players: newPlayers,
      });
    } else {
      const newPlayers = banking(players);
      // update game functions
      setState({
        turn,
        players: newPlayers,
        bj: { gameFunctions: [GameFunctions.NEW_GAME], hideHands },
      });
    }
  };

  const checkUpdate = async (): Promise<void> => {
    const player = players[turn.player];
    if (!player.isBot || hideHands) {
      return;
    }

    if (player.id !== DEALER) {
      const hand = players[turn.player].hands[turn.hand];
      const dealer = players[players.length - 1].hands[0];
      await playBot(hand, dealer, double, hit, split, stay);
    } else if (!gameFunctions.includes(GameFunctions.NEW_GAME)) {
      await playDealer();
    }
  };

  // ----------     interface to GameBoard     ---------- //
  /** function to be called on card clicks */
  const cardClickHandler = (
    playerNo: number,
    handNo: number,
    cardNo: number,
  ): void => {
    // eslint-disable-next-line no-console
    console.log(players[playerNo].hands[handNo].cards[cardNo]);
  };

  /** function to be called on card clicks */
  const betHandler = (id: number, _event: Event, bet: number): void => {
    setState({
      bj: { gameFunctions, hideHands },
      turn,
      players: players.map((player) =>
        player.id === id ? { ...player, bet } : player,
      ),
    });
  };

  /** function to route click actions */
  const handleGameFunctionClick = (type: GameFunctions): void => {
    switch (type) {
      case GameFunctions.NEW_GAME:
        newGame();
        break;
      case GameFunctions.FINISH_BETTING:
        finishBetting().catch((e) => console.log(e));
        break;
      case GameFunctions.STAY:
        stay();
        break;
      case GameFunctions.HIT:
        hit().catch((e) => console.log(e));
        break;
      case GameFunctions.DOUBLE:
        double().catch((e) => console.log(e));
        break;
      case GameFunctions.SPLIT:
        split().catch((e) => console.log(e));
        break;
      default:
        // eslint-disable-next-line no-console
        console.error("Unknown Game Function: ", type);
    }
  };

  /* render the UI */
  checkUpdate().catch((e) => console.log(e));

  return (
    <>
      <Header />
      <GameTable
        betHandler={betHandler}
        cardClickHandler={cardClickHandler}
        gameFunctions={gameFunctions}
        onClick={handleGameFunctionClick as (type: string) => void}
        hideHands={hideHands}
        players={players}
        turn={turn}
      />
    </>
  );
};

export default BlackJack;
