import * as React from "react";
import Segment from "./Segment";
import YearMarkers from "./YearMarkers";
import { SegmentType } from "./types";

interface RowProps {
  segments: SegmentType[];
  yearMarkers?: boolean;
  first?: boolean;
}

const smMarginTop: React.CSSProperties = { marginTop: 10 };
const lgMarginTop: React.CSSProperties = { marginTop: 20 };
const noStyle: React.CSSProperties = { height: 0 };

const Row = (props: RowProps): React.ReactElement => {
  const { segments, yearMarkers = false, first = false } = props;

  let style = smMarginTop;
  if (yearMarkers) {
    style = noStyle;
  } else if (first) {
    style = lgMarginTop;
  }

  return (
    <div style={style} title="timeline-row">
      {segments.map((data, j) =>
        yearMarkers ? (
          <YearMarkers key={j} data={data} />
        ) : (
          <Segment key={j} {...data} />
        ),
      )}
    </div>
  );
};

export default Row;
