import type { ReactNode } from "react";
import { ChartErrorBoundary } from "./ChartErrorBoundary";

const figureStyle = { margin: 0, width: "100%" } as const;

/** Margin-less figure that isolates chart render failures. */
export const ChartShell = ({ children }: { children: ReactNode }) => (
  <ChartErrorBoundary>
    <figure style={figureStyle}>{children}</figure>
  </ChartErrorBoundary>
);
