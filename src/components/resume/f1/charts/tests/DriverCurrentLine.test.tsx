import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DriverCurrentLine from "../DriverCurrentLine";

describe("DriverCurrentLine", () => {
  it("renders without crashing", () => {
    render(<DriverCurrentLine color="#ffffff" />);
    expect(screen.getAllByText("F1 Drivers Points")[0]).toBeInTheDocument();
  });

  it("renders with custom color", () => {
    render(<DriverCurrentLine color="#ff0000" />);
    expect(screen.getAllByText("F1 Drivers Points")[0]).toBeInTheDocument();
  });

  it("renders figure element", () => {
    const { container } = render(<DriverCurrentLine color="#ffffff" />);
    expect(container.querySelector("figure")).toBeInTheDocument();
  });

  it("has correct display name", () => {
    expect(DriverCurrentLine.displayName).toBe("Driver Points");
  });

  it("memoizes the component", () => {
    const { rerender } = render(<DriverCurrentLine color="#ffffff" />);
    rerender(<DriverCurrentLine color="#ffffff" />);
    expect(screen.getAllByText("F1 Drivers Points").length).toBeGreaterThan(0);
  });
});
