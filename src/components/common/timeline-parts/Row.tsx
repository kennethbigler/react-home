import type { CSSProperties } from "react";
import Segment, { type SegmentType } from "./Segment";
import YearMarker from "./YearMarker";

interface RowProps {
  segments: SegmentType[];
  yearMarkers?: boolean;
  first?: boolean;
  onClick?: (title: string) => void;
}

const baseRowStyles: CSSProperties = {
  display: "flex",
  width: "100%",
  flexWrap: "nowrap",
  minWidth: 0,
};

const smMarginTop: CSSProperties = {
  marginTop: 10,
  position: "relative",
  zIndex: 1,
};
const lgMarginTop: CSSProperties = {
  marginTop: 20,
  position: "relative",
  zIndex: 1,
};
const yearMarkerRowStyle: CSSProperties = {
  height: 0,
  position: "relative",
  zIndex: 0,
};

const Row = ({
  segments,
  onClick,
  yearMarkers = false,
  first = false,
}: RowProps) => {
  let marginStyle = smMarginTop;
  if (yearMarkers) {
    marginStyle = yearMarkerRowStyle;
  } else if (first) {
    marginStyle = lgMarginTop;
  }

  const rowLabel = yearMarkers
    ? undefined
    : segments
        .map(({ title, body }) => title || body)
        .filter(Boolean)
        .join(", ");

  return (
    <div
      style={{ ...baseRowStyles, ...marginStyle }}
      role={yearMarkers ? undefined : "group"}
      aria-label={rowLabel}
    >
      {segments.map((data, j) =>
        yearMarkers ? (
          <YearMarker
            key={j}
            width={data.width}
            body={data?.body || undefined}
            color={data.color || undefined}
          />
        ) : (
          <Segment key={j} {...data} onClick={onClick} />
        ),
      )}
    </div>
  );
};

export default Row;
