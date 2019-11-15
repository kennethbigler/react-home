import React from 'react';
import Paper from '@material-ui/core/Paper';
import amber from '@material-ui/core/colors/amber';
import grey from '@material-ui/core/colors/grey';
import { getMoneyText } from './helpers';
import { Briefcase } from '../../../store/types';

interface MoneyProps {
  briefcase: Briefcase;
}

const Money: React.FC<MoneyProps> = (props: MoneyProps) => {
  const { briefcase: bc } = props;

  const color: React.CSSProperties = {
    backgroundColor: bc.on ? amber[500] : grey[700],
  };

  const style: React.CSSProperties = {
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
      { bc.on
        ? getMoneyText(bc.val)
        : (<del>{getMoneyText(bc.val)}</del>)}
    </Paper>
  );
};

export default Money;
