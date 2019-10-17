import React, { Component } from 'react';
import types from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import forEach from 'lodash/forEach';
import Typography from '@material-ui/core/Typography';
import Modal from './Modal';
import Board from './Board';
import Header from './Header';
import { shuffle } from './helpers';
import { payout } from '../../../store/modules/players';

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
    { val: 1000000, loc: 26, on: true },
  ],
  turn: 1,
  playerChoice: null,
  casesToOpen: OPEN,
  sum: 0,
  numCases: 0,
  offer: 0,
  dndOpen: false,
  isOver: false,
});

// TODO: add rules to page
/* DealOrNoDeal  ->  Header
 *              |->  Board  ->  Case
 *              |->  Modal  ->  Money */
class DND extends Component {
  /** reset board and shuffle cases */
  constructor(props) {
    super(props);

    this.state = this.prepareNewGameState();
  }

  /** check if it is time for an offer */
  componentDidUpdate() {
    const { casesToOpen } = this.state;
    if (casesToOpen === 0) {
      setTimeout(this.handleOpen, 300);
    }
  }

  /**
   * function to generate the bank offer
   * @return {number} bank offer in $
   */
  getBankOffer = () => {
    const { sum, numCases, turn } = this.state;
    // return offer from the bank
    return Math.round((sum / numCases) * (turn / 10));
  };

  /**
   * charge user to play
   * NOTE: avg (Expected win value) is 131477.62 / 1k = $132
   */
  chargePlayer = () => {
    const { player, actions } = this.props;
    actions.payout(player.id, 'lose', -100);
  };

  /**
   * open a briefcase and update global states
   * @param {number} x - number of the selected briefcase
   * NOTE: udpates sum, numCases, board, casesToOpen
   */
  openBriefcase = (x) => {
    // state vars
    const { board, playerChoice: pc } = this.state;
    const bc = board[x];
    // check if player has already made case selection
    if (pc) {
      // state vars
      const { isOver } = this.state;
      let { sum, numCases, casesToOpen } = this.state;
      // verify cases left and briefcase not already opened
      if (!isOver && casesToOpen > 0 && bc.loc !== pc.loc && bc.on) {
        // flag the value and update global trackers
        bc.on = false;
        sum -= bc.val;
        numCases -= 1;
        casesToOpen -= 1;
        // update state
        this.setState({
          board,
          sum,
          numCases,
          casesToOpen,
        });
      }
    } else {
      this.setState({ playerChoice: bc });
      this.chargePlayer();
    }
  };

  handleOpen = () => {
    const { turn } = this.state;
    // get the new offer
    const offer = this.getBankOffer();
    // reset the counter
    const casesToOpen = turn < OPEN - 1 ? OPEN - turn : 1;
    this.setState({ offer, casesToOpen, dndOpen: true });
  };

  /** function to get a new game state */
  prepareNewGameState = () => {
    const state = getNewState();
    // mix up board
    shuffle(state.board);
    // set all flags to un-touched
    forEach(state.board, (bc) => {
      // get sum and count of cases remaining
      state.sum += bc.val;
      state.numCases += 1;
      // reset opened flag
      bc.on = true;
    });
    // sort function for the briefcases
    state.board.sort((a, b) => a.loc - b.loc);

    return state;
  }

  /**
   * function to reset the game
   * NOTE: reset entire state
   */
  newGame = () => {
    const state = this.prepareNewGameState();
    // update state
    this.setState(state);
  };

  /**
   * function to finish the game
   * NOTE: payout to user offer / 1k
   * @param {number} offer
   */
  finishGame = (offer) => {
    const { player, actions } = this.props;
    actions.payout(player.id, 'win', Math.round(offer / 1000));
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
    const { turn, numCases, playerChoice } = this.state;
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
    for (let i = 0; i < board.length; i += 1) {
      const bc = board[i];
      if (bc.on && bc.loc !== pc.loc) {
        this.finishGame(bc.val);
        return;
      }
    }
  };

  render() {
    const {
      board,
      dndOpen,
      isOver,
      offer,
      playerChoice,
      casesToOpen,
      numCases,
    } = this.state;
    const { player } = this.props;
    // render component
    return (
      <>
        <Typography variant="h2" gutterBottom>Deal or No Deal</Typography>
        <Header
          casesToOpen={casesToOpen}
          isOver={isOver}
          newGame={this.newGame}
          offer={offer}
          player={player}
          playerChoice={playerChoice}
        />
        <Board
          board={board}
          onClick={this.openBriefcase}
          playerChoice={playerChoice}
        />
        <Modal
          board={board}
          deal={this.deal}
          noDeal={this.noDeal}
          numCases={numCases}
          offer={offer}
          open={dndOpen}
          swap={this.swap}
        />
      </>
    );
  }
}

DND.propTypes = {
  actions: types.shape({
    payout: types.func.isRequired,
  }).isRequired,
  player: types.shape({
    id: types.number.isRequired,
    money: types.number.isRequired,
  }).isRequired,
};

// react-redux export
const mapStateToProps = (state) => ({
  player: state.players[0],
});
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ payout }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DND);
