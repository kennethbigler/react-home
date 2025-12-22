import { CSSProperties } from "react";
import Segment, { SegmentType } from "./Segment";
import YearMarker from "./YearMarker";

interface RowProps {
  segments: SegmentType[];
  yearMarkers?: boolean;
  first?: boolean;
  onClick?: (title: string) => void;
}

const smMarginTop: CSSProperties = { marginTop: 10 };
const lgMarginTop: CSSProperties = { marginTop: 20 };
const noStyle: CSSProperties = { height: 0 };

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
          <YearMarker key={j} body={data.body} width={data.width} />
        ) : (
          <Segment key={j} {...data} onClick={onClick} />
        ),
      )}
    </div>
  );
};

export default Row;
