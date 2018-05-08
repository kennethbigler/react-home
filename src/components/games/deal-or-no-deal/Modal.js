import React from 'react';
import types from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Money} from './Money';
import {getMoneyText} from './common';
import map from 'lodash/map';
// Parents: DealOrNoDeal

const styles = {
  cols: {width: '50%', display: 'inline-block'},
};

const genMoneyCols = (arr, start, stop = arr.length) =>
  map(arr.slice(start, stop), (bc) => <Money briefcase={bc} key={bc.loc} />);


export const Modal = (props) => {
  const {deal, noDeal, offer, open, swap, numCases} = props;
  const board = [...props.board].sort((a, b) => a.val - b.val);

  // actions to exit modal
  let actions = [];

  if (numCases > 2) {
    actions = [
      <FlatButton key="deal" label="Deal" onClick={deal} primary />,
      <FlatButton key="noDeal" label="No Deal" onClick={noDeal} secondary />,
    ];
  } else {
    actions = [
      <FlatButton key="deal" label="Deal" onClick={deal} primary />,
      <FlatButton key="noDeal" label="My Case" onClick={noDeal} secondary />,
      <FlatButton key="swap" label="Other Case" onClick={swap} secondary />,
    ];
  }

  // columns displaying money values left
  const lhs = genMoneyCols(board, 0, board.length / 2);
  const rhs = genMoneyCols(board, board.length / 2);

  return (
    <Dialog
      actions={actions}
      autoScrollBodyContent
      open={open}
      title={`${getMoneyText(offer)} - Deal or No Deal?`}
    >
      <div style={styles.cols}>{lhs}</div>
      <div style={styles.cols}>{rhs}</div>
    </Dialog>
  );
};

Modal.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  board: types.arrayOf(
    types.shape({
      loc: types.number.isRequired,
    })
  ).isRequired,
  deal: types.func.isRequired,
  noDeal: types.func.isRequired,
  numCases: types.number.isRequired,
  offer: types.number.isRequired,
  open: types.bool.isRequired,
  swap: types.func.isRequired,
};
