import React from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import useAnchorEl from '../../../hooks/useAnchorEl';

interface ButtonPopoverProps {
  children: React.ReactElement;
  buttonText: string;
}

const contentStyle: React.CSSProperties = { padding: 15 };

const ButtonPopover = (props: ButtonPopoverProps): React.ReactElement => {
  const { anchorEl, setAnchor, clearAnchor } = useAnchorEl();
  const { children, buttonText } = props;
  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        aria-haspopup="true"
        variant="contained"
        component="button"
        onClick={setAnchor}
      >
        {buttonText}
      </Button>
      <Popover
        id="player-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={clearAnchor}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        title="player-popover"
      >
        <div style={contentStyle}>
          {children}
        </div>
      </Popover>
    </>
  );
};

export default ButtonPopover;
