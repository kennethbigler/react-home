/* Theoretical Max Score:   386 everyone splits 3 times and busts with 30, dealer bust with 26
 * Card Point Value:        340-380
 * TODO: split aces is not blackjack
 * TODO: get second card for dealer and hide it
 * TODO: buy insurance on dealer's Ace
 */
import React, { Component, Fragment } from 'react';
import types from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import asyncForEach from '../../../helpers/asyncForEach';
import weighHand from './blackjackHelpers';
// components
import Header from './Header';
import GameTable from '../gametable';
import Deck from '../../../apis/Deck';
// redux functions
import {
  incrHandTurn,
  incrPlayerTurn,
  resetTurn,
} from '../../../store/modules/turn';
import {
  drawCard,
  newHand,
  payout,
  resetStatus,
  splitHand,
  updateBet,
} from '../../../store/modules/players';
// Parents: Main

// Dealer constant
const DEALER = 0;

/* --------------------------------------------------
* BlackJack
* -------------------------------------------------- */
class BlackJack extends Component {
  constructor(props) {
    super(props);
    this.setNewGameRedux();
    this.state = this.getNewGameState();
  }

  componentDidUpdate(prevProps) {
    const { players: lp, turn: lt } = prevProps;
    const { players: np, turn: nt } = this.props;
    const { hideHands } = this.state;
    // verify player exists and is dealer
    const player = np[nt.player];
    if (hideHands || !player) {
      return;
    }
    if (!player.isBot && player.id !== DEALER) {
      // get the next Hand
      const hand = get(player, `hands.${nt.hand}`);
      // if the Hand updated, get the game functions
      if (hand !== get(lp, `${lt.player}.hands.${lt.hand}`)) {
        this.getGameFunctions(hand);
      }
    } else if (player.isBot && player.id !== DEALER) {
      this.playBot();
    } else {
      // get the next Hand
      const hand = player.hands[nt.hand];
      // if the Hand updated, check for dealer
      if (hand !== get(lp, `${lt.player}.hands.${lt.hand}`)) {
        this.playDealer();
      }
    }
  }

  /** function to generate the state of a new game
   * @return {Object}
   */
  getNewGameState = () => ({
    gameFunctions: [{ name: 'Finish Betting', func: this.finishBetting }],
    hideHands: true,
  });

  /** function to reset turn and player status */
  setNewGameRedux = () => {
    const { turnActions, playerActions, players } = this.props;
    // reset redux actions
    turnActions.resetTurn();
    // reset player statuses
    forEach(players, (player) => playerActions.resetStatus(player.id));
  };

  /** get the game functions for the present hand
   * @param {Object[]} hand
   */
  getGameFunctions = (hand) => {
    // check state
    if (!hand) {
      return;
    }

    // define game function options
    const stay = { name: 'Stay', func: this.stay };
    const hit = { name: 'Hit', func: this.hit };
    const double = { name: 'Double', func: this.double };
    const split = { name: 'Split', func: this.split };

    // reset game functions
    const gameFunctions = [stay];

    // check if not a bust
    if (hand.weight < 21) {
      gameFunctions.push(hit);
      // check if you only have 2 cards
      if (hand.cards.length === 2) {
        gameFunctions.push(double);
        // check if card1 and card2 have equal weight
        const { weight: weight1 } = weighHand([hand.cards[0]]);
        const { weight: weight2 } = weighHand([hand.cards[1]]);
        if (weight1 === weight2) {
          gameFunctions.push(split);
        }
      }
    }

    // update game state
    this.setState({ gameFunctions });
  };

  /** function that takes a hand of duplicates and makes 2 hands
   * stateChanges: players
   */
  split = () => {
    // get state values
    const { turn, players, playerActions } = this.props;
    const { id, hands } = players[turn.player];

    playerActions.splitHand(hands, id, turn.hand, weighHand);
  };

  /** function that doubles your bet, but you only get 1 card */
  double = () => {
    const { turn, playerActions, players } = this.props;
    // double bet
    const { id, bet } = players[turn.player];
    playerActions.updateBet(id, bet * 2);
    // hit then stay
    this.hit();
    this.stay();
  };

  /** function to pass to the next player
   * stateChanges: turn
   */
  stay = () => {
    // get state values
    const { turn, turnActions, players } = this.props;
    const lastHand = players[turn.player].hands.length - 1;

    // check if the player has more than 1 hand
    turn.hand < lastHand
      ? turnActions.incrHandTurn()
      : turnActions.incrPlayerTurn();
  };

  /** function to get a new card
   * stateChanges: players
   */
  hit = () => {
    // get state values
    const { turn, playerActions, players } = this.props;
    const { id, hands } = players[turn.player];
    // logic to hit
    playerActions.drawCard(hands, id, turn.hand, 1, weighHand);
  };

