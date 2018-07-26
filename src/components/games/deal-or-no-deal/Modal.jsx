import React from 'react';
import types from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import map from 'lodash/map';
import Money from './Money';
import getMoneyText from './common';
// Parents: DealOrNoDeal

const styles = {
  cols: { width: '50%', display: 'inline-block' },
};

const genMoneyCols = (arr, start, stop = arr.length) => map(arr.slice(start, stop), bc => <Money key={bc.loc} briefcase={bc} />);

const Modal = (props) => {
  const {
    deal, noDeal, offer, open, swap, numCases,
  } = props;
  const board = [...props.board].sort((a, b) => a.val - b.val);

  // columns displaying money values left
  const lhs = genMoneyCols(board, 0, board.length / 2);
  const rhs = genMoneyCols(board, board.length / 2);

  return (
    <Dialog fullWidth open={open}>
      <DialogTitle>
        {`${getMoneyText(offer)} - Deal or No Deal?`}
      </DialogTitle>
      <DialogContent>
        <div style={styles.cols}>
          {lhs}
        </div>
        <div style={styles.cols}>
          {rhs}
        </div>
      </DialogContent>
      {numCases > 2 ? (
        <DialogActions>
          <Button color="primary" onClick={deal}>
            Deal
          </Button>
          <Button color="secondary" onClick={noDeal}>
            No Deal
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button color="primary" onClick={deal}>
            Deal
          </Button>
          <Button color="secondary" onClick={noDeal}>
            My Case
          </Button>
          <Button color="secondary" onClick={swap}>
            Other Case
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

Modal.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  board: types.arrayOf(
    types.shape({
      loc: types.number.isRequired,
    }),
  ).isRequired,
  deal: types.func.isRequired,
  noDeal: types.func.isRequired,
  numCases: types.number.isRequired,
  offer: types.number.isRequired,
  open: types.bool.isRequired,
  swap: types.func.isRequired,
};

export default Modal;
