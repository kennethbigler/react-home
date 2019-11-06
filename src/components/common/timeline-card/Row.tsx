import React from 'react';
import Segment from './Segment';
import YearMarkers from './YearMarkers';
import { SegmentType } from './types';

interface RowProps {
  segments: SegmentType[];
  yearMarkers?: boolean;
  first?: boolean;
}

const Row: React.FC<RowProps> = (props: RowProps) => {
  const { segments, yearMarkers, first } = props;

  let style: React.CSSProperties = { marginTop: 10 };
  if (yearMarkers) {
    style = { height: 0 };
  } else if (first) {
    style = { marginTop: 20 };
  }

  return (
    <div style={style}>
      {segments.map((data, j) => (yearMarkers
        ? (<YearMarkers key={j} data={data} />)
        : (<Segment key={j} {...data} />)))}
    </div>
  );
};

Row.defaultProps = {
  yearMarkers: false,
  first: false,
};

export default Row;
