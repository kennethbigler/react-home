import React from 'react';
import Button, { ButtonProps } from './Button';

export interface ButtonGroupProps {
  gameFunctions: ButtonProps[];
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ gameFunctions }: ButtonGroupProps) => (
  <div>
    {gameFunctions.map((obj) => (
      <Button key={obj.name} func={obj.func} name={obj.name} />
    ))}
  </div>
);

export default ButtonGroup;
