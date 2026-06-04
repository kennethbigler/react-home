import Button from "./Button";

interface ButtonGroupProps<T extends string> {
  gameFunctions: T[];
  onClick: (name: T) => void;
}

const ButtonGroup = <T extends string>({
  gameFunctions,
  onClick,
}: ButtonGroupProps<T>) => (
  <div>
    {gameFunctions.map((key) => (
      <Button key={key} onClick={onClick} name={key} />
    ))}
  </div>
);

export default ButtonGroup;
