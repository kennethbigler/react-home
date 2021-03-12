import React from 'react';
import Button from '@material-ui/core/Button';
import { getMoneyText } from './helpers';
import { Briefcase } from '../../../store/types';

interface CaseProps {
  briefcase: Briefcase;
  onClick: React.MouseEventHandler;
  secondary?: boolean;
}

const style = { margin: 10 };

const Case: React.FC<CaseProps> = (props: CaseProps) => {
  const { onClick, briefcase: bc, secondary } = props;
  const color = secondary ? 'secondary' : 'primary';
  const label = bc.on ? bc.loc : getMoneyText(bc.val);

  return (
    <Button
      color={color}
      disabled={!bc.on}
      onClick={onClick}
      style={style}
      role="button"
      variant="contained"
    >
      {label}
    </Button>
  );
};

export default Case;
