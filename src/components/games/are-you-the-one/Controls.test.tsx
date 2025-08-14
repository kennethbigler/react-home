import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Controls from "./Controls";

// Mock the constants
vi.mock("../../../constants/ayto", () => ({
  seasons: ["Season 1", "Season 2", "Season 3"],
  aytoSeasons: [
    {
      ladies: ["Lady1", "Lady2"],
      gents: ["Gent1", "Gent2"],
    },
    {
      ladies: ["Lady3", "Lady4"],
      gents: ["Gent3", "Gent4"],
    },
    {
      ladies: ["Lady5", "Lady6"],
      gents: ["Gent5", "Gent6"],
    },
  ],
}));

// Mock the jotai state module
vi.mock("../../../jotai/are-you-the-one-state", () => ({
  aytoSeasonState: {
    init: 0,
    subscribe: vi.fn(),
    get: vi.fn(() => 0),
    set: vi.fn(),
  },
  RoundPairing: {},
}));

// Mock the useAtom hook
const mockSetSeason = vi.fn();
vi.mock("jotai", () => ({
  useAtom: vi.fn(() => [0, mockSetSeason]),
}));

describe("Controls", () => {
  const defaultProps = {
    options: ["Matchup 1", "Matchup 2", "Truth Booth"],
    ri: 0,
    roundPairings: [
      { score: 8, pairs: [0, 1, 2, 3] },
      { score: 6, pairs: [0, 1, 2, 3] },
      { score: 10, pairs: [0, 1, 2, 3] },
    ],
    onBlackout: vi.fn(),
    onSelect: vi.fn(),
    updateScore: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render season selector", () => {
    render(<Controls {...defaultProps} />);

    expect(screen.getByLabelText("Season")).toBeInTheDocument();
    expect(screen.getByText("Season 1")).toBeInTheDocument();
  });

  it("should render matchup selector", () => {
    render(<Controls {...defaultProps} />);

    expect(screen.getByLabelText("Matchup")).toBeInTheDocument();
    expect(screen.getByText("Matchup 1")).toBeInTheDocument();
  });

  it("should render blackout button for non-TB rounds", () => {
    render(<Controls {...defaultProps} />);

    expect(screen.getByText("Blackout")).toBeInTheDocument();
  });

  it("should not render blackout button for Truth Booth", () => {
    render(<Controls {...defaultProps} ri={2} />);

    expect(screen.queryByText("Blackout")).not.toBeInTheDocument();
  });

  it("should render score controls for non-TB rounds", () => {
    render(<Controls {...defaultProps} />);

    expect(screen.getByText("Score: 8")).toBeInTheDocument();
    expect(screen.getByLabelText("decrement score")).toBeInTheDocument();
    expect(screen.getByLabelText("increment score")).toBeInTheDocument();
  });

  it("should not render score controls for Truth Booth", () => {
    render(<Controls {...defaultProps} ri={2} />);

    expect(screen.queryByText(/Score:/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText("decrement score")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("increment score")).not.toBeInTheDocument();
  });

  it("should handle season selection", () => {
    render(<Controls {...defaultProps} />);

    const seasonSelect = screen.getByLabelText("Season");
    fireEvent.mouseDown(seasonSelect);

    const season2Option = screen.getByText("Season 2");
    fireEvent.click(season2Option);

    // The mock should have been called with the new value
    expect(mockSetSeason).toHaveBeenCalledWith(1);
  });

  it("should handle matchup selection", () => {
    render(<Controls {...defaultProps} />);

    const matchupSelect = screen.getByLabelText("Matchup");
    fireEvent.mouseDown(matchupSelect);

    const matchup2Option = screen.getByText("Matchup 2");
    fireEvent.click(matchup2Option);

    expect(defaultProps.onSelect).toHaveBeenCalledWith(1);
  });

  it("should handle blackout button click", () => {
    render(<Controls {...defaultProps} />);

    const blackoutButton = screen.getByText("Blackout");
    fireEvent.click(blackoutButton);

    expect(defaultProps.onBlackout).toHaveBeenCalledWith([0, 1, 2, 3]);
  });

  it("should handle score increment", () => {
    render(<Controls {...defaultProps} />);

    const incrementButton = screen.getByLabelText("increment score");
    fireEvent.click(incrementButton);

    expect(defaultProps.updateScore).toHaveBeenCalledWith(9);
  });

  it("should handle score decrement", () => {
    render(<Controls {...defaultProps} />);

    const decrementButton = screen.getByLabelText("decrement score");
    fireEvent.click(decrementButton);

    expect(defaultProps.updateScore).toHaveBeenCalledWith(7);
  });

  it("should handle NaN score gracefully", () => {
    const propsWithNaNScore = {
      ...defaultProps,
      roundPairings: [
        { score: NaN, pairs: [0, 1, 2, 3] },
        { score: 6, pairs: [0, 1, 2, 3] },
        { score: 10, pairs: [0, 1, 2, 3] },
      ],
    };

    render(<Controls {...propsWithNaNScore} />);

    expect(screen.getByText("Score: -1")).toBeInTheDocument();
  });

  it("should handle undefined score gracefully", () => {
    const propsWithUndefinedScore = {
      ...defaultProps,
      roundPairings: [
        { score: undefined as unknown as number, pairs: [0, 1, 2, 3] },
        { score: 6, pairs: [0, 1, 2, 3] },
        { score: 10, pairs: [0, 1, 2, 3] },
      ],
    };

    render(<Controls {...propsWithUndefinedScore} />);

    expect(screen.getByText("Score: -1")).toBeInTheDocument();
  });

  it("should handle last non-TB round correctly", () => {
    render(<Controls {...defaultProps} ri={1} />);

    expect(screen.getByText("Blackout")).toBeInTheDocument();
    expect(screen.getByText("Score: 6")).toBeInTheDocument();
  });

  it("should handle empty options array", () => {
    render(<Controls {...defaultProps} options={[]} />);

    expect(screen.getByLabelText("Matchup")).toBeInTheDocument();
    expect(screen.queryByText("Blackout")).not.toBeInTheDocument();
  });

  it("should handle empty roundPairings array", () => {
    render(<Controls {...defaultProps} roundPairings={[]} />);

    expect(screen.getByText("Score: -1")).toBeInTheDocument();
  });
});
