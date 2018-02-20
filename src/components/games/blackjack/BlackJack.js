/* Theoretical Max Score:   386 everyone splits 3 times and busts with 30, dealer bust with 26
 * Card Point Value:        340-380
 * TODO: split aces is not blackjack
 * TODO: get second card for dealer and hide it
 * TODO: buy insurance on dealer's Ace
 */

// react
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// components
import { Popup } from './Popup';
import { GameTable } from '../gametable/GameTable';
import { Deck } from '../../../apis/Deck';
// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  incrPlayerTurn,
  resetTurn,
  incrHandTurn
} from '../../../store/modules/turn';
import {
  drawCard,
  newHand,
  splitHand,
  payout,
  updateBet,
  resetStatus
} from '../../../store/modules/players';
// Parents: Main

// Dealer constant
const DEALER = 0;

/**
 * calculate the weight of a hand
 * stateChanges: none
 * @param {Object[]} hand
 * @return {string, string}
 */
function weighHand(hand = []) {
  // set return values
  let weight = 0;
  let soft = false;

  // find the weight of the hand
  hand.forEach(card => {
    const { weight: cardWeight } = card;
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

/* --------------------------------------------------
* BlackJack
* -------------------------------------------------- */

class BJ extends Component {
  constructor(props) {
    super(props);
    this.setNewGameRedux();
    this.state = this.getNewGameState();
  }

  /**
   * runs anytime render would be called, use to update state
   * componentWillReceiveProps > shouldComponentUpdate > componentWillUpdate > render > componentDidUpdate
   * prepair game functions for current / next player if hand changed
   */
  componentWillUpdate(nextProps, nextState) {
    // check if check is required
    if ((nextState.hideHands && this.state.hideHands) || nextState.hideHands) {
      return;
    }
    const { players: lp, turn: lt } = this.props;
    const { players: np, turn: nt } = nextProps;
    // validate that there is a next player
    const player = np[nt.player];
    if (!player) {
      return;
    }
    // get the next hand
    const hand = player.hands[nt.hand];
    // get the old hand
    const lastHand = lp[lt.player] ? lp[lt.player].hands[lt.hand] : null;
    // if the hand updated, get the game functions
    if (lastHand !== hand) {
      const gameFunctions = [...this.getGameFunctions(hand)];
      this.setState({ gameFunctions });
    }
  }

  /**
   * runs anytime render would be called, use to update state
   * componentWillReceiveProps > shouldComponentUpdate > componentWillUpdate > render > componentDidUpdate
   * check if dealer and hand has updated to initiate dealer functions
   */
  componentDidUpdate(prevProps) {
    const { players: lp, turn: lt } = prevProps;
    const { players: np, turn: nt } = this.props;
    // verify player exists and is dealer
    const player = np[nt.player];
    if (!player || (!player.isBot && player.id !== DEALER)) {
      return;
    } else if (player.isBot && player.id !== DEALER) {
      this.playBot();
    } else {
      // get the next hand
      const hand = player.hands[nt.hand];
      // get the old hand
      const lastHand = lp[lt.player] ? lp[lt.player].hands[lt.hand] : null;
      // if the hand updated, check for dealer
      if (lastHand !== hand) {
        this.playDealer();
      }
    }
  }

  /**
   * function to generate the state of a new game
   * @return {Object}
   */
  getNewGameState = () => {
    // go back to betting phase
    return {
      gameFunctions: [{ name: 'Finish Betting', func: this.finishBetting }],
      hideHands: true
    };
  };

  /** function to reset turn and player status */
  setNewGameRedux = () => {
    const { turnActions, playerActions, players } = this.props;
    // reset redux actions
    turnActions.resetTurn();
    // reset player statuses
    players.forEach(player => playerActions.resetStatus(player.id));
  };

  /**
   * function to finish betting and start the game
   * stateChanges: hideHands
   */
  finishBetting = () => {
    this.setState({ hideHands: false });
    this.dealHands();
  };

  /**
   * Start a new game
   * stateChanges: hideHands
   */
  newGame = () => {
    this.setNewGameRedux();
    this.setState(this.getNewGameState());
  };

  /**
   * Start a new round of hands
   * stateChanges: turn, players
   */
  dealHands = () => {
    const { playerActions, players } = this.props;
    // shuffle the deck
    Deck.shuffle();
    // deal the hands
    players.forEach(player => {
      const num = player.id !== DEALER ? 2 : 1;
      playerActions.newHand(player.id, weighHand, num);
    });
  };

  /**
   * function to get a new card
   * stateChanges: players
   */
  hit = () => {
    // get state values
    const { turn, playerActions, players } = this.props;
    const { id, hands } = players[turn.player];
    // logic to hit
    playerActions.drawCard(hands, id, turn.hand, weighHand);
  };

  /**
   * function to pass to the next player
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

  /**
   * function that takes a hand of duplicates and makes 2 hands
   * stateChanges: players
   */
  split = () => {
    // get state values
    const { turn, players, playerActions } = this.props;
    const { id, hands } = players[turn.player];

    playerActions.splitHand(hands, id, turn.hand, weighHand);
  };

  /**
   * get the game functions for the present hand
   * @param {Object[]} hand
   * @return {Object[]} gameFunctions
   */
  getGameFunctions = hand => {
    // check state
    if (!hand) {
      return [];
    }

    // define game function options
    const stay = { name: 'Stay', func: this.stay };
    const hit = { name: 'Hit', func: this.hit };
    const double = { name: 'Double', func: this.double };
    const split = { name: 'Split', func: this.split };

    // reset game functions
    let gameFunctions = [stay];

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
    return gameFunctions;
  };

  /**
   * finish the game and check for a winner
   * stateChanges: turn, player, gameFunctions
   */
  finishGame = () => {
    // state variables
    let { turn, players, playerActions } = this.props;
    const dealer = players[turn.player].hands[DEALER].weight;
    const dealerLen = players[turn.player].hands[DEALER].cards.length;
    // track and find the winners
    let house = 0;
    players.forEach(player => {
      const { id, money, bet } = player;
      if (id === DEALER) {
        playerActions.payout(id, player.status, money, house);
      } else {
        let status = '';
        let payout = 0;
        const win = (mul = 1) => {
          house -= Math.floor(mul * bet);
          payout += Math.floor(mul * bet);
        };
        const loss = () => {
          house += bet;
          payout -= bet;
        };
        player.hands.forEach(hand => {
          const { weight, cards } = hand;
          if (dealer === 21 && dealerLen === 2) {
            // dealer BlackJack
            loss();
          } else if (weight === 21 && cards.length === 2) {
            // player BlackJack
            win(6 / 5);
          } else if (weight <= 21 && (weight > dealer || dealer > 21)) {
            win();
          } else if (weight <= 21 && weight === dealer) {
            // push, do nothing
          } else {
            loss();
          }
        });
        if (payout > 0) {
          status = 'win';
        } else if (payout < 0) {
          status = 'lose';
          payout *= -1;
        } else {
          status = 'push';
        }
        playerActions.payout(id, status, money, payout);
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
    let hand = players[turn.player].hands[turn.hand].cards;
    let { weight, soft } = weighHand(hand);
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
    const { hit, split, double, stay } = this;
    // player hand
    const { players, turn } = this.props;
    const hand = players[turn.player].hands[turn.hand];
    // validate hand exists
    if (!hand) {
      return;
    }
    // get remaining vars
    const dealer = players[players.length - 1].hands[DEALER];
    const n = hand.weight;
    const soft = hand.soft;
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
          n >= 2 && n <= 6 ? double() : n === 7 || n === 8 ? stay() : hit();
        } else if (n === 19) {
          // A8 double d6, else stay
          d === 6 ? double() : stay();
        } else {
          console.error(`AI ${turn} Error: n ${n}, d ${d}, s ${soft}`);
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
        } else {
          console.error(`AI ${turn} Error: n ${n}, d ${d}, s ${soft}`);
        }
      } else {
        stay();
      }
    } else {
      // bust
      stay();
    }
  };

  /**
   * function to be called on card clicks
   * @param {number} playerNo - player number
   * @param {number} handNo - hand number
   * @param {number} cardNo - card number
   */
  cardClickHandler = (playerNo, handNo, cardNo) => {
    console.log(this.props.players[playerNo].hands[handNo].cards[cardNo]);
  };

  /**
   * function to be called on card clicks
   * @param {Object} event
   * @param {number} value
   * stateChanges: player
   */
  betHandler = (id, event, bet) => {
    this.props.playerActions.updateBet(id, bet);
  };

  /** render the UI */
  render() {
    const { turn, players } = this.props;
    const { gameFunctions, hideHands } = this.state;
    return (
      <div>
        <Popup />
        <GameTable
          turn={turn}
          players={players}
          hideHands={hideHands}
          betHandler={this.betHandler}
          gameFunctions={gameFunctions}
          cardClickHandler={this.cardClickHandler}
        />
      </div>
    );
  }
}

// Prop Validation
BJ.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  turnActions: PropTypes.object.isRequired,
  playerActions: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
  turn: PropTypes.object.isRequired
};

// react-redux export
function mapStateToProps(state /*, ownProps*/) {
  return {
    turn: state.turn,
    players: state.players
  };
}

function mapDispatchToProps(dispatch) {
  return {
    turnActions: bindActionCreators(
      { incrPlayerTurn, resetTurn, incrHandTurn },
      dispatch
    ),
    playerActions: bindActionCreators(
      { drawCard, newHand, splitHand, payout, updateBet, resetStatus },
      dispatch
    )
  };
}

export const BlackJack = connect(mapStateToProps, mapDispatchToProps)(BJ);
