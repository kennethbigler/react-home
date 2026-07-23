import {
  formatTooltip,
  getAreaSeriesNamesInOrder,
  getBreakdownSeriesData,
  getChartOptions,
  getSeriesByName,
  getTooltipFormatter,
  resetCapturedNetWorthChartConfig,
  selectChartPoint,
} from "./tests/highchartsMocks";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import Graphs from "./Graphs";
import NetWorthChart from "./NetWorthGraph";
import {
  buildNetWorthChartData,
  formatNetWorthTooltip,
} from "./netWorthGraphHelpers";
import {
  NetWorthCalcEntry,
  NetWorthEntry,
} from "../../../../../jotai/finances-atom";
import { getCategoryColor } from "./colors";
import themeAtom, {
  darkTheme,
  lightTheme,
} from "../../../../../jotai/theme-atom";

describe("resume | finances | net-worth | Graphs", () => {
  // Pre-sorted by final-entry amounts (largest first), as NetWorth provides.
  const categories = ["Investments", "Cash"];
  const entries: NetWorthEntry[] = [
    { entryDate: "2020-01", amounts: { Cash: 10000, Investments: 40000 } },
    { entryDate: "2021-01", amounts: { Cash: 12000, Investments: 50000 } },
    { entryDate: "2022-01", amounts: { Cash: 15000, Investments: 60000 } },
  ];
  const calcEntries: NetWorthCalcEntry[] = [
    { total: 50000, netDiff: 0 },
    { total: 62000, netDiff: 12000 },
    { total: 75000, netDiff: 13000 },
  ];

  const renderGraphs = () =>
    render(
      <Provider>
        <Graphs
          entries={entries}
          calcEntries={calcEntries}
          categories={categories}
        />
      </Provider>,
    );

  beforeEach(() => {
    resetCapturedNetWorthChartConfig();
  });

  it("renders both net worth charts", () => {
    renderGraphs();

    expect(screen.getByText("Total Net Worth")).toBeInTheDocument();
    expect(screen.getByText("Net Worth Breakdown")).toBeInTheDocument();
    expect(screen.getAllByTestId("highcharts-chart").length).toBe(2);
  });

  it("builds stacked category series plus inflation", () => {
    renderGraphs();

    expect(getSeriesByName("Cash")?.data).toHaveLength(3);
    expect(getSeriesByName("Investments")?.data).toHaveLength(3);
    expect(getSeriesByName("Total")).toBeUndefined();
    expect(getSeriesByName("Inflation")?.data).toHaveLength(3);
  });

  it("stacks categories largest-first to match pie colors; bottom via reversedStacks", () => {
    renderGraphs();

    // Same order as the pie (largest first). YAxis reversedStacks={false}
    // puts the first series on the bottom of the area stack.
    expect(getAreaSeriesNamesInOrder()).toEqual(["Investments", "Cash"]);
  });

  it("orders pie slices largest-first from the final entry", () => {
    renderGraphs();

    expect(getBreakdownSeriesData()).toEqual([
      expect.objectContaining({ name: "Investments", y: 60000 }),
      expect.objectContaining({ name: "Cash", y: 15000 }),
    ]);
  });

  it("hides zero-value pie slices while keeping colors aligned to category order", async () => {
    render(
      <Provider>
        <Graphs
          entries={[
            {
              entryDate: "2020-01",
              amounts: { Cash: 0, Investments: 40000, Home: 10000 },
            },
            {
              entryDate: "2021-01",
              amounts: { Cash: 5000, Investments: 50000, Home: 0 },
            },
          ]}
          calcEntries={[
            { total: 50000, netDiff: 0 },
            { total: 55000, netDiff: 5000 },
          ]}
          categories={["Investments", "Cash", "Home"]}
        />
      </Provider>,
    );

    // Final entry: Investments 50k, Cash 5k, Home 0 → Home hidden from pie
    expect(getBreakdownSeriesData()).toEqual([
      expect.objectContaining({
        name: "Investments",
        y: 50000,
        color: getCategoryColor(0),
      }),
      expect.objectContaining({
        name: "Cash",
        y: 5000,
        color: getCategoryColor(1),
      }),
    ]);

    selectChartPoint(0);

    // Earlier entry: Home has value, Cash is 0 → Cash hidden; Home keeps index-2 color
    await waitFor(() => {
      expect(getBreakdownSeriesData()).toEqual([
        expect.objectContaining({
          name: "Investments",
          y: 40000,
          color: getCategoryColor(0),
        }),
        expect.objectContaining({
          name: "Home",
          y: 10000,
          color: getCategoryColor(2),
        }),
      ]);
    });
  });

  it("keeps final-entry category order when an earlier point is selected", async () => {
    renderGraphs();
    selectChartPoint(0);

    await waitFor(() => {
      expect(getBreakdownSeriesData()).toEqual([
        expect.objectContaining({ name: "Investments", y: 40000 }),
        expect.objectContaining({ name: "Cash", y: 10000 }),
      ]);
    });
  });

  it("renders empty pie amounts when there are no entries", () => {
    render(
      <Provider>
        <Graphs entries={[]} calcEntries={[]} categories={["Cash"]} />
      </Provider>,
    );

    expect(getBreakdownSeriesData()).toEqual([]);
  });
});

