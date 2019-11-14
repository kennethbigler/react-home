import React from 'react';
import grey from '@material-ui/core/colors/grey';
import { withTheme, Theme } from '@material-ui/core/styles';
import { SegmentType } from './types';

interface SegmentProps extends SegmentType {
  theme: Theme;
}

const Segment: React.FC<SegmentProps> = React.memo((props: SegmentProps) => {
  const {
    body, width, color, title, inverted,
    theme: { palette: { type }},
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
      cursor: 'default',
      paddingTop: '5px',
      paddingBottom: '5px',
      textAlign: 'center',
      borderRadius: 2,
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

export default withTheme(Segment);
