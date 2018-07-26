import React from 'react';
import types from 'prop-types';
import Button from '@material-ui/core/Button';
import getMoneyText from './common';
// Parents: Degree

const Case = (props) => {
  const { onClick, briefcase: bc, secondary } = props;
  const color = secondary ? 'secondary' : 'primary';
  const style = { margin: 10 };
  const label = bc.on ? bc.loc : getMoneyText(bc.val);
  return (
    <Button
      color={color}
      disabled={!bc.on}
      onClick={onClick}
      style={style}
      variant="raised"
    >
      {label}
    </Button>
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

export default Case;
