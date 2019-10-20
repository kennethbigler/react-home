import React from 'react';
import grey from '@material-ui/core/colors/grey';

interface YearMarker { // color?: any; // title?: any;
  body?: any;
  width: number;
}
interface YearMarkersProps {
  data: YearMarker;
}

const boxStyles: React.CSSProperties = {
  cursor: 'default',
  backgroundColor: grey[200],
  height: 500,
  marginBottom: -500,
  minWidth: 1,
};
const labelStyles: React.CSSProperties = {
  position: 'relative',
  right: 22,
};

const YearMarkers: React.FC<YearMarkersProps> = (props: YearMarkersProps) => {
  const { data: { body, width }} = props;
  // variables for empty segment
  let style: React.CSSProperties = { display: 'inline-block', width: `${width}%` };
  if (body) {
    style = { ...style, ...boxStyles };
  }

  return (
    <div style={style}>
      {body ? (
        <div style={labelStyles}>
          {body}
        </div>
      ) : (<br />)}
    </div>
  );
};

export default YearMarkers;
