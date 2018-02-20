// react
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// components
import { Modal } from './Modal';
import { Board } from './Board';
import { Header } from './Header';
import { shuffle } from './common';
// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { payout } from '../../../store/modules/players';
// Parents: Main

// name constant for reference
const OPEN = 6;

const getNewState = () => ({
  board: [
    { val: 1, loc: 1, on: true },
    { val: 2, loc: 2, on: true },
    { val: 5, loc: 3, on: true },
    { val: 10, loc: 4, on: true },
    { val: 25, loc: 5, on: true },
    { val: 50, loc: 6, on: true },
    { val: 75, loc: 7, on: true },
    { val: 100, loc: 8, on: true },
    { val: 200, loc: 9, on: true },
    { val: 300, loc: 10, on: true },
    { val: 400, loc: 11, on: true },
    { val: 500, loc: 12, on: true },
    { val: 750, loc: 13, on: true },
    { val: 1000, loc: 14, on: true },
    { val: 5000, loc: 15, on: true },
    { val: 10000, loc: 16, on: true },
    { val: 25000, loc: 17, on: true },
    { val: 50000, loc: 18, on: true },
    { val: 75000, loc: 19, on: true },
    { val: 100000, loc: 20, on: true },
    { val: 200000, loc: 21, on: true },
    { val: 300000, loc: 22, on: true },
    { val: 400000, loc: 23, on: true },
    { val: 500000, loc: 24, on: true },
    { val: 750000, loc: 25, on: true },
    { val: 1000000, loc: 26, on: true }
  ],
  turn: 1,
  playerChoice: null,
  casesToOpen: OPEN,
  sum: 0,
  numCases: 0,
  offer: 0,
  dndOpen: false,
  isOver: false
});

export class DND extends Component {
  // local variable to track the board
  state = getNewState();

  /** reset board and shuffle cases */
  componentDidMount() {
    this.newGame();
  }

  /** check if it is time for an offer */
  componentDidUpdate() {
    if (this.state.casesToOpen === 0) {
      setTimeout(this.handleOpen, 300);
    }
  }

  /**
   * open a briefcase and update global states
   * @param {number} x - number of the selected briefcase
   * NOTE: udpates sum, numCases, board, casesToOpen
   */
  openBriefcase = x => {
    // state vars
    let { board, playerChoice: pc } = this.state;
    let bc = board[x];
    // check if player has already made case selection
    if (pc) {
      // state vars
      let { sum, isOver, numCases, casesToOpen } = this.state;
      // verify cases left and briefcase not already opened
      if (!isOver && casesToOpen > 0 && bc.loc !== pc.loc && bc.on) {
        // flag the value and update global trackers
        bc.on = false;
        sum -= bc.val;
        numCases -= 1;
        casesToOpen -= 1;
        // update state
        this.setState({ board, sum, numCases, casesToOpen });
      }
    } else {
      this.setState({ playerChoice: bc });
    }
  };

  /**
   * function to generate the bank offer
   * @return {number} bank offer in $
   */
  getBankOffer = () => {
    const { sum, numCases, turn } = this.state;
    // return offer from the bank
    return Math.round(sum / numCases * (turn / 10));
  };

  handleOpen = () => {
    const { turn } = this.state;
    // get the new offer
    const offer = this.getBankOffer();
    // reset the counter
    const casesToOpen = turn < OPEN - 1 ? OPEN - turn : 1;
    this.setState({ offer, casesToOpen, dndOpen: true });
  };

  /**
   * function to reset the game
   * NOTE: reset entire state
   * NOTE: avg (Expected win value) is 131477.62 / 1k = $132
   */
  newGame = () => {
    let state = getNewState();
    // mix up board
    shuffle(state.board);
    // set all flags to un-touched
    state.board.forEach(bc => {
      // get sum and count of cases remaining
      state.sum += bc.val;
      state.numCases += 1;
      // reset opened flag
      bc.on = true;
    });
    // sort function for the briefcases
    state.board.sort((a, b) => a.loc - b.loc);
    // charge user to play
    const { player, actions } = this.props;
    actions.payout(player.id, 'lose', player.money, 132);
    // update state
    this.setState(state);
  };

  /**
   * function to finish the game
   * NOTE: payout to user offer / 1k
   */
  finishGame = offer => {
    const { player, actions } = this.props;
    actions.payout(player.id, 'win', player.money, Math.round(offer / 1000));
    this.setState({ dndOpen: false, isOver: true, offer });
  };

  /** called on selection of Deal */
  deal = () => {
    const { offer } = this.state;
    this.finishGame(offer);
  };

  /**
   * called on selection of No Deal
   * NOTE: update turn, casesToOpen
   */
  noDeal = () => {
    let { turn, numCases, playerChoice } = this.state;
    // no deal on last case
    if (numCases <= 2) {
      this.finishGame(playerChoice.val);
    }
    // advance the turn and update state
    this.setState({ dndOpen: false, turn: turn + 1 });
  };

  /**
   * called on selection of 'Other Case'
   * @param {number} offer - case value
   */
  swap = () => {
    const { board, playerChoice: pc } = this.state;
    for (let bc of board) {
      if (bc.on && bc.loc !== pc.loc) {
        this.finishGame(bc.val);
        return;
      }
    }
  };

  render() {
    // state vars
    const {
      board,
      dndOpen,
      isOver,
      offer,
      playerChoice,
      casesToOpen,
      numCases
    } = this.state;
    // prop vars
    const { player } = this.props;
    // render component
    return (
      <div>
        <Header
          playerChoice={playerChoice}
          casesToOpen={casesToOpen}
          isOver={isOver}
          offer={offer}
          newGame={this.newGame}
          player={player}
        />
        <Board
          board={board}
          onTouchTap={this.openBriefcase}
          playerChoice={playerChoice}
        />
        <Modal
          board={board}
          open={dndOpen}
          offer={offer}
          numCases={numCases}
          swap={this.swap}
          deal={this.deal}
          noDeal={this.noDeal}
        />
      </div>
    );
  }
}

// Prop Validation
DND.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  player: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

// react-redux export
function mapStateToProps(state /*, ownProps*/) {
  return {
    player: state.players[0]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ payout }, dispatch)
  };
}

export const DealOrNoDeal = connect(mapStateToProps, mapDispatchToProps)(DND);
