import React from 'react';
import map from 'lodash/map';
import Button, { ButtonProps } from './Button';
// Parents: GameTable

export interface ButtonGroupProps {
  gameFunctions: ButtonProps[];
}

const ButtonGroup: React.FC<ButtonGroupProps> = (props: ButtonGroupProps) => {
  const { gameFunctions } = props;
  return (
    <div>
      {map(gameFunctions, (obj) => (
        <Button key={obj.name} func={obj.func} name={obj.name} />
      ))}
    </div>
  );
};

export default ButtonGroup;
