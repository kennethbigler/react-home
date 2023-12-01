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
  playBots,
  DEALER,
  getGameFunctions,
  hitHelper,
  splitHelper,
} from "./blackjackHelpers";
import Header from "./Header";
import GameTable from "../game-table";
import Deck from "../../../apis/Deck";
import { DBPlayer } from "../../../recoil/player-atom";
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
    const newHands = await splitHelper(players[turn.player], turn.hand);
    // set players
    const newPlayers = [...players];
    newPlayers[turn.player] = { ...players[turn.player], hands: newHands };
    // set gameFunctions
    const newGameFunctions: GameFunctions[] = getGameFunctions(
      newPlayers[turn.player].hands[turn.hand],
    );
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
    const newGameFunctions: GameFunctions[] = getGameFunctions(
      players[newTurn.player].hands[newTurn.hand],
    );
    setState({
      turn: newTurn,
      players,
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
    const newGameFunctions: GameFunctions[] = getGameFunctions(
      newPlayers[turn.player].hands[turn.hand],
    );
    // update game state
    setState({
      turn,
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

  // ----------     interface to GameBoard     ---------- //
  /** function to be called on card clicks */
  const cardClickHandler = (
    playerNo: number,
    handNo: number,
    cardNo: number,
  ): void => {
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