describe("resume | finances | net-worth | NetWorthChart", () => {
  const entries: NetWorthEntry[] = [
    { entryDate: "2020-01", amounts: { Cash: 100 } },
    { entryDate: "2021-01", amounts: { Cash: 200 } },
  ];
  const calcEntries: NetWorthCalcEntry[] = [
    { total: 100, netDiff: 0 },
    { total: 200, netDiff: 100 },
  ];

  beforeEach(() => {
    resetCapturedNetWorthChartConfig();
  });

  it("ignores point clicks without an index", () => {
    const onPointSelect = vi.fn();
    render(
      <Provider>
        <NetWorthChart
          startIdx={0}
          entries={entries}
          calcEntries={calcEntries}
          categories={["Cash"]}
          onPointSelect={onPointSelect}
        />
      </Provider>,
    );

    selectChartPoint(undefined);
    expect(onPointSelect).not.toHaveBeenCalled();
  });

  it("uses dark theme colors when theme mode is dark", () => {
    const store = createStore();
    store.set(themeAtom, darkTheme);

    render(
      <Provider store={store}>
        <NetWorthChart
          startIdx={0}
          entries={entries}
          calcEntries={calcEntries}
          categories={["Cash"]}
          onPointSelect={vi.fn()}
        />
      </Provider>,
    );

    expect(getChartOptions().colors?.at(-1)).toBe("white");
  });

  it("uses light theme colors when theme mode is light", () => {
    const store = createStore();
    store.set(themeAtom, lightTheme);

    render(
      <Provider store={store}>
        <NetWorthChart
          startIdx={0}
          entries={entries}
          calcEntries={calcEntries}
          categories={["Cash"]}
          onPointSelect={vi.fn()}
        />
      </Provider>,
    );

    expect(getChartOptions().colors?.at(-1)).toBe("black");
  });

  it("formats tooltip content for shared and single-point hovers", () => {
    render(
      <Provider>
        <NetWorthChart
          startIdx={1}
          entries={entries}
          calcEntries={calcEntries}
          categories={["Cash"]}
          onPointSelect={vi.fn()}
        />
      </Provider>,
    );

    expect(getTooltipFormatter()).toBeTruthy();

    const tooltipPoint = {
      index: 1,
      y: 200,
      series: { name: "Cash", color: "#111111" },
    } as Highcharts.Point;

    const sharedTooltip = formatTooltip({
      points: [
        tooltipPoint,
        {
          index: 1,
          y: 200,
          series: { name: "Inflation", color: "#222222" },
        } as Highcharts.Point,
      ],
    } as Highcharts.Point);
    const singlePointTooltip = formatTooltip(tooltipPoint);

    expect(sharedTooltip).toContain("Net Worth");
    expect(sharedTooltip).toContain("Total:");
    expect(sharedTooltip).toContain("Inflation:");
    expect(singlePointTooltip).toContain("Cash:");
  });
});

