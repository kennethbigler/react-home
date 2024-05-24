import { screen } from "@testing-library/react";
import TravelMap from "../TravelMap";
import render from "../../../../recoil-test-render";

describe("resume | travel-map | TravelMap", () => {
  it("renders as expected", () => {
    const windowFetch = window.fetch;
    window.fetch = vi
      .fn()
      .mockImplementation(() => Promise.resolve({ ok: true, json: {} }));

    // render
    render(<TravelMap />);
    // Verify World Map
    expect(screen.getByText("Loading World Map...")).toBeInTheDocument();
    // Verify Travel Table
    expect(screen.getByText("The Americas")).toBeInTheDocument();
    expect(screen.getByText("Europe & Africa")).toBeInTheDocument();
    expect(screen.getByText("Asia & Australia")).toBeInTheDocument();
    expect(screen.getByText("Bahamas 🇧🇸")).toBeInTheDocument();
    // Verify Sankey Graph
    expect(screen.getByText("Magic")).toBeInTheDocument();
    // Verify Table
    expect(screen.getByText("Ship 🚢")).toBeInTheDocument();

    window.fetch = windowFetch;
  });
});
