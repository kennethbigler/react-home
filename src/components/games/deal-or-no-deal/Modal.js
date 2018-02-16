import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { red500, white } from 'material-ui/styles/colors';
import { Money } from './Money';
// Parents: DealOrNoDeal

/** render code for each class */
export const Modal = props => {
  const actions = [
    <RaisedButton key="deal" label="Deal" primary onTouchTap={props.deal} />,
    <RaisedButton
      key="noDeal"
      label="No Deal"
      backgroundColor={red500}
      labelColor={white}
      onTouchTap={props.noDeal}
    />
  ];

  const board = [...props.board].sort((a, b) => a.val - b.val);
  const lhs = board
    .slice(0, board.length / 2)
    .map(bc => <Money key={bc.loc} briefcase={bc} />);
  const rhs = board
    .slice(board.length / 2)
    .map(bc => <Money key={bc.loc} briefcase={bc} />);

  return (
    <Dialog
      title={`$${props.offer} - Deal or No Deal?`}
      actions={actions}
      open={props.open}
      autoScrollBodyContent
    >
      <div className="row">
        <div className="col-xs-6">{lhs}</div>
        <div className="col-xs-6">{rhs}</div>
      </div>
    </Dialog>
  );
};

Modal.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  open: PropTypes.bool.isRequired,
  deal: PropTypes.func.isRequired,
  noDeal: PropTypes.func.isRequired,
  offer: PropTypes.number.isRequired,
  board: PropTypes.array.isRequired
};
