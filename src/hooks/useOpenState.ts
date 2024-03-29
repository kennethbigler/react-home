import * as React from "react";

type OpenStateHook = [boolean, () => void, () => void];

const useOpenState = (defaultVal = false): OpenStateHook => {
  const [isOpen, setIsOpen] = React.useState(defaultVal);

  const handleOpen = (): void => {
    setIsOpen(true);
  };
  const handleClose = (): void => {
    setIsOpen(false);
  };

  return [isOpen, handleOpen, handleClose];
};

export default useOpenState;
