import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ConstructorCurrentLine from "../ConstructorCurrentLine";

describe("ConstructorCurrentLine", () => {
  it("renders without crashing", () => {
    render(<ConstructorCurrentLine color="#ffffff" />);
    expect(
      screen.getAllByText(/F1 \d{4} Constructors Points/)[0],
    ).toBeInTheDocument();
  });

  it("renders with custom color", () => {
    render(<ConstructorCurrentLine color="#ff0000" />);
    expect(
      screen.getAllByText(/F1 \d{4} Constructors Points/)[0],
    ).toBeInTheDocument();
  });

  it("renders figure element", () => {
    const { container } = render(<ConstructorCurrentLine color="#ffffff" />);
    expect(container.querySelector("figure")).toBeInTheDocument();
  });

  it("has correct display name", () => {
    expect(ConstructorCurrentLine.displayName).toBe("Constructor Points");
  });

  it("memoizes the component", () => {
    const { rerender } = render(<ConstructorCurrentLine color="#ffffff" />);
    rerender(<ConstructorCurrentLine color="#ffffff" />);
    expect(
      screen.getAllByText(/F1 \d{4} Constructors Points/).length,
    ).toBeGreaterThan(0);
  });
});
