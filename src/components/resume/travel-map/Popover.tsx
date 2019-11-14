import React from 'react';
import grey from '@material-ui/core/colors/grey';

interface PopoverProps {
  x: number;
  y: number;
  hide: boolean;
  content: string;
}

const Popover: React.FC<PopoverProps> = React.memo((props: PopoverProps) => {
  const {
    x, y, hide, content,
  } = props;

  const popoverStyle: React.CSSProperties = {
    position: 'absolute',
    left: x + 2,
    top: y - 35,
    display: hide ? 'none' : 'block',
    backgroundColor: grey[800],
    color: 'white',
    padding: 5,
    borderRadius: 2,
  };

  return (<div style={popoverStyle}>{content}</div>);
});

export default Popover;
