import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Money } from './Money';
import { getMoneyText } from './common';
// Parents: DealOrNoDeal

const styles = {
  cols: { width: '50%', display: 'inline-block' }
};

const genMoneyCols = (arr, start, stop = arr.length) =>
  arr.slice(start, stop).map(bc => <Money key={bc.loc} briefcase={bc} />);

/** render code for each class */
export const Modal = props => {
  const { deal, noDeal, offer, open, swap, numCases } = props;
  const board = [...props.board].sort((a, b) => a.val - b.val);

  // actions to exit modal
  let actions = [];

  if (numCases > 2) {
    actions = [
      <FlatButton key="deal" label="Deal" primary onClick={deal} />,
      <FlatButton key="noDeal" label="No Deal" secondary onClick={noDeal} />
    ];
  } else {
    actions = [
      <FlatButton key="deal" label="Deal" primary onClick={deal} />,
      <FlatButton key="noDeal" label="My Case" secondary onClick={noDeal} />,
      <FlatButton key="swap" label="Other Case" secondary onClick={swap} />
    ];
  }

  // columns displaying money values left
  const lhs = genMoneyCols(board, 0, board.length / 2);
  const rhs = genMoneyCols(board, board.length / 2);

  return (
    <Dialog
      title={`${getMoneyText(offer)} - Deal or No Deal?`}
      actions={actions}
      open={open}
      autoScrollBodyContent
    >
      <div style={styles.cols}>{lhs}</div>
      <div style={styles.cols}>{rhs}</div>
    </Dialog>
  );
};

Modal.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  open: PropTypes.bool.isRequired,
  deal: PropTypes.func.isRequired,
  noDeal: PropTypes.func.isRequired,
  offer: PropTypes.number.isRequired,
  board: PropTypes.array.isRequired,
  numCases: PropTypes.number.isRequired,
  swap: PropTypes.func.isRequired
};
