import React from 'react';
import Button from './Button';

export interface ButtonGroupProps {
  gameFunctions: string[];
  onClick: (name: string) => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ gameFunctions, onClick }: ButtonGroupProps) => (
  <div>
    {gameFunctions.map((key) => (
      <Button key={key} onClick={onClick} name={key} />
    ))}
  </div>
);

export default ButtonGroup;
