import React from 'react';
import PropTypes from 'prop-types';
import { getMoneyText } from './common';
// Parents: Degree

/** render code for each class */
export const Case = props => {
  const { onTouchTap, briefcase: bc } = props;
  return (
    <div onTouchTap={onTouchTap}>
      {bc.on ? `Case ${bc.loc}` : getMoneyText(bc.val)}
    </div>
  );
};

Case.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  onTouchTap: PropTypes.func.isRequired,
  briefcase: PropTypes.object.isRequired
};
