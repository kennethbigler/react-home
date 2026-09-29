import { Suspense, type ReactNode } from "react";
import LoadingSpinner from "../loading-spinner";

/** One loading spinner for a group of charts that skip inner Suspense. */
export const ChartSection = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);
