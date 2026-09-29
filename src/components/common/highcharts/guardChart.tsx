import { lazy, Suspense, type ComponentType } from "react";
import { ChartErrorBoundary } from "./ChartErrorBoundary";
import LoadingSpinner from "../loading-spinner";

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
      <Suspense fallback={<LoadingSpinner />}>
        <LazyChart {...props} />
      </Suspense>
    </ChartErrorBoundary>
  );

  return GuardedChart;
};
