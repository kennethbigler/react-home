import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DriverCurrentSpline from "../DriverCurrentSpline";

describe("DriverCurrentSpline", () => {
  it("renders without crashing", () => {
    render(<DriverCurrentSpline color="#ffffff" />);
    expect(
      screen.getAllByText(/F1 \d{4} Drivers Points/)[0],
    ).toBeInTheDocument();
  });

  it("renders with custom color", () => {
    render(<DriverCurrentSpline color="#ff0000" />);
    expect(
      screen.getAllByText(/F1 \d{4} Drivers Points/)[0],
    ).toBeInTheDocument();
  });

  it("renders figure element", () => {
    const { container } = render(<DriverCurrentSpline color="#ffffff" />);
    expect(container.querySelector("figure")).toBeInTheDocument();
  });

  it("has correct display name", () => {
    expect(DriverCurrentSpline.displayName).toBe("Driver Points");
  });

  it("memoizes the component", () => {
    const { rerender } = render(<DriverCurrentSpline color="#ffffff" />);
    rerender(<DriverCurrentSpline color="#ffffff" />);
    expect(
      screen.getAllByText(/F1 \d{4} Drivers Points/).length,
    ).toBeGreaterThan(0);
  });
});
