import { memo, type CSSProperties } from "react";
import { grey } from "@mui/material/colors";

interface YearMarkerProps {
  body?: string;
  color?: string;
  width: number;
}

const segmentLayout = (width: number): CSSProperties => ({
  flex: `0 0 ${width}%`,
  maxWidth: `${width}%`,
  minWidth: 0,
});

const tickStyles = (color?: string): CSSProperties => ({
  position: "absolute",
  top: 0,
  right: 0,
  width: 2,
  maxWidth: 2.5,
  height: 500,
  marginBottom: -500,
  backgroundColor: color || grey[200],
  cursor: "default",
});

const labelStyles: CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
  transform: "translateX(50%)",
  whiteSpace: "nowrap",
  cursor: "default",
};

const YearMarker = memo(({ body, color, width }: YearMarkerProps) => {
  if (!body) {
    return <div style={segmentLayout(width)} aria-hidden="true" />;
  }

  return (
    <div style={{ ...segmentLayout(width), position: "relative" }}>
      <div style={tickStyles(color)} aria-hidden="true" />
      <div style={{ ...labelStyles, color: color || undefined }}>{body}</div>
    </div>
  );
});

YearMarker.displayName = "YearMarker";

export default YearMarker;
