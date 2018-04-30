import React from 'react';
import types from 'prop-types';
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
  // types = [array, bool, func, number, object, string, symbol].isRequired
  gameFunctions: types.arrayOf(
    types.shape({
      name: types.string.isRequired,
      func: types.func.isRequired
    })
  ).isRequired
};
