import React from 'react';
import PropTypes from 'prop-types';
import { getMoneyText } from './common';
import Paper from 'material-ui/Paper';
import { grey700, amber500, white } from 'material-ui/styles/colors';

// Parents: Degree

/** render code for each class */
export const Money = props => {
  const { briefcase: bc } = props;

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
    ...color
  };

  return (
    <Paper style={style}>
      {bc.on ? (
        <b>{getMoneyText(bc.val)}</b>
      ) : (
        <del>{getMoneyText(bc.val)}</del>
      )}
    </Paper>
  );
};

Money.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  briefcase: PropTypes.object.isRequired
};
