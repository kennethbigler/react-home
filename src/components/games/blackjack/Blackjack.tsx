/* Theoretical Max Score:   386 everyone splits 3 times and busts with 30, dealer bust with 26
 * Card Point Value:        340-380
 * split aces is not blackjack
 * get second card for dealer and hide it
 * buy insurance on dealer's Ace
 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import asyncForEach from '../../../helpers/asyncForEach';
import weighHand from './blackjackHelpers';
import Header from './Header';
import GameTable from '../game-table';
import Deck from '../../../apis/Deck';
import {
  DBTurn, DBHand, DBPlayer, DBRootState, GameFunctions, DBBlackjack,
} from '../../../store/types';
import {
  setNewGame, updateGameFunctions, updateHideHands, updateHasFunctions,
  splitHand, hitHand, stayHand, doubleHand,
} from '../../../store/modules/blackjack';
import { newHand, payout, updateBet } from '../../../store/modules/players';

interface BlackJackActions {
  bjActions: {
    doubleHand: Function;
    hitHand: Function;
    setNewGame: Function;
    splitHand: Function;
    stayHand: Function;
    updateGameFunctions: Function;
    updateHasFunctions: Function;
    updateHideHands: Function;
  };
  playerActions: {
    newHand: Function;
    payout: Function;
    updateBet: Function;
  };
}
interface BlackJackDBState extends DBBlackjack {
  players: DBPlayer[];
  turn: DBTurn;
}
interface BlackJackProps extends BlackJackDBState, BlackJackActions {}
interface PlayerStats {
  house: number;
  payout: number;
  status: string;
}

// Dealer constant
const DEALER = 0;

class BlackJack extends React.Component<BlackJackProps, {}> {
  componentDidUpdate(): void {
    const {
      players, turn, hideHands, hasFunctions,
      gameFunctions,
    } = this.props;
    const player = players[turn.player];

    if (hideHands || !player) { return; }

    if (!player.isBot && player.id !== DEALER) {
      if (hasFunctions) { return; }
      // get the next Hand
      const hand = player.hands[turn.hand];
      this.getGameFunctions(hand);
    } else if (player.isBot && player.id !== DEALER) {
      this.playBot();
    } else {
      !gameFunctions.includes(GameFunctions.NEW_GAME) && this.playDealer();
    }
  }

  /** get the game functions for the present hand */
  getGameFunctions = (hand: DBHand): void => {
    if (!hand) { return; }

    // reset game functions
    const gameFunctions = [GameFunctions.STAY];
    const handWeight = hand.weight || 0;

    // check if not a bust
    if (handWeight < 21) {
      gameFunctions.push(GameFunctions.HIT);
      // check if you only have 2 cards
      if (hand.cards.length === 2) {
        gameFunctions.push(GameFunctions.DOUBLE);
        // check if card1 and card2 have equal weight
        const { weight: weight1 } = weighHand([hand.cards[0]]);
        const { weight: weight2 } = weighHand([hand.cards[1]]);
        if (weight1 === weight2) {
          gameFunctions.push(GameFunctions.SPLIT);
        }
      }
    }

    // update game state
    const { bjActions } = this.props;
    bjActions.updateGameFunctions(gameFunctions);
    bjActions.updateHasFunctions(true);
  };

  /** function that takes a hand of duplicates and makes 2 hands */
  split = (): void => {
    // get state values
    const { turn, players, bjActions } = this.props;
    const { id, hands } = players[turn.player];
    bjActions.splitHand(hands, id, turn.hand, weighHand);
  };

  /** function that doubles your bet, but you only get 1 card */
  double = (): void => {
    const { turn, players, bjActions } = this.props;

    const { id, bet, hands } = players[turn.player];
    const lastHand = players[turn.player].hands.length - 1;

    bjActions.doubleHand(id, bet, hands, id, turn.hand, weighHand, turn.hand < lastHand);
  };

  /** function to pass to the next player */
  stay = (): void => {
    // get state values
    const { turn, players, bjActions } = this.props;
    const lastHand = players[turn.player].hands.length - 1;
    // check if the player has more than 1 hand
    bjActions.stayHand(turn.hand < lastHand);
  };

  /** function to get a new card */
  hit = (): void => {
    // get state values
    const { bjActions, turn, players } = this.props;
    const { id, hands } = players[turn.player];
    // logic to hit
    bjActions.hitHand(hands, id, turn.hand, weighHand);
  };

  /** Start a new round of hands */
  dealHands = (): void => {
    const { playerActions, bjActions, players } = this.props;
    // shuffle the deck
    Deck.shuffle().then(() => {
      // deal the hands
      asyncForEach(players, async (player: DBPlayer) => {
        const num = player.id !== DEALER ? 2 : 1;
        await playerActions.newHand(player.id, num, weighHand);
      });
    });
    bjActions.updateHasFunctions(false);
  };

  /** Start a new game */
  newGame = (): void => {
    const { players, bjActions } = this.props;
    bjActions.setNewGame(players);
  };

  /** function to finish betting and start the game */
  finishBetting = (): void => {
    const { bjActions } = this.props;
    bjActions.updateHideHands(false);
    this.dealHands();
  };

  /** finish the game and check for a winner */
  finishGame = (): void => {
    // state variables
    const {
      turn, players, bjActions, playerActions,
    } = this.props;
    const dealer = players[turn.player].hands[DEALER].weight || 0;
    const dealerLen = players[turn.player].hands[DEALER].cards.length;
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
        playerActions.payout(id, playerStats.status, playerStats.house);
      } else {
        player.hands.forEach((hand) => {
          const { weight = 0, cards } = hand;
          if (dealer === 21 && dealerLen === 2) {
            // dealer BlackJack
            loss(playerStats, bet);
          } else if (weight === 21 && cards.length === 2) {
            // player BlackJack
            win(playerStats, bet, 6 / 5);
          } else if (weight <= 21 && (weight > dealer || dealer > 21)) {
            win(playerStats, bet);
          } else if (weight <= 21 && weight === dealer) {
            playerStats.payout = 0;
            playerStats.status = 'push';
          } else {
            loss(playerStats, bet);
          }
        });
        playerActions.payout(id, playerStats.status, playerStats.payout);
      }
    });

    // update state variables
    const gameFunctions = [GameFunctions.NEW_GAME];
    // update state
    bjActions.updateGameFunctions(gameFunctions);
  };

  /** function to execute dealer logic */
  playDealer = (): void => {
    const { players, turn } = this.props;
    const hand = players[turn.player].hands[turn.hand].cards;
    const { weight, soft } = weighHand(hand);
    // Dealer hits on 16 or less and soft 17
    if (weight <= 16 || (weight === 17 && soft)) {
      this.hit();
    } else {
      this.finishGame();
    }
  };

  // AI: https://www.blackjackinfo.com/blackjack-basic-strategy-engine/
  playBot = (): void => {
    // functions
    const {
      hit, split, double, stay,
    } = this;
    // player hand
    const { players, turn } = this.props;
    const hand = players[turn.player].hands[turn.hand];
    // validate hand exists
    if (!hand) {
      stay();
      return;
    }
    // get remaining vars
    const dealer = players[players.length - 1].hands[DEALER];
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
  };

  /** function to be called on card clicks */
  cardClickHandler = (playerNo: number, handNo: number, cardNo: number): void => {
    const { players } = this.props;
    // eslint-disable-next-line no-console
    console.log(players[playerNo].hands[handNo].cards[cardNo]);
  };

  /** function to be called on card clicks */
  betHandler = (id: number, event: React.MouseEvent, bet: number): void => {
    const { playerActions } = this.props;
    playerActions.updateBet(id, bet);
  };

  /** function to route click actions */
  handleGameFunctionClick = (type: GameFunctions): void => {
    switch (type) {
      case GameFunctions.NEW_GAME:
        this.newGame(); break;
      case GameFunctions.FINISH_BETTING:
        this.finishBetting(); break;
      case GameFunctions.STAY:
        this.stay(); break;
      case GameFunctions.HIT:
        this.hit(); break;
      case GameFunctions.DOUBLE:
        this.double(); break;
      case GameFunctions.SPLIT:
        this.split(); break;
      default:
        // eslint-disable-next-line no-console
        console.error('Unknown Game Function: ', type);
    }
  }

  /* render the UI */
  render(): React.ReactNode {
    const {
      turn, players, gameFunctions, hideHands,
    } = this.props;

    return (
      <>
        <Header />
        <GameTable
          betHandler={this.betHandler}
          cardClickHandler={this.cardClickHandler}
          gameFunctions={gameFunctions}
          onClick={this.handleGameFunctionClick}
          hideHands={hideHands}
          players={players}
          turn={turn}
        />
      </>
    );
  }
}

// react-redux export
const mapStateToProps = (state: DBRootState): BlackJackDBState => ({
  ...state.blackjack,
  players: state.players,
  turn: state.turn,
});
const mapDispatchToProps = (dispatch: Dispatch): BlackJackActions => ({
  bjActions: bindActionCreators(
    {
      doubleHand,
      hitHand,
      setNewGame,
      splitHand,
      stayHand,
      updateGameFunctions,
      updateHasFunctions,
      updateHideHands,
    },
    dispatch,
  ),
  playerActions: bindActionCreators(
    { newHand, payout, updateBet },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(BlackJack);
