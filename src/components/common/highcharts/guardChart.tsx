import { lazy, Suspense, type ComponentType } from "react";
import { ChartErrorBoundary } from "./ChartErrorBoundary";
import LoadingSpinner from "../loading-spinner";

interface GuardChartOptions {
  /**
   * When false, skip the inner Suspense so a parent can show one loading
   * spinner for several charts. A parent `<Suspense>` is then required.
   */
  suspense?: boolean;
}

/**
 * Lazy-loads a chart module and isolates Highcharts failures to a warning UI
 * so the surrounding page (header, copy, other sections) still renders.
 */
export const guardChart = <P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  { suspense = true }: GuardChartOptions = {},
): ComponentType<P> => {
  const LazyChart = lazy(loader);

  const GuardedChart = (props: P) => (
    <ChartErrorBoundary>
      {suspense ? (
        <Suspense fallback={<LoadingSpinner />}>
          <LazyChart {...props} />
        </Suspense>
      ) : (
        <LazyChart {...props} />
      )}
    </ChartErrorBoundary>
  );

  return GuardedChart;
};

/** Use with ChartSection so several charts share one loading spinner. */
export const groupedChart = <P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
) => guardChart(loader, { suspense: false });
