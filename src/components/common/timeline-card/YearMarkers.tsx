import React from 'react';
import grey from '@material-ui/core/colors/grey';
import { SegmentType } from './types';

interface YearMarkersProps {
  data: SegmentType;
}

const boxStyles: React.CSSProperties = {
  cursor: 'default',
  height: 500,
  marginBottom: -500,
  minWidth: 1,
};
const markerStyles: React.CSSProperties = {
  ...boxStyles,
  backgroundColor: grey[200],
  width: '100%',
  maxWidth: 2.5,
};
const labelStyles: React.CSSProperties = {
  position: 'relative',
  right: 22,
};

const YearMarkers = (props: YearMarkersProps): React.ReactElement => {
  const { data: { body, width }} = props;

  // variables for empty segment
  const style: React.CSSProperties = { display: 'inline-block', width: `${width}%` };

  if (!body) {
    return (<div style={style}><br /></div>);
  }

  return (
    <div style={{ ...style, ...boxStyles }}>
      <div style={markerStyles}>
        <div style={labelStyles}>{body}</div>
      </div>
    </div>
  );
};

export default YearMarkers;
