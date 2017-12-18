import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GameTable } from '../../features/GameTable';
import { Deck } from '../../../apis/Deck';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { incrPlayerTurn, resetTurn, incrHandTurn } from '../../../modules/turn';
import { drawCard, newHand, splitHand, payout } from '../../../modules/players';
// Parents: Main

// Dealer constant
const DEALER = 0;

/** calculate the weight of a hand
 * inputs: hand
 * outputs: weight
 * stateChanges: none
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
  constructor() {
    super();
    this.state = {
      gameFunctions: []
    };
    // binding is necessary to make `this` work in callback when defined x(){}, not x=()=>{}
    // this.setPlayerCount = this.setPlayerCount.bind(this);
  }

  // runs 1x on load: componentWillMount > render > componentDidMount
  componentWillMount() {
    this.newGame();
  }

  componentWillReceiveProps(nextProps) {
    const { players, turn } = this.props;
    const { players: np, turn: nt } = nextProps;
    // validate that there is a next player
    const lastPlayer = players[turn.player];
    const nextPlayer = np[nt.player];
    if (!nextPlayer) {
      return;
    }
    // get the next hand
    const newHand = nextPlayer.hands[nt.hand];
    // get the old hand
    const hand = lastPlayer ? lastPlayer.hands[turn.hand] : null;
    // if the hand updated, get the game functions
    if (hand !== newHand) {
      const gameFunctions = this.getGameFunctions(newHand);
      this.setState({ gameFunctions });
    }
  }

  playDealer = () => {
    console.log('play dealer');
    const { players, turn } = this.props;
    const hand = players[turn.player].hands[DEALER].cards;
    // Dealer hits on 16 or less and soft 17
    let { weight, soft } = weighHand(hand);
    if (weight < 17 || (weight === 17 && soft)) {
      this.hit();
    } else {
      this.finishGame();
    }
  };

  /** get the game functions for the present hand
   * inputs: hand
   * stateChanges: gameFunctions
   */
  getGameFunctions = hand => {
    // check state
    if (!hand) {
      return [];
    }

    // reset game functions
    let gameFunctions = [{ name: 'Stay', func: this.stay }];

    // check if you can hit
    if (hand.weight < 21) {
      gameFunctions.push({
        name: 'Hit',
        func: this.hit
      });
      // check if you can double
      if (hand.cards.length <= 2) {
        gameFunctions.push({
          name: 'Double',
          func: this.double
        });
        // check if split is possible
        const { weight: weight1 } = weighHand([hand.cards[0]]);
        const { weight: weight2 } = weighHand([hand.cards[1]]);
        // check if cards are the same weight
        if (weight1 === weight2) {
          gameFunctions.push({
            name: 'Split',
            func: this.split
          });
        }
      }
    }

    // update game state
    return gameFunctions;
  };

  /**
   * Start a new game
   * inputs: playerCount
   * stateChanges: turn, players
   */
  newGame = () => {
    const { turnActions, playerActions, players } = this.props;
    // redux actions
    turnActions.resetTurn();
    // shuffle the deck
    Deck.shuffle();
    // deal the hands
    players.forEach(player => {
      playerActions.newHand(player.id, weighHand, 2);
    });
  };

  /**
   * finish the game and check for a winner
   * inputs: playerCount
   * stateChanges: turn, player, gameFunctions
   */
  finishGame = () => {
    // state variables
    let { turn, players, playerActions } = this.props;
    const dealer = players[turn.player].hands[DEALER].weight;
    // track and find the winners
    const bet = 5;
    players.forEach(player => {
      player.hands.forEach(hand => {
        const { weight } = hand;
        let status = '';
        if (weight <= 21 && weight > dealer) {
          status = 'win';
        } else if (weight <= 21 && weight === dealer) {
          status = 'draw';
        } else {
          status = 'lose';
        }
        playerActions.payout(player.id, status, player.money, bet);
      });
    });

    // update state variables
    const gameFunctions = [{ name: 'New Game', func: this.newGame }];
    // update state
    this.setState({ gameFunctions });
  };

  /** function to get a new card
   * inputs: players, turn
   * stateChanges: players
   */
  hit = () => {
    // get state values
    const { turn, playerActions, players } = this.props;
    let hands = players[turn.player].hands;
    let id = players[turn.player].id;
    // logic to hit
    console.log(id);
    playerActions.drawCard(hands, id, turn.hand, weighHand);
  };

  /** function to pass to the next player
   * inputs: turn, playerCount
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
    // write function to double the bet
    this.hit();
    this.stay();
  };

  /** function that takes a hand of duplicates and makes 2 hands
   * inputs: players, turn
   * stateChanges: players
   */
  split = () => {
    // get state values
    const { turn, players, playerActions } = this.props;
    const hands = players[turn.player].hands;
    const id = players[turn.player].id;

    playerActions.splitHand(hands, id, turn.hand, weighHand);
  };

  // function to be called on card clicks
  cardClickHandler = (playerNo, handNo, cardNo) => {
    const card = this.state.players[playerNo].hands[handNo].cards[cardNo];
    console.log(card);
  };

  // runs anytime render would be called, use to update state
  // componentWillReceiveProps > shouldComponentUpdate > componentWillUpdate > render > componentDidUpdate
  // render standard board
  render() {
    const { turn, players } = this.props;
    const { gameFunctions } = this.state;
    return (
      <GameTable
        turn={turn}
        players={players}
        cardClickHandler={this.cardClickHandler}
        gameFunctions={gameFunctions}
      />
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
      { drawCard, newHand, splitHand, payout },
      dispatch
    )
  };
}

export const BlackJack = connect(mapStateToProps, mapDispatchToProps)(BJ);
