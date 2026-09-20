import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DriverStandingsLine from "../DriverStandingsLine";

describe("resume | f1 | charts | DriverStandingsLine", () => {
  it("renders the drivers standings title", () => {
    render(<DriverStandingsLine color="#ffffff" />);
    expect(screen.getAllByText("F1 Drivers Standings")[0]).toBeInTheDocument();
  });

  it("renders a figure wrapper", () => {
    const { container } = render(<DriverStandingsLine color="#ff0000" />);
    expect(container.querySelector("figure")).toBeInTheDocument();
  });

  it("exposes the expected display name", () => {
    expect(DriverStandingsLine.displayName).toBe("Driver Standings");
  });
});
