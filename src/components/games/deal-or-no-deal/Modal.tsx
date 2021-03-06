import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Money from './Money';
import { getMoneyText } from './helpers';
import { Briefcase } from '../../../store/types';

interface ModalProps {
  board: Briefcase[];
  deal: React.MouseEventHandler;
  noDeal: React.MouseEventHandler;
  numCases: number;
  offer: number;
  open: boolean;
  swap: React.MouseEventHandler;
}

const colStyles: React.CSSProperties = { width: '50%', display: 'inline-block' };

const genMoneyCols = (arr: Briefcase[], start: number, stop = arr.length): React.ReactNode[] => (
  arr.slice(start, stop).map((bc) => <Money key={bc.loc} briefcase={bc} />)
);

const Modal: React.FC<ModalProps> = (props: ModalProps) => {
  const {
    deal, noDeal, offer, open,
    swap, numCases, board: imBoard,
  } = props;

  const board = [...imBoard].sort((a, b) => a.val - b.val);

  // columns displaying money values left
  const lhs = genMoneyCols(board, 0, board.length / 2);
  const rhs = genMoneyCols(board, board.length / 2);

  return (
    <Dialog fullWidth open={open}>
      <DialogTitle>
        {`${getMoneyText(offer)} - Deal or No Deal?`}
      </DialogTitle>
      <DialogContent>
        <div style={colStyles}>
          {lhs}
        </div>
        <div style={colStyles}>
          {rhs}
        </div>
      </DialogContent>
      {numCases > 2
        ? (
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

export default Modal;
