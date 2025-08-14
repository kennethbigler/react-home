import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CalculatedStack from "./CalculatedStack";
import type { AYTOHist } from "../histogram/useHist";

describe("CalculatedStack", () => {
  const mockHist: AYTOHist[][] = [
    [
      {
        odds: 85,
        oddsWeight: 1,
        rounds: [1, 2, 3],
      },
      {
        odds: 15,
        oddsWeight: 1,
        rounds: [4],
      },
    ],
    [
      {
        odds: 70,
        oddsWeight: 1,
        rounds: [1, 2],
      },
      {
        odds: 30,
        oddsWeight: 1,
        rounds: [3, 4],
      },
    ],
  ];

  const defaultProps = {
    gents: ["Gent1", "Gent2"],
    ladies: ["Lady1", "Lady2"],
    hist: mockHist,
    pairs: [0, 1], // Lady1 paired with Gent1, Lady2 paired with Gent2
    cei: 2,
    score: 95,
  };

  it("should render the calculated stack with correct title", () => {
    render(<CalculatedStack {...defaultProps} />);

    expect(screen.getByText("Calculated 3")).toBeInTheDocument();
  });

  it("should render chips for each pair with correct labels", () => {
    render(<CalculatedStack {...defaultProps} />);

    // Check first pair: Lady1-Gent1 with 3 rounds and 85% odds
    expect(screen.getByText("Lady1-Gent1 3 - 85%")).toBeInTheDocument();

    // Check second pair: Lady2-Gent2 with 2 rounds and 30% odds
    expect(screen.getByText("Lady2-Gent2 2 - 30%")).toBeInTheDocument();
  });

  it("should render max score chip", () => {
    render(<CalculatedStack {...defaultProps} />);

    expect(screen.getByText("max 95")).toBeInTheDocument();
  });

  it("should handle different CEI values", () => {
    render(<CalculatedStack {...defaultProps} cei={5} />);

    expect(screen.getByText("Calculated 6")).toBeInTheDocument();
  });

  it("should handle different scores", () => {
    render(<CalculatedStack {...defaultProps} score={100} />);

    expect(screen.getByText("max 100")).toBeInTheDocument();
  });

  it("should handle empty pairs array", () => {
    render(<CalculatedStack {...defaultProps} pairs={[]} />);

    expect(screen.getByText("Calculated 3")).toBeInTheDocument();
    expect(screen.getByText("max 95")).toBeInTheDocument();
    // Should not render any pair chips
    expect(screen.queryByText(/Lady.*Gent/)).not.toBeInTheDocument();
  });

  it("should handle single pair", () => {
    render(
      <CalculatedStack
        {...defaultProps}
        pairs={[0]}
        ladies={["Lady1"]}
        gents={["Gent1"]}
        hist={[mockHist[0]]}
      />,
    );

    expect(screen.getByText("Lady1-Gent1 3 - 85%")).toBeInTheDocument();
    expect(screen.queryByText(/Lady2.*Gent2/)).not.toBeInTheDocument();
  });
});
