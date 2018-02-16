import React, { Component } from 'react';
import { Modal } from './Modal';

const OPEN = 6;
const SHUFFLE = 100;

export class DealOrNoDeal extends Component {
  // local variable to track the board
  state = {
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
    dndOpen: false
  };

  /** reset board and shuffle cases */
  componentDidMount() {
    this.newGame();
  }

  /**
   * open a briefcase and update global states
   * @param {number} x - number of the selected briefcase
   * NOTE: udpates sum, numCases, board, casesToOpen
   */
  openBriefcase = x => {
    let { sum, numCases, board, casesToOpen, playerChoice } = this.state;
    if (playerChoice) {
      // verify cases left and briefcase not already opened
      if (casesToOpen > 0 && x !== playerChoice.loc - 1 && board[x].on) {
        // flag the value and update global trackers
        board[x].on = false;
        sum -= board[x].val;
        numCases -= 1;
        casesToOpen -= 1;
        // update state
        this.setState({ board, sum, numCases, casesToOpen });
        if (casesToOpen === 0) {
          this.handleOpen();
        }
      }
    } else {
      this.setState({ playerChoice: board[x] });
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
    const offer = this.getBankOffer();
    console.log(offer);
    this.setState({ offer, dndOpen: true });
  };

  /**
   * function to reset the game
   * NOTE: update board, sum, numCases
   */
  newGame = () => {
    let { board } = this.state;
    let sum = 0;
    let numCases = 0;

    // shuffle values of briefcases
    for (let i = 0; i < SHUFFLE; i += 1) {
      // get to random briefcases
      const j = Math.floor(Math.random() * board.length);
      const k = Math.floor(Math.random() * board.length);
      // swap the briefcases
      let temp = board[j].loc;
      board[j].loc = board[k].loc;
      board[k].loc = temp;
    }

    // set all flags to un-touched
    board.forEach(bc => {
      // get sum and count of cases remaining
      sum += bc.val;
      numCases += 1;
      // reset opened flag
      bc.on = true;
    });

    // sort function for the briefcases
    board.sort((a, b) => a.loc - b.loc);

    this.setState({
      board,
      sum,
      numCases,
      turn: 1,
      playerChoice: null,
      casesToOpen: OPEN
    });
  };

  /** called on selection of Deal */
  deal = () => {
    const { playerChoice: pc } = this.state;
    console.log(`Your Case: ${pc.val}`);
  };

  /**
   * called on selection of No Deal
   * NOTE: update turn, casesToOpen
   */
  noDeal = () => {
    const { turn } = this.state;
    // reset the counter
    const casesToOpen = turn < OPEN - 1 ? OPEN - turn : 1;
    // advance the turn and update state
    this.setState({ dndOpen: false, turn: turn + 1, casesToOpen });
  };

  render() {
    const { board, dndOpen, offer, playerChoice, casesToOpen } = this.state;
    return (
      <div>
        <h2>Your Case: {playerChoice ? playerChoice.loc : '?'}</h2>
        <h2>Number of Cases to Open: {casesToOpen}</h2>
        {board.map((bc, i) => (
          <div key={i} onTouchTap={() => this.openBriefcase(i)}>
            {bc.on ? `Case ${bc.loc}` : `$${bc.val}`}
          </div>
        ))}
        <Modal
          board={board}
          open={dndOpen}
          deal={this.deal}
          noDeal={this.noDeal}
          offer={offer}
        />
      </div>
    );
  }
}
