import type { CSSProperties, ReactNode } from "react";

const figureStyle: CSSProperties = { margin: 0, width: "100%" };

/** Margin-less <figure> wrapper that lets charts fill their grid cell. */
const ChartFigure = ({ children }: { children: ReactNode }) => (
  <figure style={figureStyle}>{children}</figure>
);

export default ChartFigure;
