import { lazy, Suspense, type ComponentType } from "react";
import { Box, Typography } from "@mui/material";
import { ChartErrorBoundary } from "./ChartErrorBoundary";

/** Non-focus-stealing status shown while a chart chunk is loading. */
const ChartLoading = () => (
  <Box role="status" aria-live="polite" sx={{ py: 2 }}>
    <Typography variant="body2" component="span">
      Loading chart…
    </Typography>
  </Box>
);

/**
 * Lazy-loads a chart module and isolates Highcharts failures to a warning UI
 * so the surrounding page (header, copy, other sections) still renders.
 */
export const guardChart = <P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
): ComponentType<P> => {
  const LazyChart = lazy(loader);

  const GuardedChart = (props: P) => (
    <ChartErrorBoundary>
      <Suspense fallback={<ChartLoading />}>
        <LazyChart {...props} />
      </Suspense>
    </ChartErrorBoundary>
  );

  return GuardedChart;
};
