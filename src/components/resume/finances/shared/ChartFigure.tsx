import type { ReactNode } from "react";
import { ChartShell } from "@/components/common/highcharts/ChartShell";

/** Margin-less <figure> wrapper that lets charts fill their grid cell. */
const ChartFigure = ({ children }: { children: ReactNode }) => (
  <ChartShell>{children}</ChartShell>
);

export default ChartFigure;
