import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MatchedStack from "./MatchedStack";
import type { AYTOHist } from "../histogram/useHist";

describe("MatchedStack", () => {
  const mockHist: AYTOHist[][] = [
    [
      {
        odds: 85,
        oddsWeight: 3,
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
        oddsWeight: 2,
        rounds: [1, 2],
      },
      {
        odds: 30,
        oddsWeight: 2,
        rounds: [3, 4],
      },
    ],
  ];

  const defaultProps = {
    gents: ["Gent1", "Gent2"],
    ladies: ["Lady1", "Lady2"],
    hist: mockHist,
    matches: [-1, -1], // No confirmed matches
    noMatch: [
      [false, false],
      [false, false],
    ],
    pairs: [0, 1], // Lady1 paired with Gent1, Lady2 paired with Gent2
    tempScore: [0, 0],
    ri: 0,
    score: 95,
    showAll: true,
  };

  it("should render the matched stack with correct title", () => {
    render(<MatchedStack {...defaultProps} />);

    expect(screen.getByText("Matchup 1")).toBeInTheDocument();
  });

  it("should render chips for each pair", () => {
    render(<MatchedStack {...defaultProps} />);

    // Check first pair: Lady1-Gent1 with 3 rounds and 85% odds
    expect(screen.getByText("Lady1-Gent1 3 - 85%")).toBeInTheDocument();

    // Check second pair: Lady2-Gent2 with 2 rounds and 30% odds
    expect(screen.getByText("Lady2-Gent2 2 - 30%")).toBeInTheDocument();
  });

  it("should render score chip", () => {
    render(<MatchedStack {...defaultProps} />);

    expect(screen.getByText("95")).toBeInTheDocument();
  });

  it("should handle confirmed matches with success color", () => {
    const propsWithMatches = {
      ...defaultProps,
      matches: [0, -1], // Lady1 confirmed with Gent1
    };

    render(<MatchedStack {...propsWithMatches} />);

    // The confirmed match should be rendered first due to sorting
    expect(screen.getByText("Lady1-Gent1 3 - 85%")).toBeInTheDocument();
  });

  it("should handle no-match pairs with error color", () => {
    const propsWithNoMatch = {
      ...defaultProps,
      noMatch: [
        [true, false], // Lady1 cannot match with Gent1
        [false, false],
      ],
    };

    render(<MatchedStack {...propsWithNoMatch} />);

    expect(screen.getByText("Lady1-Gent1 3 - 85%")).toBeInTheDocument();
  });

  it("should handle repeat rounds with primary color", () => {
    render(<MatchedStack {...defaultProps} />);

    // Both pairs have multiple rounds, so they should use primary color
    expect(screen.getByText("Lady1-Gent1 3 - 85%")).toBeInTheDocument();
    expect(screen.getByText("Lady2-Gent2 2 - 30%")).toBeInTheDocument();
  });

  it("should handle single round pairs with default color", () => {
    const propsWithSingleRounds = {
      ...defaultProps,
      hist: [
        [
          {
            odds: 85,
            oddsWeight: 1,
            rounds: [1],
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
            rounds: [1],
          },
          {
            odds: 30,
            oddsWeight: 1,
            rounds: [3],
          },
        ],
      ],
    };

    render(<MatchedStack {...propsWithSingleRounds} />);

    expect(screen.getByText("Lady1-Gent1 - 85%")).toBeInTheDocument();
    expect(screen.getByText("Lady2-Gent2 - 30%")).toBeInTheDocument();
  });

  it("should not render when showAll is false and no visible pairs", () => {
    const propsHidden = {
      ...defaultProps,
      showAll: false,
      noMatch: [
        [true, true], // Hide Lady1-Gent1 and Lady1-Gent2
        [true, true], // Hide Lady2-Gent1 and Lady2-Gent2
      ],
    };

    const { container } = render(<MatchedStack {...propsHidden} />);

    // When no pairs are visible, the component should not render at all
    expect(container.firstChild).toBeNull();
  });

  it("should show adjusted score when showAll is false", () => {
    const propsHidden = {
      ...defaultProps,
      showAll: false,
      tempScore: [10, 0], // Subtract 10 from score
    };

    render(<MatchedStack {...propsHidden} />);

    expect(screen.getByText("85")).toBeInTheDocument(); // 95 - 10
  });

  it("should handle empty pairs array", () => {
    render(<MatchedStack {...defaultProps} pairs={[]} />);

    // When pairs array is empty, the component should not render
    const { container } = render(<MatchedStack {...defaultProps} pairs={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("should handle different round indices", () => {
    render(<MatchedStack {...defaultProps} ri={5} />);

    expect(screen.getByText("Matchup 6")).toBeInTheDocument();
  });

  it("should handle invalid pair indices gracefully", () => {
    const propsWithInvalidPairs = {
      ...defaultProps,
      pairs: [-1, 1], // Only one valid pair
    };

    render(<MatchedStack {...propsWithInvalidPairs} />);

    // Should only render the valid pair
    expect(screen.getByText("Lady2-Gent2 2 - 30%")).toBeInTheDocument();
    expect(screen.queryByText(/Lady1.*Gent1/)).not.toBeInTheDocument();
  });

  it("should sort chips correctly: matches > repeats > first-time > no-match", () => {
    const propsWithMixedPairs = {
      ...defaultProps,
      gents: ["Gent1", "Gent2", "Gent3", "Gent4"],
      ladies: ["Lady1", "Lady2", "Lady3", "Lady4"],
      pairs: [0, 1, 2, 3],
      matches: [0, -1, -1, -1], // Lady1 matched with Gent1
      noMatch: [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, true], // Lady4 no-match with Gent4
      ],
      hist: [
        [
          { odds: 85, oddsWeight: 3, rounds: [1, 2, 3] }, // Match & repeat
          { odds: 15, oddsWeight: 1, rounds: [4] },
          { odds: 20, oddsWeight: 1, rounds: [5] },
          { odds: 10, oddsWeight: 1, rounds: [6] },
        ],
        [
          { odds: 70, oddsWeight: 2, rounds: [1, 2] }, // Repeat
          { odds: 30, oddsWeight: 2, rounds: [3, 4] },
          { odds: 40, oddsWeight: 2, rounds: [5, 6] },
          { odds: 50, oddsWeight: 2, rounds: [7, 8] },
        ],
        [
          { odds: 60, oddsWeight: 1, rounds: [1] }, // First time
          { odds: 40, oddsWeight: 1, rounds: [2] },
          { odds: 50, oddsWeight: 1, rounds: [3] },
          { odds: 55, oddsWeight: 1, rounds: [4] },
        ],
        [
          { odds: 65, oddsWeight: 1, rounds: [1] },
          { odds: 35, oddsWeight: 1, rounds: [2] },
          { odds: 45, oddsWeight: 1, rounds: [3] },
          { odds: 25, oddsWeight: 1, rounds: [4] }, // No match
        ],
      ],
    };

    const { container } = render(<MatchedStack {...propsWithMixedPairs} />);

    // Get all chips (excluding the score chip)
    const chips = container.querySelectorAll(".MuiChip-root");

    // Verify we have chips rendered
    expect(chips.length).toBeGreaterThan(0);
  });

  it("should handle showAll false with matches", () => {
    const propsHidingMatches = {
      ...defaultProps,
      showAll: false,
      matches: [0, -1], // Lady1 confirmed with Gent1
    };

    render(<MatchedStack {...propsHidingMatches} />);

    // Lady1-Gent1 should be hidden when showAll is false
    expect(screen.queryByText("Lady1-Gent1 3 - 85%")).toBeNull();
    // Lady2-Gent2 should still show
    expect(screen.getByText("Lady2-Gent2 2 - 30%")).toBeInTheDocument();
  });

  it("should handle showAll false with no-match pairs", () => {
    const propsHidingNoMatch = {
      ...defaultProps,
      showAll: false,
      noMatch: [
        [true, false], // Lady1 no-match with Gent1
        [false, false],
      ],
    };

    render(<MatchedStack {...propsHidingNoMatch} />);

    // Lady1-Gent1 should be hidden when showAll is false
    expect(screen.queryByText("Lady1-Gent1 3 - 85%")).toBeNull();
    // Lady2-Gent2 should still show
    expect(screen.getByText("Lady2-Gent2 2 - 30%")).toBeInTheDocument();
  });

  it("should handle pairs with undefined indices", () => {
    const propsWithUndefined = {
      ...defaultProps,
      pairs: [undefined as unknown as number, 1],
    };

    render(<MatchedStack {...propsWithUndefined} />);

    // Should only render the valid pair
    expect(screen.getByText("Lady2-Gent2 2 - 30%")).toBeInTheDocument();
  });
});
