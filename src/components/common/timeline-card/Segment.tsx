import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { SegmentType } from "./types";

const bodyStyles: React.CSSProperties = {
  cursor: "default",
  paddingTop: "5px",
  paddingBottom: "5px",
  textAlign: "center",
  borderRadius: 2,
};

const Segment = React.memo((props: SegmentType): React.ReactElement => {
  const {
    palette: { mode },
  } = useTheme();
  const { body, width, color, title, inverted } = props;

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
});

export default Segment;
