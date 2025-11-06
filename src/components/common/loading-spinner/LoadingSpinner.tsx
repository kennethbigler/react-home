import { memo, CSSProperties } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const containerStyles: CSSProperties = {
  display: "block",
  margin: "auto",
  marginTop: 40,
};

const LoadingSpinner = memo(() => (
  <CircularProgress
    size={100}
    style={containerStyles}
    title="Loading Spinner"
  />
));

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;
