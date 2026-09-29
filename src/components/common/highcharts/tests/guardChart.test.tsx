import { Suspense, type ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import { guardChart, groupedChart } from "../guardChart";

describe("common | highcharts | guardChart", () => {
  it("shows ChartUnavailable when the lazy loader rejects, keeping surrounding content", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const BrokenChart = guardChart<Record<string, never>>(() =>
      Promise.reject(new Error("chunk failed")),
    );

    render(
      <>
        <h1>Page title</h1>
        <BrokenChart />
      </>,
    );

    expect(
      screen.getByRole("heading", { name: "Page title" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/chart failed to load/i, {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Page title" }),
    ).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it("shows a polite loading status while the chart chunk resolves", async () => {
    let resolveLoader!: (value: { default: () => ReactElement }) => void;
    const loader = new Promise<{ default: () => ReactElement }>((resolve) => {
      resolveLoader = resolve;
    });

    const SlowChart = guardChart<Record<string, never>>(() => loader);

    render(<SlowChart />);

    expect(
      screen.getByRole("status", { name: "Loading page content" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Loading" }),
    ).toBeInTheDocument();

    resolveLoader({ default: () => <div>chart ready</div> });

    expect(await screen.findByText("chart ready")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("lets a parent Suspense show one loading UI for several charts", async () => {
    let resolveFirst!: (value: { default: () => ReactElement }) => void;
    let resolveSecond!: (value: { default: () => ReactElement }) => void;
    const firstLoader = new Promise<{ default: () => ReactElement }>(
      (resolve) => {
        resolveFirst = resolve;
      },
    );
    const secondLoader = new Promise<{ default: () => ReactElement }>(
      (resolve) => {
        resolveSecond = resolve;
      },
    );

    const FirstChart = groupedChart<Record<string, never>>(() => firstLoader);
    const SecondChart = groupedChart<Record<string, never>>(() => secondLoader);

    render(
      <Suspense fallback={<div role="status">section loading</div>}>
        <FirstChart />
        <SecondChart />
      </Suspense>,
    );

    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(screen.getByRole("status")).toHaveTextContent("section loading");

    resolveFirst({ default: () => <div>first ready</div> });
    resolveSecond({ default: () => <div>second ready</div> });

    expect(await screen.findByText("first ready")).toBeInTheDocument();
    expect(screen.getByText("second ready")).toBeInTheDocument();
    expect(screen.queryByText("section loading")).not.toBeInTheDocument();
  });
});
