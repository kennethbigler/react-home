import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { SegmentType } from "./timelineHelpers";

const bodyStyles: React.CSSProperties = {
  cursor: "default",
  paddingTop: "5px",
  paddingBottom: "5px",
  textAlign: "center",
  borderRadius: 2,
};

const Segment = React.memo(
  ({ body, width, color, title, inverted }: SegmentType) => {
    const {
      palette: { mode },
    } = useTheme();

    // variables for empty segment
    let style: React.CSSProperties = {
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

    return (
      <div style={style} title={title}>
        {body || <br />}
      </div>
    );
  },
);

Segment.displayName = "Segment";

export default Segment;
