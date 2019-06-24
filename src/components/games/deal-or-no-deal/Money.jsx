import React from 'react';
import types from 'prop-types';
import Paper from '@material-ui/core/Paper';
import amber from '@material-ui/core/colors/amber';
import grey from '@material-ui/core/colors/grey';
import { getMoneyText } from './helpers';
// Parents: Modal

const Money = (props) => {
  const { briefcase: bc } = props;

  const color = {};
  color.backgroundColor = bc.on ? amber[500] : grey[700];

  const style = {
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: 5,
    padding: 5,
    textAlign: 'center',
    color: 'white',
    ...color,
  };

  return (
    <Paper style={style}>
      {bc.on ? getMoneyText(bc.val) : (
        <del>
          {getMoneyText(bc.val)}
        </del>
      )}
    </Paper>
  );
};

Money.propTypes = {
  briefcase: types.shape({
    on: types.bool.isRequired,
    val: types.number.isRequired,
  }).isRequired,
};

export default Money;
