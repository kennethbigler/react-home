import { lazy, Suspense, type ComponentType } from "react";
import ChartErrorBoundary from "./ChartErrorBoundary";

/**
 * Lazy-loads a chart module and isolates Highcharts failures to a warning UI
 * so the surrounding page (header, copy, other sections) still renders.
 */
const guardChart = <P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
): ComponentType<P> => {
  const LazyChart = lazy(loader);

  const GuardedChart = (props: P) => (
    <ChartErrorBoundary>
      <Suspense fallback={null}>
        <LazyChart {...props} />
      </Suspense>
    </ChartErrorBoundary>
  );

  return GuardedChart;
};

export default guardChart;
