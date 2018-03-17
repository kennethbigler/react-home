// react
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// components
import { Deck } from '../../../apis/Deck';
import { GameTable } from '../gametable/GameTable';
// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { incrPlayerTurn, resetTurn } from '../../../store/modules/turn';
import {
  swapCards,
  newHand,
  payout,
  updateBet,
  resetStatus
} from '../../../store/modules/players';
// Parents: Main

const getHistogram = hand => {
  // Histogram for the cards
  let hist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // put hand into the histrogram
  hand.forEach(card => {
    hist[card.rank - 2] += 1; // 2-14 - 2 = 0-12
  });
  return hist;
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
 * @return {number} value is a base 13 string, to be converted into base 10 for comparison
 */
const rankHand = (hand, hist) => {
  // iterate through and look for hands with multiple cards
  if (hist.indexOf(4) !== -1) {
    return 7; // 4 of a kind
  }
  // Check for hands with sets of 3 or 2 cards
  const has3 = hist.indexOf(3) !== -1;
  const i = hist.indexOf(2);
  const has2 = i !== -1;
  if (has3 && has2) {
    return 6; // full house
  } else if (has3) {
    return 3; // 3 of a kind
  } else if (has2 && hist.indexOf(2, i + 1) !== -1) {
    return 2; // 2 pair
  } else if (has2) {
    return 1; // 1 pair
  } else {
    // all single cards
    // check for straight
    const isStraight =
      hist.lastIndexOf(1) - hist.indexOf(1) === 4 || // (end - start = 4)
      (hist[12] && hist[0] && hist[1] && hist[2] && hist[3]); // (A,2,3,4,5)
    // check for flush
    let isFlush = true;
    for (let card of hand) {
      if (card.suit !== hand[0].suit) {
        isFlush = false;
        break;
      }
    }
    if (isStraight && isFlush) {
      return 8; // straight flush
    } else if (isFlush) {
      return 5; // flush
    } else if (isStraight) {
      return 4; // straight
    } else {
      return 0; // high card
    }
  }
};

/**
 * Compare hands to see who wins
 * @param {array} hand - array of card objects
 * Hands is assigned a weight based on hand, then card values
 * Compare values to see who wins
 * @return {number} value is a base 13 string, to be converted into base 10 for comparison
 */
const evaluate = hand => {
  const hist = getHistogram(hand);
  const rank = rankHand(hand, hist);

  let cards = [0, 0, 0, 0, 0]; // placeholder for card value
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
      cards[i] = num.toString(13);
      i += 1;
      total += numCards;
      last = num;
    }
  }
  return `${rank}${cards.reduce((a, c) => `${a}${c}`)}`;
};

/* --------------------------------------------------
* Poker
* -------------------------------------------------- */
export class Pkr extends Component {
  // Prop Validation
  static propTypes = {
    // PropTypes = [string, object, bool, number, func, array].isRequired
    turnActions: PropTypes.object.isRequired,
    playerActions: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired,
    turn: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.setNewGameRedux();
    this.state = this.getNewGameState();
  }

  /**
   * function to generate the state of a new game
   * @return {Object}
   */
  getNewGameState = () => {
    // go back to betting phase
    return {
      gameFunctions: [{ name: 'Finish Betting', func: this.finishBetting }],
      cardsToDiscard: [],
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
   * Start a new round of hands
   * stateChanges: turn, players
   */
  dealHands = () => {
    const { playerActions, players } = this.props;
    // shuffle the deck
    Deck.shuffle();
    // deal the hands
    players.forEach(player => playerActions.newHand(player.id, 5));
  };

  /**
   * function to finish betting and start the game
   * stateChanges: hideHands
   */
  finishBetting = () => {
    this.setState({ hideHands: false });
    this.dealHands();
  };

  /** get hand from props */
  getHand = () => {
    // get state vars
    const { turn, players } = this.props;
    return players[turn.player].hands[0];
  };

  /** increment player turn and reset state */
  endTurn = () => {
    const { turnActions } = this.props;
    turnActions.incrPlayerTurn();
    this.setState({ cardsToDiscard: [] });
  };

  /**
   * iterate through array, removing each index number from hand
   * then add new cards to the hand
   * @param {array} cards - array of index numbers
   */
  discard = cards => {
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
  };

  /**
   * function to remove n number of cards
   * @param {number} n - number of cards to remove
   * @param {[number]} hist - number of each respective card in hand
   */
  discardHelper = (n, hist) => {
    const hand = this.getHand();
    let discardCards = [];
    let cardVals = [hist.indexOf(1)];
    // find cards without pairs, starting with the smallest
    for (let i = 1; i < n; i += 1) {
      cardVals[i] = hist.indexOf(1, cardVals[i - 1] + 1);
    }
    // find hand indecies of individual cards
    for (let i = 0; i < hand.length; i += 1) {
      for (let c of cardVals) {
        if (hand[i].rank - 2 === c) {
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
    const hist = getHistogram(hand);
    const rank = rankHand(hand, hist);

    switch (rank) {
      case 0: // draw 4-5 on high card
        hist.lastIndexOf(1) >= 11
          ? this.discardHelper(4, hist) // if ace || king draw 4
          : this.discard([0, 1, 2, 3, 4]); // otherwise, draw all 5
        return;
      case 1: // draw 3 on 2 of a kind
        this.discardHelper(3, hist);
        return;
      case 2: // draw 1 on 3 of a kind
      case 3: // draw 1 on 2 Pair
        this.discardHelper(1, hist);
        return;
      case 4: // draw 0 on straight
      case 5: // draw 0 on flush
      case 6: // draw 0 on full house
      case 7: // draw 0 on 4 of a kind
      case 8: // draw 0 on straight flush
      default:
        return;
    }
  };

  /**
   * function to be called on card clicks
   * @param {number} playerNo - player number
   * @param {number} handNo - hand number
   * @param {number} cardNo - card number
   */
  cardClickHandler = (playerNo, handNo, cardNo) => {
    let { cardsToDiscard } = this.state;
    // find card
    let i = cardsToDiscard.indexOf(cardNo);
    // toggle in array
    i === -1 ? cardsToDiscard.push(cardNo) : cardsToDiscard.splice(i, 1);
    // update state
    this.setState({ cardsToDiscard });
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

  // render standard board
  render() {
    const { turn, players } = this.props;
    const { gameFunctions, hideHands } = this.state;
    return (
      <div>
        <h1>Placeholder for Future Poker Project</h1>
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

// react-redux export
function mapStateToProps(state /*, ownProps*/) {
  return {
    turn: state.turn,
    players: state.players
  };
}

function mapDispatchToProps(dispatch) {
  return {
    turnActions: bindActionCreators({ incrPlayerTurn, resetTurn }, dispatch),
    playerActions: bindActionCreators(
      { swapCards, newHand, payout, updateBet, resetStatus },
      dispatch
    )
  };
}

export const Poker = connect(mapStateToProps, mapDispatchToProps)(Pkr);
