import React from 'react';
import types from 'prop-types';
import map from 'lodash/map';
import Button from './Button';
// Parents: GameTable

/* --------------------------------------------------
 * ButtonGroup
 * -------------------------------------------------- */

const ButtonGroup = (props) => {
  const { gameFunctions } = props;
  return (
    <div className="buttonGroup">
      {map(gameFunctions, obj => (
        <Button key={obj.name} func={obj.func} name={obj.name} />
      ))}
    </div>
  );
};

ButtonGroup.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  gameFunctions: types.arrayOf(
    types.shape({
      name: types.string.isRequired,
      func: types.func.isRequired,
    }),
  ).isRequired,
};

export default ButtonGroup;
