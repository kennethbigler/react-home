import React from 'react';
import grey from '@material-ui/core/colors/grey';
import { useTheme } from '@material-ui/core/styles';
import { SegmentType } from './types';

const bodyStyles: React.CSSProperties = {
  cursor: 'default',
  paddingTop: '5px',
  paddingBottom: '5px',
  textAlign: 'center',
  borderRadius: 2,
};

const Segment = React.memo((props: SegmentType): React.ReactElement => {
  const { palette: { type }} = useTheme();
  const {
    body, width, color, title, inverted,
  } = props;

  // variables for empty segment
  let style: React.CSSProperties = {
    display: 'inline-block',
    width: `${width}%`,
    color: inverted ? 'black' : grey[50],
  };
  if (body) {
    style = {
      ...style,
      ...bodyStyles,
      backgroundColor: color,
    };

    if (type !== 'dark') {
      style.boxShadow = `2px 3px 4px ${grey[400]}`;
    }
  }

  return (
    <div style={style} title={title}>
      {body || <br />}
    </div>
  );
});

export default Segment;
