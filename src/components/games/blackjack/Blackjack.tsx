/* Theoretical Max Score:   386 everyone splits 3 times and busts with 30, dealer bust with 26
 * Card Point Value:        340-380
 * split aces is not blackjack
 * get second card for dealer and hide it
 * buy insurance on dealer's Ace
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import asyncForEach from '../../../helpers/asyncForEach';
import weighHand from './blackjackHelpers';
import Header from './Header';
import GameTable from '../game-table';
import Deck from '../../../apis/Deck';
import {
  DBHand, DBPlayer, DBRootState, GameFunctions,
} from '../../../store/types';
import {
  doubleHand, hitHand, setNewGame, splitHand, stayHand,
  updateGameFunctions, updateHasFunctions, updateHideHands,
} from '../../../store/modules/blackjack';
import { newHand, payout, updateBet } from '../../../store/modules/players';

interface PlayerStats {
  house: number;
  payout: number;
  status: string;
}

// Dealer constant
const DEALER = 0;

const BlackJack: React.FC = () => {
  const {
    turn, players, gameFunctions, hideHands,
    hasFunctions,
  } = useSelector((state: DBRootState) => ({
    ...state.blackjack,
    players: state.players,
    turn: state.turn,
  }));
  const dispatch = useDispatch();

  /** get the game functions for the present hand */
  const getGameFunctions = React.useCallback((hand: DBHand): void => {
    if (!hand) { return; }

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
  }, [dispatch]);

  /** function that takes a hand of duplicates and makes 2 hands */
  const split = React.useCallback((): void => {
    // get state values
    const { id, hands } = players[turn.player];
    dispatch(splitHand(hands, id, turn.hand, weighHand));
  }, [dispatch, players, turn.hand, turn.player]);

  /** function to pass to the next player */
  const stay = React.useCallback((): void => {
    // get state values
    const lastHand = players[turn.player].hands.length - 1;
    // check if the player has more than 1 hand
    dispatch(stayHand(turn.hand < lastHand));
  }, [dispatch, players, turn.hand, turn.player]);

  /** function that doubles your bet, but you only get 1 card */
  const double = React.useCallback((): void => {
    dispatch(doubleHand(players[turn.player], turn, weighHand));
  }, [dispatch, players, turn]);

  /** function to get a new card */
  const hit = React.useCallback((): void => {
    // get state values
    const { id, hands } = players[turn.player];
    // logic to hit
    dispatch(hitHand(hands, id, turn.hand, weighHand));
  }, [dispatch, players, turn.hand, turn.player]);

  /** Start a new round of hands */
  const dealHands = React.useCallback((): void => {
    // shuffle the deck
    Deck.shuffle().then(() => {
      // deal the hands
      asyncForEach(players, async (player: DBPlayer) => {
        const num = player.id !== DEALER ? 2 : 1;
        await dispatch(newHand(player.id, num, weighHand));
      });
    });
    dispatch(updateHasFunctions(false));
  }, [dispatch, players]);

  /** Start a new game */
  const newGame = React.useCallback((): void => {
    dispatch(setNewGame(players));
  }, [dispatch, players]);

  /** function to finish betting and start the game */
  const finishBetting = React.useCallback((): void => {
    dispatch(updateHideHands(false));
    dealHands();
  }, [dealHands, dispatch]);

  /** finish the game and check for a winner */
  const finishGame = React.useCallback((): void => {
    // state variables
    const dealer = players.filter((p) => p.id === DEALER)[0];
    const dWeight = dealer.hands[0].weight || 0;
    const dLength = dealer.hands[0].cards.length;
    // track and find the winners
    const playerStats: PlayerStats = { house: 0, payout: 0, status: '' };
    // helper functions
    const win = (ps: PlayerStats, bet: number, mul = 1): void => {
      ps.house -= Math.floor(mul * bet);
      ps.payout = Math.floor(mul * bet);
      ps.status = 'win';
    };
    const loss = (ps: PlayerStats, bet: number): void => {
      ps.house += bet;
      ps.payout = -bet;
      ps.status = 'lose';
    };
    players.forEach((player) => {
      const { id, bet } = player;
      if (id === DEALER) {
        if (playerStats.house > 0) {
          playerStats.status = 'win';
        } else if (playerStats.house < 0) {
          playerStats.status = 'lose';
        } else {
          playerStats.status = 'push';
        }
        dispatch(payout(id, playerStats.status, playerStats.house));
      } else {
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
            playerStats.status = 'push';
          } else {
            loss(playerStats, bet);
          }
        });
        dispatch(payout(id, playerStats.status, playerStats.payout));
      }
    });

    // update game functions
    dispatch(updateGameFunctions([GameFunctions.NEW_GAME]));
  }, [dispatch, players]);

  /** function to get a new card */
  const hitDealer = React.useCallback((): void => {
    // get state values
    const { hands } = players.filter((p) => p.id === DEALER)[0];
    // logic to hit
    dispatch(hitHand(hands, DEALER, 0, weighHand));
  }, [dispatch, players]);

  /** function to execute dealer logic */
  const playDealer = React.useCallback((): void => {
    const dealer = players.filter((p) => p.id === DEALER)[0];
    const hand = dealer.hands[0].cards;
    const { weight, soft } = weighHand(hand);
    // Dealer hits on 16 or less and soft 17
    if (weight <= 16 || (weight === 17 && soft)) {
      dispatch(updateHasFunctions(true));
      hitDealer();
    } else {
      finishGame();
    }
  }, [dispatch, finishGame, hitDealer, players]);

  // AI: https://www.blackjackinfo.com/blackjack-basic-strategy-engine/
  const playBot = React.useCallback((): void => {
    // player hand
    const hand = players[turn.player].hands[turn.hand];
    // validate hand exists
    if (!hand) { return; }
    // get remaining vars
    const dealer = players[players.length - 1].hands[0];
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
          d <= 7 ? split() : hit();
        } else if (x === 4) {
          // 4, split d5-6, else hit
          d === 5 || d === 6 ? split() : hit();
        } else if (x === 5) {
          // 5, double d2-9, hit d10+
          d <= 9 ? double() : hit();
        } else if (x === 6) {
          // 6, split d2-6, else hit
          d <= 6 ? split() : hit();
        } else if (x === 9) {
          // 9, d7,10+ stay, else split
          d === 7 || d >= 10 ? stay() : split();
        } else if (x === 8 || x === 14) {
          // 8,A split
          split();
        } else {
          // 10 Stay
          stay();
        }
      } else if (n < 20 && soft) {
        // soft hands, A9+ stays
        if (n === 13 || n === 14) {
          // A2-A3 double d5-6, hit d2-4, d7-A
          d === 5 || d === 6 ? double() : hit();
        } else if (n === 15 || n === 16) {
          // A4-A5 double d4-6, hit d2-3, d7-A
          d >= 4 && d <= 6 ? double() : hit();
        } else if (n === 17) {
          // A6 double d3-6, hit d2, d7-A
          d >= 3 && d <= 6 ? double() : hit();
        } else if (n === 18) {
          // A7 double d2-6, stay d7-8, hit d9-A
          if (d >= 2 && d <= 6) {
            double();
          } else if (d === 7 || d === 8) {
            stay();
          } else {
            hit();
          }
        } else if (n === 19) {
          // A8 double d6, else stay
          d === 6 ? double() : stay();
        }
      } else if (n < 17 && !soft) {
        // hard hands, 17+ stays
        if (n >= 5 && n <= 8) {
          // 5-8 hit
          hit();
        } else if (n === 9) {
          // 9 double d3-6, hit d2, d7-A
          d >= 3 && d <= 6 ? double() : hit();
        } else if (n === 10) {
          // 10 double d2-9, hit d10-A
          d >= 2 && d <= 9 ? double() : hit();
        } else if (n === 11) {
          // 11 double
          double();
        } else if (n === 12) {
          // 12 hit d2-3, stay d4-6, hit 7-A
          d >= 4 && d <= 6 ? stay() : hit();
        } else if (n >= 13 && n <= 16) {
          // 13-16 stay d2-6, hit 7-A
          d >= 2 && d <= 6 ? stay() : hit();
        }
      } else {
        stay();
      }
    } else {
      // bust
      stay();
    }
  }, [double, hit, players, split, stay, turn.hand, turn.player]);

  const checkUpdate = React.useCallback((): void => {
    const player = players[turn.player];

    if (hasFunctions || hideHands) { return; }
    if (player) {
      if (!player.isBot && player.id !== DEALER) {
        getGameFunctions(player.hands[turn.hand]);
        return;
      }
      if (player.isBot && player.id !== DEALER) {
        playBot();
        return;
      }
    }
    !gameFunctions.includes(GameFunctions.NEW_GAME) && playDealer();
  }, [gameFunctions, getGameFunctions, hasFunctions, hideHands, playBot, playDealer, players, turn.hand, turn.player]);

  /** function to be called on card clicks */
  const cardClickHandler = React.useCallback((playerNo: number, handNo: number, cardNo: number): void => {
    // eslint-disable-next-line no-console
    console.log(players[playerNo].hands[handNo].cards[cardNo]);
  }, [players]);

  /** function to be called on card clicks */
  const betHandler = React.useCallback((id: number, event: React.ChangeEvent<Record<string, unknown>>, bet: number): void => {
    dispatch(updateBet(id, bet));
  }, [dispatch]);

  /** function to route click actions */
  const handleGameFunctionClick = React.useCallback((type: string): void => {
    switch (type) {
      case GameFunctions.NEW_GAME:
        newGame(); break;
      case GameFunctions.FINISH_BETTING:
        finishBetting(); break;
      case GameFunctions.STAY:
        stay(); break;
      case GameFunctions.HIT:
        hit(); break;
      case GameFunctions.DOUBLE:
        double(); break;
      case GameFunctions.SPLIT:
        split(); break;
      default:
        // eslint-disable-next-line no-console
        console.error('Unknown Game Function: ', type);
    }
  }, [double, finishBetting, hit, newGame, split, stay]);

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
