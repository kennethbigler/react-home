import * as React from "react";
import Segment from "./Segment";
import YearMarkers from "./YearMarkers";
import { SegmentType } from "./timelineHelpers";

interface RowProps {
  segments: SegmentType[];
  yearMarkers?: boolean;
  first?: boolean;
  onClick?: (title: string) => void;
}

const smMarginTop: React.CSSProperties = { marginTop: 10 };
const lgMarginTop: React.CSSProperties = { marginTop: 20 };
const noStyle: React.CSSProperties = { height: 0 };

const Row = ({
  segments,
  onClick,
  yearMarkers = false,
  first = false,
}: RowProps) => {
  let style = smMarginTop;
  if (yearMarkers) {
    style = noStyle;
  } else if (first) {
    style = lgMarginTop;
  }

  return (
    <div style={style}>
      {segments.map((data, j) =>
        yearMarkers ? (
          <YearMarkers key={j} body={data.body} width={data.width} />
        ) : (
          <Segment key={j} {...data} onClick={onClick} />
        ),
      )}
    </div>
  );
};

export default Row;
