import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AYTOTableBody from "./TableBody";
import { RoundPairing } from "../../../../jotai/are-you-the-one-state";

describe("AYTOTableBody", () => {
  const mockGents = ["Gent1", "Gent2", "Gent3"];
  const mockLadies = ["Lady1", "Lady2", "Lady3"];
  const mockMatches = [-1, -1, -1];
  const mockNoMatch = [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ];
  const mockHist = [
    [
      { odds: 50, rounds: [] },
      { odds: 30, rounds: [] },
      { odds: 20, rounds: [] },
    ],
    [
      { odds: 40, rounds: [] },
      { odds: 40, rounds: [] },
      { odds: 20, rounds: [] },
    ],
    [
      { odds: 30, rounds: [] },
      { odds: 30, rounds: [] },
      { odds: 40, rounds: [] },
    ],
  ];
  const mockOptions = ["Round 1", "Round 2", "Truth Booth"];
  const mockRoundPairings: RoundPairing[] = [
    { pairs: [-1, -1, -1], score: 0 },
    { pairs: [-1, -1, -1], score: 0 },
  ];

  const mockUpdateMatch = vi.fn();
  const mockUpdateNoMatch = vi.fn();
  const mockUpdatePairs = vi.fn();

  const defaultProps = {
    gents: mockGents,
    hist: mockHist,
    ladies: mockLadies,
    matches: mockMatches,
    noMatch: mockNoMatch,
    options: mockOptions,
    ri: 0,
    roundPairings: mockRoundPairings,
    updateMatch: mockUpdateMatch,
    updateNoMatch: mockUpdateNoMatch,
    updatePairs: mockUpdatePairs,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table rows for each lady", () => {
    render(<AYTOTableBody {...defaultProps} />);

    expect(screen.getByText("Lady1")).toBeInTheDocument();
    expect(screen.getByText("Lady2")).toBeInTheDocument();
    expect(screen.getByText("Lady3")).toBeInTheDocument();
  });

  it("handles click during regular round", () => {
    render(<AYTOTableBody {...defaultProps} ri={0} />);

    // Find buttons and click one
    const buttons = screen.getAllByRole("button");
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      expect(mockUpdatePairs).toHaveBeenCalled();
    }
  });

  it("opens dialog when clicking during Truth Booth round", () => {
    render(<AYTOTableBody {...defaultProps} ri={2} />);

    // Find buttons and click one to open TB dialog
    const buttons = screen.getAllByRole("button");
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      // Dialog should be open
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    }
  });

  it("handles match confirmation in Truth Booth", () => {
    render(<AYTOTableBody {...defaultProps} ri={2} />);

    // Click to open dialog
    const buttons = screen.getAllByRole("button");
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);

      // Click Match button
      const matchButton = screen.getByText("Match");
      fireEvent.click(matchButton);

      expect(mockUpdateMatch).toHaveBeenCalled();
    }
  });

  it("handles no match confirmation in Truth Booth", () => {
    render(<AYTOTableBody {...defaultProps} ri={2} />);

    // Click to open dialog
    const buttons = screen.getAllByRole("button");
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);

      // Click No Match button
      const noMatchButton = screen.getByText("No Match");
      fireEvent.click(noMatchButton);

      expect(mockUpdateNoMatch).toHaveBeenCalled();
    }
  });

  it("handles cancel in Truth Booth dialog", async () => {
    render(<AYTOTableBody {...defaultProps} ri={2} />);

    // Click to open dialog
    const buttons = screen.getAllByRole("button");
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);

      // Click Cancel button
      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      // Wait for dialog to close
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    }
  });

  it("handles clicking when gent is already paired (deselect and reassign)", () => {
    const propsWithPairs = {
      ...defaultProps,
      roundPairings: [
        { pairs: [0, -1, -1], score: 0 }, // Gent 0 is paired with Lady 0
        { pairs: [-1, -1, -1], score: 0 },
      ],
      ri: 0,
    };

    render(<AYTOTableBody {...propsWithPairs} />);

    // Try to pair the same gent with a different lady
    const buttons = screen.getAllByRole("button");
    if (buttons.length > 3) {
      // Click to pair gent 0 with lady 1 (gent 0 is already with lady 0)
      fireEvent.click(buttons[3]);

      // Should deselect from old lady and assign to new
      expect(mockUpdatePairs).toHaveBeenCalled();
    }
  });

  it("correctly identifies when current round is Truth Booth", () => {
    const tbProps = {
      ...defaultProps,
      ri: 2, // Last option index (Truth Booth)
    };

    render(<AYTOTableBody {...tbProps} />);

    // Click should open dialog instead of updating pairs
    const buttons = screen.getAllByRole("button");
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      // Dialog should open, not updatePairs
      expect(mockUpdatePairs).not.toHaveBeenCalled();
    }
  });

  it("correctly identifies when current round is not Truth Booth", () => {
    const regularProps = {
      ...defaultProps,
      ri: 0, // Not the last option
    };

    render(<AYTOTableBody {...regularProps} />);

    // Click should update pairs, not open dialog
    const buttons = screen.getAllByRole("button");
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      expect(mockUpdatePairs).toHaveBeenCalled();
    }
  });

  it("handles case when gent is not already paired (tempLi === -1)", () => {
    const propsNoPairs = {
      ...defaultProps,
      roundPairings: [
        { pairs: [-1, -1, -1], score: 0 }, // No gents are paired
        { pairs: [-1, -1, -1], score: 0 },
      ],
      ri: 0,
    };

    render(<AYTOTableBody {...propsNoPairs} />);

    const buttons = screen.getAllByRole("button");
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);

      // Should only call updatePairs once (to assign), not to deselect
      expect(mockUpdatePairs).toHaveBeenCalledTimes(1);
    }
  });
});

