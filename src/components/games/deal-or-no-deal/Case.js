import React from 'react';
import types from 'prop-types';
import { getMoneyText } from './common';
import RaisedButton from 'material-ui/RaisedButton';
// Parents: Degree

/** render code for each class */
export const Case = props => {
  const { onClick, briefcase: bc, secondary } = props;
  const style = { margin: 10 };
  const label = bc.on ? bc.loc : getMoneyText(bc.val);
  return (
    <RaisedButton
      onClick={onClick}
      disabled={!bc.on}
      style={style}
      primary={!secondary}
      secondary={secondary}
      label={label}
    />
  );
};

Case.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  onClick: types.func.isRequired,
  briefcase: types.shape({
    on: types.bool.isRequired,
    loc: types.number.isRequired,
    val: types.number.isRequired
  }).isRequired,
  secondary: types.bool
};
