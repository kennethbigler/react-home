import React from 'react';
import PropTypes from 'prop-types';
// Parents: Degree

/** render code for each class */
export const Header = props => {
  const { playerChoice, casesToOpen } = props;
  return (
    <div>
      <h2>Your Case: {playerChoice ? playerChoice.loc : '?'}</h2>
      <h2>Number of Cases to Open: {casesToOpen}</h2>
    </div>
  );
};

Header.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  playerChoice: PropTypes.object.isRequired,
  casesToOpen: PropTypes.number.isRequired
};
