import React from 'react';
import types from 'prop-types';
import {getMoneyText} from './common';
import RaisedButton from 'material-ui/RaisedButton';
// Parents: Degree


export const Case = (props) => {
  const {onClick, briefcase: bc, secondary} = props;
  const style = {margin: 10};
  const label = bc.on ? bc.loc : getMoneyText(bc.val);
  return (
    <RaisedButton
      disabled={!bc.on}
      label={label}
      onClick={onClick}
      primary={!secondary}
      secondary={secondary}
      style={style}
    />
  );
};

Case.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  briefcase: types.shape({
    on: types.bool.isRequired,
    loc: types.number.isRequired,
    val: types.number.isRequired,
  }).isRequired,
  onClick: types.func.isRequired,
  secondary: types.bool,
};
