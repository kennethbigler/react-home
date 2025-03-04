import * as React from "react";
import { grey } from "@mui/material/colors";

interface YearMarkersProps {
  body?: string;
  width: number;
}

const boxStyles: React.CSSProperties = {
  cursor: "default",
  height: 500,
  marginBottom: -500,
  minWidth: 1,
};
const markerStyles: React.CSSProperties = {
  ...boxStyles,
  backgroundColor: grey[200],
  width: "100%",
  maxWidth: 2.5,
};
const labelStyles: React.CSSProperties = {
  position: "relative",
  right: 22,
};

const YearMarkers = React.memo(({ body, width }: YearMarkersProps) => {
  // variables for empty segment
  const style: React.CSSProperties = {
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

YearMarkers.displayName = "YearMarkers";

export default YearMarkers;
