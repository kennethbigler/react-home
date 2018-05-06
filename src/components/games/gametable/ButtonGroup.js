import React from 'react';
import types from 'prop-types';
import { Button } from './Button';
import map from 'lodash/map';
// Parents: GameTable

/* --------------------------------------------------
 * ButtonGroup
 * -------------------------------------------------- */

export const ButtonGroup = props => {
  const { gameFunctions } = props;
  return (
    <div className="buttonGroup">
      {map(gameFunctions, obj => (
        <Button func={obj.func} key={obj.name} name={obj.name} />
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
