import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ConstructorStandingsLine from "../ConstructorStandingsLine";

describe("resume | f1 | charts | ConstructorStandingsLine", () => {
  it("renders the constructors standings title", () => {
    render(<ConstructorStandingsLine color="#ffffff" />);
    expect(
      screen.getAllByText("F1 Constructors Standings")[0],
    ).toBeInTheDocument();
  });

  it("renders a figure wrapper", () => {
    const { container } = render(<ConstructorStandingsLine color="#ff0000" />);
    expect(container.querySelector("figure")).toBeInTheDocument();
  });

  it("exposes the expected display name", () => {
    expect(ConstructorStandingsLine.displayName).toBe("Constructor Standings");
  });
});
