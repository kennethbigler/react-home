import React from 'react';
import PropTypes from 'prop-types';
import { getMoneyText } from './common';
import RaisedButton from 'material-ui/RaisedButton';
// Parents: Degree

/** render code for each class */
export const Case = props => {
  const { onTouchTap, briefcase: bc, secondary } = props;
  const style = { margin: 10 };
  const label = bc.on ? bc.loc : getMoneyText(bc.val);
  return (
    <RaisedButton
      onTouchTap={onTouchTap}
      disabled={!bc.on}
      style={style}
      primary={!secondary}
      secondary={secondary}
      label={label}
    />
  );
};

Case.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  onTouchTap: PropTypes.func.isRequired,
  briefcase: PropTypes.object.isRequired,
  secondary: PropTypes.bool.isRequired
};
