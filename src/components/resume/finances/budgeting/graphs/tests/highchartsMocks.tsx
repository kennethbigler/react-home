import type { ReactNode } from "react";

const chartTestState = vi.hoisted(() => ({
  sankeyPointClickHandler: null as Highcharts.PointClickCallbackFunction | null,
  pieSeriesData: [] as Array<{ name: string; y: number }>,
}));

export const clickSankeyNode = (node: { id: string; isNode?: boolean }) => {
  chartTestState.sankeyPointClickHandler?.call(
    { isNode: true, ...node } as unknown as Highcharts.Point,
    {} as Highcharts.PointClickEventObject,
  );
};

export const getPieSeriesData = () => chartTestState.pieSeriesData;

vi.mock("../../../../../common/highcharts/sankeyHighcharts", () => ({
  default: {},
}));

vi.mock("../../../../../common/highcharts/coreHighcharts", () => ({
  default: {},
}));

vi.mock("highcharts/highcharts.src", () => ({
  default: {},
}));

vi.mock("highcharts/modules/accessibility", () => ({ default: vi.fn() }));

vi.mock("@highcharts/react", () => ({
  Chart: ({
    children,
    options,
  }: {
    children: ReactNode;
    options?: Highcharts.Options;
  }) => {
    const clickHandler =
      options?.plotOptions?.sankey?.point?.events?.click ??
      options?.plotOptions?.series?.point?.events?.click;

    if (clickHandler) {
      chartTestState.sankeyPointClickHandler = clickHandler;
    }

    return <div data-testid="highcharts-chart">{children}</div>;
  },
  Credits: () => null,
  Legend: () => null,
  PlotOptions: () => null,
  Series: ({
    data,
    type,
    options,
  }: {
    data?: unknown[];
    type?: string;
    options?: { name?: string };
  }) => {
    if (type === "pie" && Array.isArray(data)) {
      chartTestState.pieSeriesData = data as Array<{ name: string; y: number }>;
    }

    return (
      <div
        data-testid="highcharts-series"
        data-length={Array.isArray(data) ? data.length : 0}
        data-name={options?.name}
        data-type={type}
      />
    );
  },
  Title: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
  setHighcharts: vi.fn(),
}));

vi.mock("@highcharts/react/modules/Accessibility", () => ({
  Accessibility: () => null,
}));
