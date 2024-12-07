import * as React from "react";
import { useAtom } from "jotai";
import Typography from "@mui/material/Typography";
import GameTable from "../game-table";
import asyncForEach from "../../../apis/asyncForEach";
import useDeck, { rankSort } from "../../../apis/useDeck";
import { computer, findAndPayWinner } from "./helpers";
import pokerState, {
  PokerGameFunctions as PGF,
  newPokerGameState,
} from "../../../jotai/poker-state";
import { DBPlayer, defaultWeigh } from "../../../jotai/player-atom";
import PlayerMenu from "../../common/header/PlayerMenu";

const Poker = React.memo(() => {
  const [{ poker, turn, players }, setState] = useAtom(pokerState);
  const { deal, shuffle } = useDeck();
  const { cardsToDiscard, gameFunctions, gameOver, hideHands } = poker;

  // ----------     bot automation handlers     ---------- //
  /** iterate through array, removing each index number from hand
   * then add new cards to the hand */
  const discard = async (
    cardsToDiscardInDB: number[],
    player: DBPlayer,
  ): Promise<DBPlayer> => {
    const { hands } = player;
    const newPlayer = { ...player };
    const cards = [...hands[0].cards];

    try {
      // Swap Cards
      const newCards = await deal(cardsToDiscardInDB.length);
      cardsToDiscardInDB.forEach((discardIdx, i) => {
        cards[discardIdx] = newCards[i];
      });
      cards.sort(rankSort);
      const { weight, soft } = defaultWeigh(cards);
      // Update Hand
      newPlayer.hands = [{ cards, weight, soft }];
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }

    return newPlayer;
  };

  const checkUpdate = async (): Promise<void> => {
    try {
      if (!hideHands && !gameOver && players[turn.player]?.isBot) {
        const newPlayers = [...players];

        // returns immutable new players
        await asyncForEach(players, async (player: DBPlayer, i: number) => {
          if (turn.player <= i) {
            const newPlayer = await computer(player, discard);
            newPlayers[i] = newPlayer;
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
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  };

  // ----------     player handlers     ---------- //
  /** function to finish betting and start the game */
  const startGame = async (): Promise<void> => {
    // shuffle the deck
    await shuffle()
      .then(async () => {
        const newPlayers = [...players];
        // deal the hands
        await asyncForEach(players, async (player: DBPlayer) => {
          // New Hand
          const cards = await deal(5);
          cards.sort(rankSort);
          const { weight, soft } = defaultWeigh(cards);

          // Create New Hand
          const pi = players.findIndex((p) => p.id === player.id);
          if (pi !== -1) {
            const newPlayer = {
              ...newPlayers[pi],
              hands: [{ cards, weight, soft }],
            };
            newPlayers[pi] = newPlayer;
          }
        });
        setState({
          players: newPlayers,
          turn,
          poker: {
            cardsToDiscard,
            gameFunctions: [PGF.DISCARD_CARDS],
            gameOver,
            hideHands: false,
          },
        });
      })
      .catch((e) => {
        console.error(e); // eslint-disable-line no-console
      });
  };

  /** helper function wrapping discard, meant for UI */
  const handleDiscard = async (
    tempPlayers: DBPlayer[],
    tempTurn: number,
    tempCardsToDiscard: number[],
  ): Promise<void> => {
    try {
      const newPlayers = [...players];
      const newPlayer = await discard(
        tempCardsToDiscard,
        tempPlayers[tempTurn],
      );
      newPlayers[tempTurn] = newPlayer;
      setState({
        poker: {
          cardsToDiscard: [],
          gameFunctions: [PGF.END_TURN],
          gameOver,
          hideHands,
        },
        turn,
        players: newPlayers,
      });
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  };

  /** function to route click actions */
  const handleGameFunctionClick = async (type: PGF) => {
    try {
      const newPlayers: DBPlayer[] = [];

      switch (type) {
        case PGF.DISCARD_CARDS:
          await handleDiscard(players, turn.player, cardsToDiscard);
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
            players,
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
          await startGame();
          break;
        default:
          // eslint-disable-next-line no-console
          console.error("Unknown Game Function: ", type);
      }
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
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
      turn,
      players,
    });
  };

  checkUpdate().catch(() => {
    // eslint-disable-next-line no-console
    console.error("check update failed");
  });

  return (
    <>
      <div className="flex-container">
        <Typography variant="h2" component="h1" gutterBottom>
          5 Card Draw Poker
        </Typography>
        <PlayerMenu />
      </div>
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
