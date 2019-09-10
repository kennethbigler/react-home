import React, { Component, Fragment } from 'react';
import types from 'prop-types';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import reduce from 'lodash/reduce';
import get from 'lodash/get';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  swapCards,
  newHand,
  payout,
  resetStatus,
} from '../../../store/modules/players';
import { incrPlayerTurn, resetTurn } from '../../../store/modules/turn';
import GameTable from '../gametable';
import Deck from '../../../apis/Deck';
// Parents: Main

const DEALER = 0;
const LAST_PLAYER = 5;

/* --------------------------------------------------
* Poker
* -------------------------------------------------- */
class Poker extends Component {
  constructor(props) {
    super(props);
    this.setNewGameRedux();
    this.state = this.getNewGameState();
  }

  componentDidUpdate() {
    const { players, turn } = this.props;
    const { hideHands, gameOver } = this.state;
    const player = players[turn.player];
    const canPlay = player.id !== DEALER && player.id <= LAST_PLAYER;

    if (!hideHands && !gameOver && player.isBot) {
      canPlay ? this.computer() : this.endGame();
    }
  }

  /** function to reset turn and player status */
  setNewGameRedux = () => {
    const { turnActions, playerActions, players } = this.props;
    // reset redux actions
    turnActions.resetTurn();
    // reset player statuses
    forEach(players, (player) => playerActions.resetStatus(player.id));
  };

  /**
   * function to generate the state of a new game
   * @return {Object}
   */
  getNewGameState = () => ({
    gameFunctions: [{ name: 'Start Game', func: this.startGame }],
    cardsToDiscard: [],
    hideHands: true,
    gameOver: false,
  });

  /**
   * get hand from props
   * @return {Array}
   */
  getHand = () => {
    // get state vars
    const { turn, players } = this.props;
    return get(players[turn.player], 'hands[0].cards', null);
  };

  getHistogram = (hand) => {
    // Histogram for the cards
    const hist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // put hand into the histrogram
    forEach(hand, (card) => {
      hist[card.weight - 2] += 1; // 2-14 - 2 = 0-12
    });
    return hist;
  };

  newGame = () => {
    this.setNewGameRedux();
    this.setState(this.getNewGameState());
  };

  /**
   * function to finish betting and start the game
   * stateChanges: hideHands
   */
  startGame = () => {
    this.setState({
      gameFunctions: [{ name: 'Discard Cards', func: this.handleDiscard }],
      hideHands: false,
    });
    this.dealHands();
  };

  /** increment player turn and reset state */
  endTurn = () => {
    const { turnActions } = this.props;
    turnActions.incrPlayerTurn();
    this.setState({
      gameFunctions: [{ name: 'Discard Cards', func: this.handleDiscard }],
      cardsToDiscard: [],
    });
  };

  endGame = () => {
    const { players, playerActions } = this.props;
    let winner = { val: 0, id: 0 };
    forEach(players, (player) => {
      if (player.id === DEALER || player.id > LAST_PLAYER) {
        return;
      }
      const playerScore = parseInt(this.evaluate(player.hands[0].cards), 14);
      if (playerScore > winner.val) {
        winner = { val: playerScore, id: player.id };
      }
    });
    forEach(players, (player) => {
      if (player.id === DEALER || player.id > LAST_PLAYER) {
        // do nothing
      } else if (player.id === winner.id) {
        playerActions.payout(player.id, 'win', 20);
      } else {
        playerActions.payout(player.id, 'lose', -5);
      }
    });
    this.setState({
      gameFunctions: [{ name: 'New Game', func: this.newGame }],
      gameOver: true,
    });
  };

