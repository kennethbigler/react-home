import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, Typography } from "@mui/material";

/** Inline warning shown when a Highcharts chart fails to load or render. */
const ChartUnavailable = () => (
  <Box
    role="status"
    aria-live="polite"
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      py: 2,
      color: "warning.main",
    }}
  >
    <WarningAmberIcon aria-hidden />
    <Typography variant="body2" component="span">
      Chart failed to load
    </Typography>
  </Box>
);

export default ChartUnavailable;
