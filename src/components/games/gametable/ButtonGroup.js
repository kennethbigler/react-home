import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './Button';
// Parents: GameTable

/* --------------------------------------------------
 * ButtonGroup
 * -------------------------------------------------- */

export const ButtonGroup = props => {
  const { gameFunctions } = props;
  return (
    <div className="buttonGroup">
      {gameFunctions.map(obj => (
        <Button key={obj.name} name={obj.name} func={obj.func} />
      ))}
    </div>
  );
};

ButtonGroup.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  gameFunctions: PropTypes.array.isRequired
};
