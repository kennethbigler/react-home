import { memo, CSSProperties } from "react";
import { grey } from "@mui/material/colors";

interface YearMarkerProps {
  body?: string;
  width: number;
}

const boxStyles: CSSProperties = {
  cursor: "default",
  height: 500,
  marginBottom: -500,
  minWidth: 1,
};
const markerStyles: CSSProperties = {
  ...boxStyles,
  backgroundColor: grey[200],
  width: "100%",
  maxWidth: 2.5,
};
const labelStyles: CSSProperties = {
  position: "relative",
  right: 22,
};

const YearMarker = memo(({ body, width }: YearMarkerProps) => {
  // variables for empty segment
  const style: CSSProperties = {
    display: "inline-block",
    width: `${width}%`,
  };

  return !body ? (
    <div title="year" style={style}>
      <br />
    </div>
  ) : (
    <div style={{ ...style, ...boxStyles }} title={body}>
      <div style={markerStyles} title="year-marker">
        <div style={labelStyles}>{body}</div>
      </div>
    </div>
  );
});

YearMarker.displayName = "YearMarker";

export default YearMarker;
