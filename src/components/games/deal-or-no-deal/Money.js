import React from 'react';
import types from 'prop-types';
import {getMoneyText} from './common';
import Paper from 'material-ui/Paper';
import {grey700, amber500, white} from 'material-ui/styles/colors';

// Parents: Degree


export const Money = (props) => {
  const {briefcase: bc} = props;

  let color = {};
  color.backgroundColor = bc.on ? amber500 : grey700;

  const style = {
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: 5,
    padding: 5,
    textAlign: 'center',
    color: white,
    ...color,
  };

  return (
    <Paper style={style}>
      {bc.on ? getMoneyText(bc.val) : <del>{getMoneyText(bc.val)}</del>}
    </Paper>
  );
};

Money.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  briefcase: types.shape({
    on: types.bool.isRequired,
    val: types.number.isRequired,
  }).isRequired,
};
