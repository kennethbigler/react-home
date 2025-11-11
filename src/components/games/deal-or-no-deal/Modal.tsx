import { MouseEventHandler, CSSProperties, ReactElement } from "react";
import Money from "./Money";
import { getMoneyText } from "./helpers";
import { Briefcase } from "../../../jotai/deal-or-no-deal-state";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

interface ModalProps {
  board: Briefcase[];
  deal: MouseEventHandler;
  noDeal: MouseEventHandler;
  numCases: number;
  offer: number;
  open: boolean;
  swap: MouseEventHandler;
}

const colStyles: CSSProperties = {
  width: "50%",
  display: "inline-block",
};

const genMoneyCols = (
  arr: Briefcase[],
  start: number,
  stop = arr.length,
): ReactElement[] =>
  arr
    .slice(start, stop)
    .map((bc) => <Money key={bc.loc} on={bc.on} val={bc.val} />);

const Modal = ({
  deal,
  noDeal,
  offer,
  open,
  swap,
  numCases,
  board: imBoard,
}: ModalProps) => {
  const board = [...imBoard].sort((a, b) => a.val - b.val);

  // columns displaying money values left
  const lhs = genMoneyCols(board, 0, board.length / 2);
  const rhs = genMoneyCols(board, board.length / 2);

  return (
    <Dialog fullWidth open={open}>
      <DialogTitle>{`${getMoneyText(offer)} - Deal or No Deal?`}</DialogTitle>
      <DialogContent>
        <div style={colStyles}>{lhs}</div>
        <div style={colStyles}>{rhs}</div>
      </DialogContent>
      {numCases > 2 ? (
        <DialogActions>
          <Button color="success" onClick={deal}>
            Deal
          </Button>
          <Button color="error" onClick={noDeal}>
            No Deal
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button color="success" onClick={deal}>
            Deal
          </Button>
          <Button color="secondary" onClick={noDeal}>
            My Case
          </Button>
          <Button color="error" onClick={swap}>
            Other Case
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
