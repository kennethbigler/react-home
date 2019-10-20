import React from 'react';

type ToggleStateHook = [ boolean, React.MouseEventHandler, Function ];

const useToggleState = (defaultVal = false): ToggleStateHook => {
  const [isToggled, setIsToggled] = React.useState(defaultVal);

  const handleToggle = (): void => { setIsToggled(!isToggled); };

  return [isToggled, handleToggle, setIsToggled];
};

export default useToggleState;