  /**
   * Rankings:
   *   Straight Flush  8
   *   4 of a Kind     7
   *   Full House      6
   *   Flush           5
   *   Straight        4
   *   3 of a Kind     3
   *   2 Pair          2
   *   1 Pair          1
   *   High Card       0
   *
   * @param {Array} hand
   * @param {Object} hist
   * @return {number} value is a base 14 string, to be converted into base 10 for comparison
   */
  rankHand = (hand, hist) => {
    // iterate through and look for hands with multiple cards
    if (includes(hist, 4)) {
      return 7; // 4 of a kind
    }
    // Check for hands with sets of 3 or 2 cards
    const has3 = includes(hist, 3);
    const i = hist.indexOf(2);
    const has2 = i !== -1;
    if (has3 && has2) {
      return 6; // full house
    }
    if (has3) {
      return 3; // 3 of a kind
    }
    if (has2 && includes(hist, 2, i + 1)) {
      return 2; // 2 pair
    }
    if (has2) {
      return 1; // 1 pair
    }
    // all single cards
    // check for straight
    const isStraight = hist.lastIndexOf(1) - hist.indexOf(1) === 4 // (end - start = 4)
      || (hist[12] && hist[0] && hist[1] && hist[2] && hist[3]); // (A,2,3,4,5)
    // check for flush
    let isFlush = true;
    for (let j = 0; j < hand.length; j += 1) {
      if (hand[j].suit !== hand[0].suit) {
        isFlush = false;
        break;
      }
    }
    if (isStraight && isFlush) {
      return 8; // straight flush
    }
    if (isFlush) {
      return 5; // flush
    }
    if (isStraight) {
      return 4; // straight
    }
    return 0; // high card
  };

  /**
   * iterate through array, removing each index number from hand
   * then add new cards to the hand
   * @param {array} cards - array of index numbers
   */
  discard = (cards) => {
    // get state values
    const { turn, playerActions, players } = this.props;
    const { id, hands } = players[turn.player];
    // logic to swap cards
    playerActions.swapCards(hands, id, cards);
  };

  /** helper function wrapping discard, meant for UI */
  handleDiscard = () => {
    const { cardsToDiscard } = this.state;
    this.discard(cardsToDiscard);
    this.setState({
      gameFunctions: [{ name: 'End Turn', func: this.endTurn }],
      cardsToDiscard: [],
    });
  };

  /**
   * function to remove n number of cards
   * @param {number} n - number of cards to remove
   * @param {[number]} hist - number of each respective card in hand
   */
  discardHelper = (n, hist) => {
    const hand = this.getHand();
    const discardCards = [];
    const cardVals = [hist.indexOf(1)];
    // find cards without pairs, starting with the smallest
    for (let i = 1; i < n; i += 1) {
      cardVals[i] = hist.indexOf(1, cardVals[i - 1] + 1);
    }
    // find hand indecies of individual cards
    for (let i = 0; i < hand.length; i += 1) {
      for (let j = 0; j < cardVals.length; j += 1) {
        if (hand[i].weight - 2 === cardVals[j]) {
          discardCards.push(i);
          break;
        }
      }
    }

    // discard lowest, non-pair n cards
    this.discard(discardCards);
  };

  /** computer play algorithm:
    PAIRS
    draw 0 on 4 of a kind
    draw 0 on full house
    draw 1 on 3 of a kind, keep higher of 2
    draw 1 on 2 pair
    draw 3 on 2 of a kind

    This is a nice to have, for now we only follow the first half
    STRAIGHT/FLUSH
    draw 0 on straight
    draw 0 on flush
    draw 0 on straight flush
    if 1 away from sf -> draw 1
    if 1 away from S -> draw 1 if 5+ players, else regular hand
    if 1 away from F -> draw 1 if 5+ players, else regular hand

    REGULAR HAND
    if K / A -> draw 4
    else draw 5
    */
  computer = () => {
    const hand = this.getHand();
    const hist = this.getHistogram(hand);
    const rank = this.rankHand(hand, hist);

    switch (rank) {
      case 0: // draw 4-5 on high card
        hist.lastIndexOf(1) >= 11
          ? this.discardHelper(4, hist) // if ace || king draw 4
          : this.discard([0, 1, 2, 3, 4]); // otherwise, draw all 5
        break;
      case 1: // draw 3 on 2 of a kind
        this.discardHelper(3, hist);
        break;
      case 2: // draw 1 on 3 of a kind
      case 3: // draw 1 on 2 Pair
        this.discardHelper(1, hist);
        break;
      case 4: // draw 0 on straight
      case 5: // draw 0 on flush
      case 6: // draw 0 on full house
      case 7: // draw 0 on 4 of a kind
      case 8: // draw 0 on straight flush
      default:
        break;
    }
    this.endTurn();
  };

