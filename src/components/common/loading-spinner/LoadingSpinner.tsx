import { memo, CSSProperties } from "react";
import { CircularProgress } from "@mui/material";
const containerStyles: CSSProperties = {
  display: "block",
  margin: "auto",
  marginTop: 40,
};

const LoadingSpinner = memo(() => (
  <CircularProgress
    size={100}
    style={containerStyles}
    aria-label="Loading"
    title="Loading Spinner"
  />
));

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;
