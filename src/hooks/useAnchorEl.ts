import React from "react";

interface AnchorElHook {
  anchorEl: null | HTMLElement;
  setAnchor: React.MouseEventHandler;
  clearAnchor: React.MouseEventHandler;
}

const useAnchorEl = (): AnchorElHook => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const setAnchor = (e: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(e.currentTarget);
  };
  const clearAnchor = (): void => {
    setAnchorEl(null);
  };
  return { anchorEl, setAnchor, clearAnchor };
};

export default useAnchorEl;
