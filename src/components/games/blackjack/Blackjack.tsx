/* Theoretical Max Score:   386 everyone splits 3 times and busts with 30, dealer bust with 26
 * Card Point Value:        340-380
 * split aces is not blackjack
 * get second card for dealer and hide it
 * buy insurance on dealer's Ace
 */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import asyncForEach from "../../../helpers/asyncForEach";
import { weighHand, playBot, banking, DEALER } from "./blackjackHelpers";
import Header from "./Header";
import GameTable from "../game-table";
import Deck from "../../../apis/Deck";
import { DBRootState } from "../../../store/types";
import {
  doubleHand,
  hitHand,
  setNewGame,
  splitHand,
  stayHand,
  updateGameFunctions,
  updateHasFunctions,
  updateHideHands,
  GameFunctions,
} from "../../../store/modules/blackjack";
import { payout, updateBet } from "../../../store/modules/players";
import { newHand } from "../../../store/modules/players-thunks";
import { DBHand, DBPlayer } from "../../../store/modules/types";

const BlackJack: React.FC = () => {
  const { turn, players, gameFunctions, hideHands, hasFunctions } = useSelector(
    (state: DBRootState) => ({
      ...state.blackjack,
      players: state.players,
      turn: state.turn,
    })
  );
  const dispatch = useDispatch();

  /** get the game functions for the present hand */
  const getGameFunctions = React.useCallback(
    (hand: DBHand): void => {
      if (!hand) {
        return;
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

      // update game state
      dispatch(updateGameFunctions(newGameFunctions));
      dispatch(updateHasFunctions(true));
    },
    [dispatch]
  );

  /** function that takes a hand of duplicates and makes 2 hands */
  const split = (): void => {
    // get state values
    const { id, hands } = players[turn.player];
    dispatch(splitHand({ hands, id, hNum: turn.hand, weigh: weighHand }));
  };

  /** function to pass to the next player */
  const stay = (): void => {
    // get state values
    const lastHand = players[turn.player].hands.length - 1;
    // check if the player has more than 1 hand
    dispatch(stayHand(turn.hand < lastHand));
  };

  /** function that doubles your bet, but you only get 1 card */
  const double = (): void => {
    dispatch(
      doubleHand({ player: players[turn.player], turn, weigh: weighHand })
    );
  };

  /** function to get a new card */
  const hit = (): void => {
    // get state values
    const { id, hands } = players[turn.player];
    // logic to hit
    dispatch(hitHand({ hands, id, hNum: turn.hand, weigh: weighHand }));
  };

  /** Start a new round of hands */
  const dealHands = React.useCallback(
    (tempPlayers: DBPlayer[]): void => {
      // shuffle the deck
      Deck.shuffle()
        .then(async () => {
          // deal the hands
          await asyncForEach(tempPlayers, async (player: DBPlayer) => {
            const num = player.id !== DEALER ? 2 : 1;
            await dispatch(newHand({ id: player.id, num, weigh: weighHand }));
          });
        })
        .catch(() => {
          // eslint-disable-next-line no-console
          console.error("something went wrong with the shuffle");
        });
      dispatch(updateHasFunctions(false));
    },
    [dispatch]
  );

  /** Start a new game */
  const newGame = React.useCallback(
    (tempPlayers: DBPlayer[]): void => {
      dispatch(setNewGame(tempPlayers));
    },
    [dispatch]
  );

  /** function to finish betting and start the game */
  const finishBetting = React.useCallback(
    (tempPlayers: DBPlayer[]): void => {
      dispatch(updateHideHands(false));
      dealHands(tempPlayers);
    },
    [dispatch, dealHands]
  );

  /** extract dispatch call to payout player */
  const payoutPlayer = React.useCallback(
    (id: number, status: string, money: number) => {
      dispatch(payout({ id, status, money }));
    },
    [dispatch]
  );

  /** function to get a new card */
  const hitDealer = React.useCallback(
    (tempPlayers: DBPlayer[]): void => {
      // get state values
      const { hands } = tempPlayers.filter((p) => p.id === DEALER)[0];
      // logic to hit
      dispatch(hitHand({ hands, id: DEALER, hNum: 0, weigh: weighHand }));
    },
    [dispatch]
  );

  /** function to execute dealer logic */
  const playDealer = React.useCallback(
    (tempPlayers: DBPlayer[]): void => {
      const dealer = tempPlayers.filter((p) => p.id === DEALER)[0];
      const hand = dealer.hands[0].cards;
      const { weight, soft } = weighHand(hand);
      // Dealer hits on 16 or less and soft 17
      if (weight <= 16 || (weight === 17 && soft)) {
        dispatch(updateHasFunctions(true));
        hitDealer(tempPlayers);
      } else {
        banking(tempPlayers, payoutPlayer);
        // update game functions
        dispatch(updateGameFunctions([GameFunctions.NEW_GAME]));
      }
    },
    [dispatch, hitDealer, payoutPlayer]
  );

  const checkUpdate = (): void => {
    const player = players[turn.player];

    if (hasFunctions || hideHands) {
      return;
    }
    if (player) {
      if (!player.isBot && player.id !== DEALER) {
        getGameFunctions(player.hands[turn.hand]);
        return;
      }
      if (player.isBot && player.id !== DEALER) {
        const hand = players[turn.player].hands[turn.hand];
        const dealer = players[players.length - 1].hands[0];
        playBot(hand, dealer, double, hit, split, stay);
        return;
      }
    }
    !gameFunctions.includes(GameFunctions.NEW_GAME) && playDealer(players);
  };

  /** function to be called on card clicks */
  const cardClickHandler = React.useCallback(
    (playerNo: number, handNo: number, cardNo: number): void => {
      // eslint-disable-next-line no-console
      console.log(players[playerNo].hands[handNo].cards[cardNo]);
    },
    [players]
  );

  /** function to be called on card clicks */
  const betHandler = React.useCallback(
    (id: number, event: Event, bet: number): void => {
      dispatch(updateBet({ id, bet }));
    },
    [dispatch]
  );

  /** function to route click actions */
  const handleGameFunctionClick = (type: string): void => {
    switch (type) {
      case GameFunctions.NEW_GAME:
        newGame(players);
        break;
      case GameFunctions.FINISH_BETTING:
        finishBetting(players);
        break;
      case GameFunctions.STAY:
        stay();
        break;
      case GameFunctions.HIT:
        hit();
        break;
      case GameFunctions.DOUBLE:
        double();
        break;
      case GameFunctions.SPLIT:
        split();
        break;
      default:
        // eslint-disable-next-line no-console
        console.error("Unknown Game Function: ", type);
    }
  };

  /* render the UI */
  checkUpdate();

  return (
    <>
      <Header />
      <GameTable
        betHandler={betHandler}
        cardClickHandler={cardClickHandler}
        gameFunctions={gameFunctions}
        onClick={handleGameFunctionClick}
        hideHands={hideHands}
        players={players}
        turn={turn}
      />
    </>
  );
};

export default BlackJack;