  /**
   * function to be called on card clicks
   * @param {number} playerNo - player number
   * @param {number} handNo - hand number
   * @param {number} cardNo - card number
   */
  cardClickHandler = (playerNo, handNo, cardNo) => {
    const { cardsToDiscard } = this.state;
    // find card
    const i = cardsToDiscard.indexOf(cardNo);
    // toggle in array
    i === -1 ? cardsToDiscard.push(cardNo) : cardsToDiscard.splice(i, 1);
    // update state
    this.setState({ cardsToDiscard });
  };

  /**
   * Compare hands to see who wins
   * @param {array} hand - array of card objects
   * Hands is assigned a weight based on hand, then card values
   * Compare values to see who wins
   * @return {number} value is a base 14 string, to be converted into base 10 for comparison
   */
  evaluate = (hand) => {
    const hist = this.getHistogram(hand);
    const rank = this.rankHand(hand, hist);

    const cards = [0, 0, 0, 0, 0]; // placeholder for card value
    let total = 0; // track number of cards counted
    let numCards = 4; // number of same cards in a set
    let i = 0; // iterator
    let last = -1; // track location of last in numCards set

    // get card values and display them in order of importance
    while (total < 5) {
      const num = hist.indexOf(numCards, last + 1);
      if (num === -1) {
        numCards -= 1;
        last = -1;
      } else {
        cards[i] = num.toString(14);
        i += 1;
        total += numCards;
        last = num;
      }
    }
    return `${rank}${reduce(cards, (a, c) => `${a}${c}`)}`;
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
    forEach(
      players,
      (player) => player.id !== DEALER
        && player.id <= LAST_PLAYER
        && playerActions.newHand(player.id, 5),
    );
  };

  // render standard board
  render() {
    const { turn, players } = this.props;
    const {
      cardsToDiscard, gameFunctions, gameOver, hideHands,
    } = this.state;
    return (
      <Fragment>
        <Typography variant="h2" gutterBottom>
          5 Card Draw Poker
        </Typography>
        <GameTable
          cardClickHandler={this.cardClickHandler}
          cardsToDiscard={cardsToDiscard}
          gameFunctions={gameFunctions}
          gameOver={gameOver}
          hideHands={hideHands}
          isBlackJack={false}
          players={players}
          turn={turn}
        />
      </Fragment>
    );
  }
}

Poker.propTypes = {
  playerActions: types.shape({
    swapCards: types.func.isRequired,
    newHand: types.func.isRequired,
    payout: types.func.isRequired,
    resetStatus: types.func.isRequired,
  }).isRequired,
  players: types.arrayOf(
    types.shape({
      id: types.number.isRequired,
      hands: types.arrayOf(
        types.shape({
          cards: types.arrayOf(
            types.shape({
              weight: types.number.isRequired,
              suit: types.string.isRequired,
            }),
          ).isRequired,
        }).isRequired,
      ).isRequired,
    }),
  ).isRequired,
  turn: types.shape({
    player: types.number.isRequired,
    hand: types.number.isRequired,
  }).isRequired,
  turnActions: types.shape({
    incrPlayerTurn: types.func.isRequired,
    resetTurn: types.func.isRequired,
  }).isRequired,
};

// react-redux export
function mapStateToProps(state /* , ownProps */) {
  return {
    turn: state.turn,
    players: state.players,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    turnActions: bindActionCreators({ incrPlayerTurn, resetTurn }, dispatch),
    playerActions: bindActionCreators(
      {
        swapCards,
        newHand,
        payout,
        resetStatus,
      },
      dispatch,
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Poker);
