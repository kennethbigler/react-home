import { memo, CSSProperties } from "react";
import { useTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { SegmentType } from "./timelineHelpers";

const bodyStyles: CSSProperties = {
  cursor: "pointer",
  paddingTop: "0.5em",
  paddingBottom: "0.5em",
  textAlign: "center",
  borderRadius: 2,
  border: 0,
  fontFamily: "Montserrat, sans-serif",
  fontSize: "1em",
};

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

    // variables for empty segment
    let style: CSSProperties = {
      display: "inline-block",
      width: `${width}%`,
      color: inverted ? "black" : grey[50],
    };
    if (body) {
      style = {
        ...style,
        ...bodyStyles,
        backgroundColor: color,
        boxShadow: `2px 3px 4px 1px ${mode !== "dark" ? grey[400] : grey[700]}`,
      };
    }

    return body ? (
      <button style={style} title={title} onClick={() => onClick(title || "")}>
        {body || <br />}
      </button>
    ) : (
      <div style={style}>
        <br />
      </div>
    );
  },
);

Segment.displayName = "Segment";

export default Segment;
