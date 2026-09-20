import { Component, type ErrorInfo, type ReactNode } from "react";
import { ChartUnavailable } from "./ChartUnavailable";

interface ChartErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ChartErrorBoundaryState {
  hasError: boolean;
}

/** Catches Highcharts load/render failures so the rest of the page stays usable. */
export class ChartErrorBoundary extends Component<
  ChartErrorBoundaryProps,
  ChartErrorBoundaryState
> {
  state: ChartErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ChartErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Highcharts chart failed:", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? <ChartUnavailable />;
    }
    return this.props.children;
  }
}
