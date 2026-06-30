import type { ReactNode } from "react";

vi.mock("../../../common/highcharts/sankeyHighcharts", () => ({
  default: {},
}));

vi.mock("highcharts/highcharts.src", () => ({
  default: {},
}));

vi.mock("highcharts/modules/accessibility", () => ({ default: vi.fn() }));

vi.mock("@highcharts/react", () => ({
  Chart: ({ children }: { children: ReactNode }) => (
    <div data-testid="highcharts-chart">{children}</div>
  ),
  Credits: () => null,
  Legend: () => null,
  PlotOptions: ({ children }: { children?: ReactNode }) => <>{children}</>,
  Series: ({
    data,
    type,
    options,
  }: {
    data?: unknown[];
    type?: string;
    options?: { name?: string };
  }) => (
    <div
      data-testid="highcharts-series"
      data-length={Array.isArray(data) ? data.length : 0}
      data-name={options?.name}
      data-type={type}
    />
  ),
  Title: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: ({ children }: { children?: ReactNode }) => <>{children}</>,
  setHighcharts: vi.fn(),
}));

vi.mock("@highcharts/react/modules/Accessibility", () => ({
  Accessibility: () => null,
}));
