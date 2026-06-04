import { render, screen } from "@testing-library/react";
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

describe("resume | travel-map | TravelMap", () => {
  it("renders as expected", () => {
    const windowFetch = window.fetch;
    window.fetch = vi
      .fn()
      .mockImplementation(() => Promise.resolve({ ok: true, json: {} }));

    // render
    render(<TravelMap />);
    // Verify World Map
    expect(
      screen.getByRole("status", { name: "Loading page content" }),
    ).toBeInTheDocument();
    // Verify Travel Table
    expect(screen.getByText("The Americas")).toBeInTheDocument();
    expect(screen.getByText("Europe & Africa")).toBeInTheDocument();
    expect(screen.getByText("Asia & Australia")).toBeInTheDocument();
    // Verify chart placeholders rendered
    expect(screen.getByTestId("travel-days-graph")).toBeInTheDocument();
    expect(screen.getByTestId("cruise-sankey-graph")).toBeInTheDocument();
    expect(screen.getByTestId("loyalty-charts")).toBeInTheDocument();
    // Verify Cruise Table
    expect(screen.getByText("Ship 🚢")).toBeInTheDocument();

    window.fetch = windowFetch;
  });
});