describe("netWorthGraphHelpers", () => {
  it("returns empty series when there are no entries", () => {
    expect(buildNetWorthChartData(0, [], [], ["Cash"])).toEqual({
      categorySeries: [[]],
      inflation: [],
    });
  });

  it("builds chart points with inflation compounding from startIdx", () => {
    const entries: NetWorthEntry[] = [
      { entryDate: "2020-01", amounts: { Cash: 100 } },
      { entryDate: "2021-01", amounts: { Cash: 200 } },
    ];
    const calcEntries: NetWorthCalcEntry[] = [
      { total: 100, netDiff: 0 },
      { total: 200, netDiff: 100 },
    ];

    const chartData = buildNetWorthChartData(0, entries, calcEntries, ["Cash"]);

    expect(chartData.categorySeries[0]).toHaveLength(2);
    expect(chartData.inflation[0][1]).toBe(100);
    expect(chartData.inflation[1][1]).toBeCloseTo(100 * 1.012);
  });

  it("mirrors total when inflation baseline is the last entry", () => {
    const entries: NetWorthEntry[] = [
      { entryDate: "2020-01", amounts: { Cash: 100 } },
      { entryDate: "2021-01", amounts: { Cash: 200 } },
    ];
    const calcEntries: NetWorthCalcEntry[] = [
      { total: 100, netDiff: 0 },
      { total: 200, netDiff: 100 },
    ];

    const chartData = buildNetWorthChartData(1, entries, calcEntries, ["Cash"]);

    expect(chartData.inflation.map(([, y]) => y)).toEqual([100, 200]);
  });

  it("uses entry totals for years before the selected inflation baseline", () => {
    const entries: NetWorthEntry[] = [
      { entryDate: "2019-01", amounts: { Cash: 50 } },
      { entryDate: "2020-01", amounts: { Cash: 100 } },
      { entryDate: "2021-01", amounts: { Cash: 200 } },
    ];
    const calcEntries: NetWorthCalcEntry[] = [
      { total: 50, netDiff: 0 },
      { total: 100, netDiff: 50 },
      { total: 200, netDiff: 100 },
    ];

    const chartData = buildNetWorthChartData(1, entries, calcEntries, ["Cash"]);

    expect(chartData.inflation[0][1]).toBe(50);
    expect(chartData.inflation[1][1]).toBe(100);
    expect(chartData.inflation[2][1]).toBeCloseTo(100 * 1.012);
  });

  it("defaults missing category amounts and unknown inflation years to safe values", () => {
    const entries: NetWorthEntry[] = [
      { entryDate: "1999-01", amounts: {} },
      { entryDate: "2000-01", amounts: { Cash: 100 } },
    ];
    const calcEntries: NetWorthCalcEntry[] = [
      { total: 0, netDiff: 0 },
      { total: 100, netDiff: 100 },
    ];

    const chartData = buildNetWorthChartData(0, entries, calcEntries, ["Cash"]);

    expect(chartData.categorySeries[0][0][1]).toBe(0);
    expect(chartData.inflation[0][1]).toBe(0);
    expect(chartData.inflation[1][1]).toBe(0);
  });

  it("formats tooltip rows with Total above Inflation", () => {
    const html = formatNetWorthTooltip(
      [
        {
          y: 10,
          series: { name: "Cash", color: "#0f0" },
        },
        {
          y: 20,
          series: { name: "Inflation", color: "#00f" },
        },
      ],
      { categoryNames: ["Cash"] },
    );

    expect(html).toContain("<b>Net Worth</b>");
    expect(html).toContain("Cash:");
    expect(html).toContain("Total:");
    expect(html).toContain("Inflation:");
    expect(html).not.toContain("*Total:");
    expect(html).toContain("$10.00");
    expect(html.indexOf("Total:")).toBeLessThan(html.indexOf("Inflation:"));
  });

  it("shows the final inflation value when hovering the selected point", () => {
    const html = formatNetWorthTooltip(
      [
        { y: 10, series: { name: "Cash", color: undefined } },
        { y: 11, series: { name: "Inflation", color: undefined } },
      ],
      {
        categoryNames: ["Cash"],
        finalInflationValue: 99,
        hoveredPointIndex: 2,
        selectedPointIndex: 2,
      },
    );

    expect(html).toContain("$99.00");
    expect(html).toContain("inherit");
  });

  it("omits the inflation row when inflation is not in the points", () => {
    const html = formatNetWorthTooltip(
      [{ y: null, series: { name: "Cash", color: "#abc" } }],
      { categoryNames: ["Cash"] },
    );

    expect(html).toContain("Cash:");
    expect(html).toContain("$0.00");
    expect(html).not.toContain("Inflation:");
  });
});
