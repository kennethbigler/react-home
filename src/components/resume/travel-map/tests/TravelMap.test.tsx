import { render, screen, waitFor } from "@testing-library/react";
import TravelMap from "..";

// Mock the three Highcharts chart components — Highcharts in JSDOM exhausts the Node.js
// heap when multiple chart instances render simultaneously. TravelMap tests verify layout
// structure; chart rendering is tested in dedicated chart test files.
vi.mock("../TravelDaysGraph", () => ({
  default: () => <div data-testid="travel-days-graph" />,
}));
vi.mock("../cruises/CruiseSankeyGraph", () => ({
  default: () => <div data-testid="cruise-sankey-graph" />,
}));
vi.mock("../cruises/LoyaltyCharts", () => ({
  default: () => <div data-testid="loyalty-charts" />,
}));
vi.mock("../map/WorldMap", () => ({
  default: () => <div data-testid="world-map" />,
}));

describe("resume | travel-map | TravelMap", () => {
  it("renders as expected", async () => {
    render(<TravelMap />);

    // Verify Travel Table
    expect(screen.getByText("The Americas")).toBeInTheDocument();
    expect(screen.getByText("Europe & Africa")).toBeInTheDocument();
    expect(screen.getByText("Asia & Australia")).toBeInTheDocument();
    // Verify lazy chart placeholders rendered
    expect(await screen.findByTestId("travel-days-graph")).toBeInTheDocument();
    expect(screen.getByTestId("cruise-sankey-graph")).toBeInTheDocument();
    expect(screen.getByTestId("loyalty-charts")).toBeInTheDocument();
    expect(screen.getByTestId("world-map")).toBeInTheDocument();
    // Verify Cruise Table
    expect(screen.getByText("Ship 🚢")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByRole("status", { name: "Loading page content" }),
      ).not.toBeInTheDocument();
    });
  });
});
