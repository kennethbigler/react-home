import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import { getTurn } from './constants';
// Parents: TicTacToe

/** ========================================
 * History
 * ======================================== */
export class History extends Component {
  static propTypes = {
    // PropTypes = [string, object, bool, number, func, array].isRequired
    step: PropTypes.number.isRequired,
    history: PropTypes.array.isRequired,
    jumpToStep: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { ascend: true };
  }

  /** function that toggles asc vs. desc */
  handleMoveOrderToggle = () => {
    this.setState({ ascend: !this.state.ascend });
  };

  /**
   * function that generates text for the history tracker
   * @param {Object} round - contains board and click location for turn
   * @param {number} move - just index tracking
   */
  getHistoryText = (round, move) => {
    const { step, jumpToStep } = this.props;
    // generate description text
    const description = !move
      ? 'Game Start (Turn, Col, Row)'
      : `Move #${move} (${getTurn(move - 1)}, ` +
        `${Math.floor(round.location / 3)}, ${round.location % 3})`;
    // highlight current turn displayed on board
    const style = step === move ? { fontWeight: 'bold' } : {};
    return (
      <li key={move}>
        <a style={style} onTouchTap={() => jumpToStep(move)}>
          {description}
        </a>
      </li>
    );
  };

  render() {
    const { ascend } = this.state;
    const { history } = this.props;
    // move history
    const moves = history.map(this.getHistoryText);
    // asc vs. desc
    const buttonLabel = ascend ? 'Asc' : 'Desc';
    !ascend && moves.reverse();

    return (
      <div>
        <RaisedButton
          label={buttonLabel}
          onTouchTap={this.handleMoveOrderToggle}
        />
        <ul>{moves}</ul>
      </div>
    );
  }
}
