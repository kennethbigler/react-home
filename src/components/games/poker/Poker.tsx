import * as React from "react";
import { useAtom, useSetAtom } from "jotai";
import GameTable from "../game-table";
import { shuffleAtom, dealPokerAtom } from "../../../jotai/deck-state";
import { computer, findAndPayWinner } from "./helpers";
import pokerState, {
  PokerGameFunctions as PGF,
  newPokerGameState,
} from "../../../jotai/poker-state";
import { DBPlayer } from "../../../jotai/player-atom";
import Header from "./Header";

const Poker = React.memo(() => {
  const [{ poker, turn, players }, setState] = useAtom(pokerState);
  const shuffle = useSetAtom(shuffleAtom);
  const deal = useSetAtom(dealPokerAtom);
  const { cardsToDiscard, gameFunctions, gameOver, hideHands } = poker;

  // ----------     bot automation handlers     ---------- //
  /** iterate through array, removing each index number from hand
   * then add new cards to the hand */
  const discard = (cardsToDiscardInDB: number[], player: DBPlayer) => {
    const { hands, id } = player;
    const cards = [...hands[0].cards];

    cardsToDiscardInDB.sort().forEach((dIdx, i) => {
      cards.splice(dIdx - i, 1);
    });

    deal(cardsToDiscardInDB.length, id, cards);
  };

  const checkUpdate = () => {
    if (!hideHands && !gameOver && players[turn.player]?.isBot) {
      const newPlayers = [...players];

      // returns immutable new players
      players.forEach((player: DBPlayer, i: number) => {
        if (turn.player <= i) {
          computer(player, discard);
        }
      });

      // modifies money in newPlayers obj
      findAndPayWinner(newPlayers);

      // update state once
      setState({
        poker: {
          cardsToDiscard,
          gameFunctions: [PGF.NEW_GAME],
          gameOver: true,
          hideHands,
        },
        players: newPlayers,
        turn: { player: 0, hand: 0 },
      });
    }
  };

  // ----------     player handlers     ---------- //
  /** function to finish betting and start the game */
  const startGame = () => {
    // shuffle the deck
    shuffle();
    // deal the hands
    players.forEach((player: DBPlayer) => {
      // New Hand
      deal(5, player.id);
    });
    setState({
      poker: {
        cardsToDiscard,
        gameFunctions: [PGF.DISCARD_CARDS],
        gameOver,
        hideHands: false,
      },
    });
  };

  /** helper function wrapping discard, meant for UI */
  const handleDiscard = (
    tempPlayers: DBPlayer[],
    tempTurn: number,
    tempCardsToDiscard: number[],
  ) => {
    discard(tempCardsToDiscard, tempPlayers[tempTurn]);
    setState({
      poker: {
        cardsToDiscard: [],
        gameFunctions: [PGF.END_TURN],
        gameOver,
        hideHands,
      },
    });
  };

  /** function to route click actions */
  const handleGameFunctionClick = (type: PGF) => {
    const newPlayers: DBPlayer[] = [];

    switch (type) {
      case PGF.DISCARD_CARDS:
        handleDiscard(players, turn.player, cardsToDiscard);
        break;
      case PGF.END_TURN:
        setState({
          poker: {
            cardsToDiscard: [],
            gameFunctions: [PGF.DISCARD_CARDS],
            gameOver,
            hideHands,
          },
          turn: { player: turn.player + 1, hand: 0 },
        });
        break;
      case PGF.NEW_GAME:
        players.forEach((player) =>
          newPlayers.push({
            ...player,
            status: "",
            hands: [],
            bet: 5,
          }),
        );
        setState({
          poker: newPokerGameState(),
          turn: { player: 0, hand: 0 },
          players: newPlayers,
        });
        break;
      case PGF.START_GAME:
        startGame();
        break;
      default:
        // eslint-disable-next-line no-console
        console.error("Unknown Game Function: ", type);
    }
  };

  /** function to be called on card clicks */
  const cardClickHandler = (
    _playerNo: number,
    _handNo: number,
    cardNo: number,
  ): void => {
    const newCardsToDiscard = [...cardsToDiscard];
    // find card
    const i = newCardsToDiscard.indexOf(cardNo);
    // toggle in array
    if (i === -1) {
      newCardsToDiscard.push(cardNo);
    } else {
      newCardsToDiscard.splice(i, 1);
    }
    // update state
    setState({
      poker: {
        cardsToDiscard: newCardsToDiscard,
        gameFunctions,
        gameOver,
        hideHands,
      },
    });
  };

  checkUpdate();

  return (
    <>
      <Header />
      <GameTable
        cardClickHandler={cardClickHandler}
        cardsToDiscard={cardsToDiscard}
        gameFunctions={gameFunctions}
        onClick={handleGameFunctionClick as (name: string) => void}
        gameOver={gameOver}
        hideHands={hideHands}
        isBlackJack={false}
        players={players}
        turn={turn}
      />
    </>
  );
});

Poker.displayName = "Poker";

export default Poker;
