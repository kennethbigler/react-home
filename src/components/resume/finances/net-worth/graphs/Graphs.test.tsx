import {
  formatTooltip,
  getAreaSeriesNamesInOrder,
  getBreakdownSeriesData,
  getChartOptions,
  getSeriesByName,
  getTooltipFormatter,
  resetCapturedChartConfig,
  selectChartPoint,
} from "@/components/common/highcharts/tests/highchartsMocks";
import { createTheme } from "@mui/material/styles";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "jest-axe";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import Graphs from "./Graphs";
import BreakdownChart from "./BreakdownGraph";
import { buildNetWorthBreakdownPieData } from "./buildNetWorthBreakdownPieData";
import NetWorthChart from "./NetWorthGraph";
import {
  buildNetWorthChartData,
  formatNetWorthTooltip,
} from "./netWorthGraphHelpers";
import type { NetWorthCalcEntry, NetWorthEntry } from "@/jotai/net-worth-atom";
import { getCategoryColor } from "@/components/resume/finances/shared/chartPalette";
import themeAtom, { darkTheme, lightTheme } from "@/jotai/theme-atom";
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
    resetCapturedChartConfig();
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

  it("keeps zero-value pie slices while keeping colors aligned to category order", async () => {
    const user = userEvent.setup();
    const { container } = render(
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

    const breakdownTitle = screen.getByText("Net Worth Breakdown");
    expect(breakdownTitle).toBeVisible();
    expect(breakdownTitle.closest("figure")).toBeInTheDocument();

    const categoriesButton = screen.getByRole("button", { name: "Categories" });
    for (
      let tabCount = 0;
      document.activeElement !== categoriesButton && tabCount < 20;
      tabCount += 1
    ) {
      await user.tab();
    }
    expect(categoriesButton).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("dialog", { name: "Show Categories" }),
    ).toBeInTheDocument();

    // Final entry: Investments 50k, Cash 5k, Home 0
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
      expect.objectContaining({
        name: "Home",
        y: 0,
        color: getCategoryColor(2),
      }),
    ]);

    selectChartPoint(0);

    // Earlier entry: Home has value, Cash is 0
    await waitFor(() => {
      expect(getBreakdownSeriesData()).toEqual([
        expect.objectContaining({
          name: "Investments",
          y: 40000,
          color: getCategoryColor(0),
        }),
        expect.objectContaining({
          name: "Cash",
          y: 0,
          color: getCategoryColor(1),
        }),
        expect.objectContaining({
          name: "Home",
          y: 10000,
          color: getCategoryColor(2),
        }),
      ]);
    });

    expect(await axe(container)).toHaveNoViolations();
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

    expect(getBreakdownSeriesData()).toEqual([
      expect.objectContaining({ name: "Cash", y: 0 }),
    ]);
  });

  it("includes zero-value and missing category amounts in the breakdown pie", () => {
    render(
      <Provider>
        <Graphs
          entries={[
            {
              entryDate: "2022-01",
              amounts: { Investments: 60000 },
            },
          ]}
          calcEntries={[{ total: 60000, netDiff: 0 }]}
          categories={["Investments", "Cash"]}
        />
      </Provider>,
    );

    expect(getBreakdownSeriesData()).toEqual([
      expect.objectContaining({ name: "Investments", y: 60000 }),
      expect.objectContaining({ name: "Cash", y: 0 }),
    ]);
  });

  it("uses dark theme title color on the breakdown pie", () => {
    const store = createStore();
    store.set(themeAtom, darkTheme);

    render(
      <Provider store={store}>
        <BreakdownChart categories={["Cash"]} amounts={{ Cash: 1000 }} />
      </Provider>,
    );

    expect(screen.getByText("Net Worth Breakdown")).toHaveStyle({
      color: createTheme({ palette: { mode: "dark" } }).palette.text.primary,
    });
  });

  it("uses light theme title color on the breakdown pie", () => {
    const store = createStore();
    store.set(themeAtom, lightTheme);

    render(
      <Provider store={store}>
        <BreakdownChart categories={["Cash"]} amounts={{ Cash: 1000 }} />
      </Provider>,
    );

    expect(screen.getByText("Net Worth Breakdown")).toHaveStyle({
      color: createTheme({ palette: { mode: "light" } }).palette.text.primary,
    });
  });

  it("hides breakdown categories toggled off in the pie dialog", async () => {
    renderGraphs();

    expect(getBreakdownSeriesData()).toEqual([
      expect.objectContaining({ name: "Investments", y: 60000 }),
      expect.objectContaining({ name: "Cash", y: 15000 }),
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Categories" }));
    expect(
      screen.getByRole("dialog", { name: "Show Categories" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("switch", { name: "Show Cash" }));

    await waitFor(() => {
      expect(getBreakdownSeriesData()).toEqual([
        expect.objectContaining({ name: "Investments", y: 60000 }),
      ]);
    });
  });

  it("disables category switches when the selected entry amount is zero", () => {
    render(
      <Provider>
        <Graphs
          entries={[
            {
              entryDate: "2022-01",
              amounts: { Investments: 60000, Cash: 15000, Vehicles: 0 },
            },
          ]}
          calcEntries={[{ total: 75000, netDiff: 0 }]}
          categories={["Investments", "Cash", "Vehicles"]}
        />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Categories" }));

    expect(
      screen.getByRole("switch", { name: "Show Investments" }),
    ).toBeEnabled();
    expect(screen.getByRole("switch", { name: "Show Cash" })).toBeEnabled();
    expect(
      screen.getByRole("switch", { name: "Show Vehicles" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("switch", { name: "Show Vehicles" }),
    ).not.toBeChecked();
  });
});

describe("resume | finances | net-worth | buildNetWorthBreakdownPieData", () => {
  it("keeps positive amounts and includes zero categories", () => {
    expect(
      buildNetWorthBreakdownPieData(["Investments", "Cash", "Home"], {
        Investments: 60000,
        Cash: 0,
      }),
    ).toEqual([
      {
        name: "Investments",
        y: 60000,
        color: getCategoryColor(0),
      },
      {
        name: "Cash",
        y: 0,
        color: getCategoryColor(1),
      },
      {
        name: "Home",
        y: 0,
        color: getCategoryColor(2),
      },
    ]);
  });

  it("clamps negative category amounts to zero", () => {
    expect(
      buildNetWorthBreakdownPieData(["Investments", "Cash"], {
        Investments: 60000,
        Cash: -5000,
      }),
    ).toEqual([
      {
        name: "Investments",
        y: 60000,
        color: getCategoryColor(0),
      },
      {
        name: "Cash",
        y: 0,
        color: getCategoryColor(1),
      },
    ]);
  });

  it("omits hidden categories while keeping their colors aligned", () => {
    expect(
      buildNetWorthBreakdownPieData(
        ["Investments", "Cash", "Home"],
        { Investments: 60000, Cash: 15000, Home: 10000 },
        new Set(["Cash"]),
      ),
    ).toEqual([
      {
        name: "Investments",
        y: 60000,
        color: getCategoryColor(0),
      },
      {
        name: "Home",
        y: 10000,
        color: getCategoryColor(2),
      },
    ]);
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
    resetCapturedChartConfig();
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

    expect(getChartOptions().colors?.at(-1)).toBe(
      createTheme({ palette: { mode: "dark" } }).palette.text.primary,
    );
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

    expect(getChartOptions().colors?.at(-1)).toBe(
      createTheme({ palette: { mode: "light" } }).palette.text.primary,
    );
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

  it("escapes user-editable series names in tooltip HTML", () => {
    const html = formatNetWorthTooltip(
      [
        {
          y: 10,
          series: { name: '<Cash & "Bonds">', color: "#0f0" },
        },
      ],
      { categoryNames: ['<Cash & "Bonds">'] },
    );

    expect(html).toContain("&lt;Cash &amp; &quot;Bonds&quot;&gt;:");
    expect(html).not.toContain('<Cash & "Bonds">:');
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
      [{ y: undefined, series: { name: "Cash", color: "#abc" } }],
      { categoryNames: ["Cash"] },
    );

    expect(html).toContain("Cash:");
    expect(html).toContain("$0.00");
    expect(html).not.toContain("Inflation:");
  });
});
