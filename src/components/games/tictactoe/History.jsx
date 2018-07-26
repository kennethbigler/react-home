import React, { Component } from 'react';
import types from 'prop-types';
import Button from '@material-ui/core/Button';
import map from 'lodash/map';
import { getTurn } from './constants';
// Parents: TicTacToe

/* ========================================
 * History
 * ======================================== */
export default class History extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    history: types.arrayOf(types.shape({ location: types.number })).isRequired,
    jumpToStep: types.func.isRequired,
    step: types.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { ascend: true };
  }

  /**
   * function that generates text for the history tracker
   * @param {Object} round - contains board and click location for turn
   * @param {number} move - just index tracking
   * @return {Object}
   */
  getHistoryText = (round, move) => {
    const { step, jumpToStep } = this.props;
    // generate description text
    const description = !move
      ? 'Game Start (Turn, Col, Row)'
      : `Move #${move} (${getTurn(move - 1)}, `
        + `${Math.floor(round.location / 3)}, ${round.location % 3})`;
    // highlight current turn displayed on board
    const color = step === move ? 'secondary' : 'default';
    return (
      <Button
        key={move}
        color={color}
        onClick={() => jumpToStep(move)}
        style={{ display: 'block' }}
      >
        {description}
      </Button>
    );
  };

  /** function that toggles asc vs. desc */
  handleMoveOrderToggle = () => {
    const { ascend } = this.state;
    this.setState({ ascend: !ascend });
  };

  render() {
    const { ascend } = this.state;
    const { history } = this.props;
    // move history
    const moves = map(history, this.getHistoryText);
    // asc vs. desc
    !ascend && moves.reverse();

    return (
      <div>
        <Button
          onClick={this.handleMoveOrderToggle}
          style={{ marginTop: 20, marginBottom: 20 }}
          variant="raised"
        >
          {ascend ? 'Asc' : 'Desc'}
        </Button>
        {moves}
      </div>
    );
  }
}
