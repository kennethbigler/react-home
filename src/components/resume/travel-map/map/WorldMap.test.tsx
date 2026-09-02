import "../../../common/highcharts/tests/highchartsMocks";
import { screen, waitFor } from "@testing-library/react";
import { numCountries } from "@/constants/travel";
import themeAtom, { darkTheme } from "@/jotai/theme-atom";
import { renderWithHydratedAtoms } from "@/test-utils/renderWithHydratedAtoms";
import WorldMap from "./WorldMap";

vi.mock("@highcharts/react/Maps", () => ({
  MapsChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="highcharts-maps-chart">{children}</div>
  ),
  MapsSeries: () => <div data-testid="highcharts-map-series" />,
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
