import "../../../common/highcharts/tests/highchartsMocks";
import { screen, waitFor } from "@testing-library/react";
import { blue, green } from "@mui/material/colors";
import type Highcharts from "highcharts/esm/highmaps.src.js";
import { numCountries } from "@/constants/travel";
import themeAtom, { darkTheme } from "@/jotai/theme-atom";
import { renderWithHydratedAtoms } from "@/test-utils/renderWithHydratedAtoms";
import WorldMap from "./WorldMap";

const capturedMap = vi.hoisted(() => ({
  chartOptions: undefined as Highcharts.Options | undefined,
  seriesOptions: undefined as
    | (Highcharts.SeriesMapOptions & { nullInteraction?: boolean })
    | undefined,
}));

vi.mock("@highcharts/react/Maps", () => ({
  MapsChart: ({
    children,
    options,
  }: {
    children: React.ReactNode;
    options?: Highcharts.Options;
  }) => {
    capturedMap.chartOptions = options;
    return <div data-testid="highcharts-maps-chart">{children}</div>;
  },
  MapsSeries: ({
    options,
  }: {
    options?: Highcharts.SeriesMapOptions & { nullInteraction?: boolean };
  }) => {
    capturedMap.seriesOptions = options;
    return <div data-testid="highcharts-map-series" />;
  },
}));

describe("resume | travel-map | map | WorldMap", () => {
  const originalFetch = window.fetch;

  afterEach(() => {
    window.fetch = originalFetch;
  });

  it("shows loading spinner until topology loads", () => {
    window.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    renderWithHydratedAtoms(<WorldMap />);

    expect(
      screen.getByRole("status", { name: "Loading page content" }),
    ).toBeInTheDocument();
  });

  it("renders the map after topology loads", async () => {
    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ type: "Topology" }),
    });

    renderWithHydratedAtoms(<WorldMap />);

    await waitFor(() => {
      expect(screen.getByTestId("highcharts-maps-chart")).toBeInTheDocument();
    });
    expect(
      screen.getByText(`Travel Map: ${numCountries} Countries Visited`),
    ).toBeInTheDocument();
  });

  it("shows error message when topology fetch fails", async () => {
    window.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    renderWithHydratedAtoms(<WorldMap />);

    await waitFor(() => {
      expect(
        screen.getByText(
          new RegExp(
            `Map failed to load\\. ${numCountries} Countries Visited\\.`,
          ),
        ),
      ).toBeInTheDocument();
    });
  });

  it("colors unvisited countries red and labels them not visited", async () => {
    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ type: "Topology" }),
    });

    renderWithHydratedAtoms(<WorldMap />);

    await waitFor(() => {
      expect(screen.getByTestId("highcharts-map-series")).toBeInTheDocument();
    });

    expect(capturedMap.seriesOptions?.nullColor).toBe(blue[900]);
    expect(capturedMap.seriesOptions?.nullInteraction).toBe(true);

    const formatter = capturedMap.chartOptions?.tooltip?.formatter;
    expect(formatter).toEqual(expect.any(Function));

    const unvisited = formatter?.call(
      {
        isNull: true,
        color: blue[900],
        name: "Tanzania",
        series: { name: "Visited" },
      } as unknown as Highcharts.Point,
      {} as Highcharts.Tooltip,
    );
    expect(unvisited).toContain("Not Visited");
    expect(unvisited).toContain("Tanzania");
    expect(unvisited).not.toContain("undefined");

    const visited = formatter?.call(
      {
        isNull: false,
        color: green[500],
        name: "Japan",
        flag: "🇯🇵",
        series: { name: "Visited" },
      } as unknown as Highcharts.Point,
      {} as Highcharts.Tooltip,
    );
    expect(visited).toContain("Visited");
    expect(visited).toContain("Japan: 🇯🇵");
    expect(visited).not.toContain("Not Visited");
  });

  it("renders title in dark mode", async () => {
    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ type: "Topology" }),
    });

    renderWithHydratedAtoms(<WorldMap />, [[themeAtom, darkTheme] as const]);

    await waitFor(() => {
      expect(
        screen.getByText(`Travel Map: ${numCountries} Countries Visited`),
      ).toBeInTheDocument();
    });
  });
});
