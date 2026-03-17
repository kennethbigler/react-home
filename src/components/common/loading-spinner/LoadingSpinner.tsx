import { memo, CSSProperties } from "react";
import { CircularProgress } from "@mui/material";
const containerStyles: CSSProperties = {
  display: "block",
  margin: "auto",
  marginTop: 40,
};

const LoadingSpinner = memo(() => (
  <div role="status" aria-live="polite" aria-label="Loading page content">
    <CircularProgress size={100} style={containerStyles} aria-label="Loading" />
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;
