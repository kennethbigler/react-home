import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const containerStyles: React.CSSProperties = {
  display: "block",
  margin: "auto",
  marginTop: 40,
};

const LoadingSpinner = React.memo(() => (
  <CircularProgress
    size={100}
    style={containerStyles}
    title="Loading Spinner"
  />
));

export default LoadingSpinner;
