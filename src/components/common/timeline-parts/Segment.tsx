import { memo, type CSSProperties } from "react";
import { useTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

export interface SegmentType {
  color?: string;
  body?: string;
  title?: string;
  width: number;
  inverted?: boolean;
  onClick?: (title: string) => void;
}

const bodyStyles: CSSProperties = {
  boxSizing: "border-box",
  cursor: "pointer",
  paddingTop: "0.5em",
  paddingBottom: "0.5em",
  lineHeight: 1.5,
  minWidth: 0,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  textAlign: "center",
  borderRadius: 2,
  border: 0,
  fontFamily: "Montserrat, sans-serif",
  fontSize: "1em",
  verticalAlign: "top",
};

const segmentLayout = (width: number): CSSProperties => ({
  flex: `0 0 ${width}%`,
  maxWidth: `${width}%`,
  minWidth: 0,
});

const Segment = memo(
  ({
    body,
    width,
    color,
    title,
    inverted,
    onClick = () => {},
  }: SegmentType) => {
    const {
      palette: { mode },
    } = useTheme();

    let style: CSSProperties = {
      ...segmentLayout(width),
      color: inverted ? "black" : grey[50],
    };
    if (body) {
      style = {
        ...style,
        ...bodyStyles,
        position: "relative",
        zIndex: 1,
        backgroundColor: color,
        boxShadow: `2px 3px 4px 1px ${mode !== "dark" ? grey[400] : grey[700]}`,
      };
    }

    return body ? (
      <button
        type="button"
        style={style}
        title={title}
        aria-label={title || undefined}
        onClick={() => onClick(title || "")}
      >
        {body || <br />}
      </button>
    ) : (
      <div style={style} aria-hidden="true" />
    );
  },
);

Segment.displayName = "Segment";

export default Segment;
