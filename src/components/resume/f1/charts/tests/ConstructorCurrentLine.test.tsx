import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ConstructorCurrentSpline from "../ConstructorCurrentSpline";

describe("ConstructorCurrentSpline", () => {
  it("renders without crashing", () => {
    render(<ConstructorCurrentSpline color="#ffffff" />);
    expect(
      screen.getAllByText(/F1 \d{4} Constructors Points/)[0],
    ).toBeInTheDocument();
  });

  it("renders with custom color", () => {
    render(<ConstructorCurrentSpline color="#ff0000" />);
    expect(
      screen.getAllByText(/F1 \d{4} Constructors Points/)[0],
    ).toBeInTheDocument();
  });

  it("renders figure element", () => {
    const { container } = render(<ConstructorCurrentSpline color="#ffffff" />);
    expect(container.querySelector("figure")).toBeInTheDocument();
  });

  it("has correct display name", () => {
    expect(ConstructorCurrentSpline.displayName).toBe("Constructor Points");
  });

  it("memoizes the component", () => {
    const { rerender } = render(<ConstructorCurrentSpline color="#ffffff" />);
    rerender(<ConstructorCurrentSpline color="#ffffff" />);
    expect(
      screen.getAllByText(/F1 \d{4} Constructors Points/).length,
    ).toBeGreaterThan(0);
  });
});