  /** Start a new round of hands
   * stateChanges: turn, players
   */
  dealHands = () => {
    const { playerActions, players } = this.props;
    // shuffle the deck
    Deck.shuffle().then(() => {
      // deal the hands
      asyncForEach(players, async (player) => {
        const num = player.id !== DEALER ? 2 : 1;
        await playerActions.newHand(player.id, num, weighHand);
      });
    });
  };

  /** Start a new game
   * stateChanges: hideHands
   */
  newGame = () => {
    this.setNewGameRedux();
    this.setState(this.getNewGameState());
  };

  /** function to finish betting and start the game
   * stateChanges: hideHands
   */
  finishBetting = () => {
    this.setState({ hideHands: false });
    this.dealHands();
  };

  /** finish the game and check for a winner
   * stateChanges: turn, player, gameFunctions
   */
  finishGame = () => {
    // state variables
    const { turn, players, playerActions } = this.props;
    const dealer = players[turn.player].hands[DEALER].weight;
    const dealerLen = players[turn.player].hands[DEALER].cards.length;
    // track and find the winners
    const playerStats = { house: 0, payout: 0, status: '' };
    // helper functions
    const win = (ps, bet, mul = 1) => {
      ps.house -= Math.floor(mul * bet);
      ps.payout = Math.floor(mul * bet);
      ps.status = 'win';
    };
    const loss = (ps, bet) => {
      ps.house += bet;
      ps.payout = -bet;
      ps.status = 'lose';
    };
    // iterate
    forEach(players, (player) => {
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
        forEach(player.hands, (hand) => {
          const { weight, cards } = hand;
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
    const gameFunctions = [{ name: 'New Game', func: this.newGame }];
    // update state
    this.setState({ gameFunctions });
  };

  /** function to execute dealer logic */
  playDealer = () => {
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
  playBot = () => {
    // functions
    const {
      hit, split, double, stay,
    } = this;
    // player hand
    const { players, turn } = this.props;
    const hand = players[turn.player].hands[turn.hand];
    // validate hand exists
    if (!hand) {
      return;
    }
    // get remaining vars
    const dealer = players[players.length - 1].hands[DEALER];
    const { weight: n, soft } = hand;
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
          if (n >= 2 && n <= 6) {
            double();
          } else if (n === 7 || n === 8) {
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

  /** function to be called on card clicks
   * @param {number} playerNo - player number
   * @param {number} handNo - hand number
   * @param {number} cardNo - card number
   */
  cardClickHandler = (playerNo, handNo, cardNo) => {
    const { players } = this.props;
    /* eslint-disable no-console */
    console.log(players[playerNo].hands[handNo].cards[cardNo]);
    /* eslint-enable no-console */
  };

  /** function to be called on card clicks
   * @param {number} id
   * @param {Object} event
   * @param {number} bet
   * stateChanges: player
   */
  betHandler = (id, event, bet) => {
    const { playerActions } = this.props;
    playerActions.updateBet(id, bet);
  };

  /* render the UI */
  render() {
    const { turn, players } = this.props;
    const { gameFunctions, hideHands } = this.state;

    return (
      <Fragment>
        <Header />
        <GameTable
          betHandler={this.betHandler}
          cardClickHandler={this.cardClickHandler}
          gameFunctions={gameFunctions}
          hideHands={hideHands}
          players={players}
          turn={turn}
        />
      </Fragment>
    );
  }
}

BlackJack.propTypes = {
  playerActions: types.shape({
    drawCard: types.func.isRequired,
    newHand: types.func.isRequired,
    payout: types.func.isRequired,
    resetStatus: types.func.isRequired,
    splitHand: types.func.isRequired,
    updateBet: types.func.isRequired,
  }).isRequired,
  players: types.arrayOf(
    types.shape({
      bet: types.number.isRequired,
      id: types.number.isRequired,
      status: types.string.isRequired,
      money: types.number.isRequired,
      hands: types.arrayOf(
        types.shape({
          weight: types.number.isRequired,
          cards: types.arrayOf(
            types.shape({ weight: types.number.isRequired }),
          ).isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  turn: types.shape({
    player: types.number.isRequired,
    hand: types.number.isRequired,
  }).isRequired,
  turnActions: types.shape({
    incrHandTurn: types.func.isRequired,
    incrPlayerTurn: types.func.isRequired,
    resetTurn: types.func.isRequired,
  }).isRequired,
};

// react-redux export
const mapStateToProps = (state) => ({
  turn: state.turn,
  players: state.players,
});
const mapDispatchToProps = (dispatch) => ({
  turnActions: bindActionCreators(
    { incrPlayerTurn, resetTurn, incrHandTurn },
    dispatch,
  ),
  playerActions: bindActionCreators(
    {
      drawCard,
      newHand,
      splitHand,
      payout,
      updateBet,
      resetStatus,
    },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(BlackJack);
