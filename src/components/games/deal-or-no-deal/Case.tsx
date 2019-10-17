import React from 'react';
import Button from '@material-ui/core/Button';
import { getMoneyText } from './helpers';

export interface Briefcase {
  on: boolean;
  loc: number;
  val: number;
}
interface CaseProps {
  briefcase: Briefcase;
  onClick: React.MouseEventHandler;
  secondary?: boolean;
}

const Case: React.FC<CaseProps> = (props: CaseProps) => {
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
      variant="contained"
    >
      {label}
    </Button>
  );
};

export default Case;
