import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Tracker from "./Tracker";
import type { BotCPlayer } from "../../../../jotai/botc-atom";
import * as useBotCHooks from "../useBotC";

// Mock the useTracker hook
const mockRoundNotes = [
  "",
  "Round 1 notes",
  "Round 2 notes",
  "",
  "",
  "",
  "",
  "",
];
const mockTracker = [
  [0, 0, 0, 0, 0, 0, 0, 0], // Round 0
  [1, 0, 2, 0, 1, 0, 0, 0], // Round 1
  [0, 1, 0, 2, 0, 1, 0, 0], // Round 2
  [0, 0, 0, 0, 0, 0, 0, 0], // Round 3
  [0, 0, 0, 0, 0, 0, 0, 0], // Round 4
  [0, 0, 0, 0, 0, 0, 0, 0], // Round 5
  [0, 0, 0, 0, 0, 0, 0, 0], // Round 6
  [0, 0, 0, 0, 0, 0, 0, 0], // Round 7
];

const mockBotcPlayers: BotCPlayer[] = [
  {
    name: "Player1",
    roles: [],
    notes: "",
    liar: false,
    used: false,
    exec: false,
    kill: false,
  },
  {
    name: "Player2",
    roles: [],
    notes: "",
    liar: false,
    used: false,
    exec: false,
    kill: false,
  },
  {
    name: "Player3",
    roles: [],
    notes: "",
    liar: false,
    used: false,
    exec: false,
    kill: false,
  },
  {
    name: "Player4",
    roles: [],
    notes: "",
    liar: false,
    used: false,
    exec: false,
    kill: false,
  },
  {
    name: "Player5",
    roles: [],
    notes: "",
    liar: false,
    used: false,
    exec: false,
    kill: false,
  },
  {
    name: "Player6",
    roles: [],
    notes: "",
    liar: false,
    used: false,
    exec: false,
    kill: false,
  },
  {
    name: "Player7",
    roles: [],
    notes: "",
    liar: false,
    used: false,
    exec: false,
    kill: false,
  },
  {
    name: "Player8",
    roles: [],
    notes: "",
    liar: false,
    used: false,
    exec: false,
    kill: false,
  },
];

// Mock the useTracker hook
vi.mock("../useBotC", () => ({
  useTracker: vi.fn(() => ({
    botcPlayers: mockBotcPlayers,
    round: 0,
    roundNotes: mockRoundNotes,
    tracker: mockTracker,
    onNotesChange: vi.fn(),
    onRoundClick: vi.fn(() => () => vi.fn()),
    onTrackClick: vi.fn(() => () => vi.fn()),
  })),
}));

// Mock the botcHelpers
vi.mock("../botcHelpers", () => ({
  getGridSize: vi.fn((pc: number, i: number) => {
    if (i < 3 || (pc % 2 === 0 && i >= pc - 3)) {
      return 4;
    } else if (pc % 2 === 1 && i >= pc - 2) {
      return 6;
    }
    return 5;
  }),
}));

describe("Tracker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the notes text field", () => {
    render(<Tracker end={8} />);

    const notesField = screen.getByLabelText("Notes");
    expect(notesField).toBeInTheDocument();
    expect(notesField).toHaveAttribute("value", "");
  });

  it("should display current round notes in the text field", () => {
    vi.mocked(useBotCHooks.useTracker).mockReturnValue({
      botcPlayers: mockBotcPlayers,
      round: 1,
      roundNotes: mockRoundNotes,
      tracker: mockTracker,
      onNotesChange: vi.fn(),
      onRoundClick: vi.fn(() => () => vi.fn()),
      onTrackClick: vi.fn(() => () => vi.fn()),
    });

    render(<Tracker end={8} />);

    const notesField = screen.getByLabelText("Notes");
    expect(notesField).toHaveAttribute("value", "Round 1 notes");
  });

  it("should render player buttons for the specified number of players", () => {
    render(<Tracker end={5} />);

    expect(screen.getByText("Player1")).toBeInTheDocument();
    expect(screen.getByText("Player2")).toBeInTheDocument();
    expect(screen.getByText("Player3")).toBeInTheDocument();
    expect(screen.getByText("Player4")).toBeInTheDocument();
    expect(screen.getByText("Player5")).toBeInTheDocument();
    expect(screen.queryByText("Player6")).not.toBeInTheDocument();
  });

  it("should render all players when end equals total players", () => {
    render(<Tracker end={8} />);

    for (let i = 1; i <= 8; i++) {
      expect(screen.getByText(`Player${i}`)).toBeInTheDocument();
    }
  });

  it("should apply correct button variants based on tracker values", () => {
    vi.mocked(useBotCHooks.useTracker).mockReturnValue({
      botcPlayers: mockBotcPlayers,
      round: 1,
      roundNotes: mockRoundNotes,
      tracker: mockTracker,
      onNotesChange: vi.fn(),
      onRoundClick: vi.fn(() => () => vi.fn()),
      onTrackClick: vi.fn(() => () => vi.fn()),
    });

    render(<Tracker end={8} />);

    // Player1: tracker[1][0] = 1 (contained, primary)
    const player1Button = screen.getByText("Player1");
    expect(player1Button).toHaveClass("MuiButton-contained");
    expect(player1Button).toHaveClass("MuiButton-colorPrimary");

    // Player3: tracker[1][2] = 2 (contained, error)
    const player3Button = screen.getByText("Player3");
    expect(player3Button).toHaveClass("MuiButton-contained");
    expect(player3Button).toHaveClass("MuiButton-colorError");

    // Player2: tracker[1][1] = 0 (outlined, primary)
    const player2Button = screen.getByText("Player2");
    expect(player2Button).toHaveClass("MuiButton-outlined");
    expect(player2Button).toHaveClass("MuiButton-colorPrimary");
  });

  it("should render round selection buttons", () => {
    render(<Tracker end={8} />);

    // Should render buttons for rounds 1-8
    for (let i = 1; i <= 8; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it("should highlight the current round button", () => {
    vi.mocked(useBotCHooks.useTracker).mockReturnValue({
      botcPlayers: mockBotcPlayers,
      round: 2,
      roundNotes: mockRoundNotes,
      tracker: mockTracker,
      onNotesChange: vi.fn(),
      onRoundClick: vi.fn(() => () => vi.fn()),
      onTrackClick: vi.fn(() => () => vi.fn()),
    });

    render(<Tracker end={8} />);

    // Round 3 button should be contained (current round)
    const round3Button = screen.getByText("3");
    expect(round3Button).toHaveClass("MuiButton-contained");

    // Other round buttons should be outlined
    const round1Button = screen.getByText("1");
    expect(round1Button).toHaveClass("MuiButton-outlined");
  });

  it("should call onNotesChange when notes field is modified", () => {
    const mockOnNotesChange = vi.fn();
    vi.mocked(useBotCHooks.useTracker).mockReturnValue({
      botcPlayers: mockBotcPlayers,
      round: 0,
      roundNotes: mockRoundNotes,
      tracker: mockTracker,
      onNotesChange: mockOnNotesChange,
      onRoundClick: vi.fn(() => () => vi.fn()),
      onTrackClick: vi.fn(() => () => vi.fn()),
    });

    render(<Tracker end={8} />);

    const notesField = screen.getByLabelText("Notes");
    fireEvent.change(notesField, { target: { value: "New notes" } });

    expect(mockOnNotesChange).toHaveBeenCalled();
  });

  it("should call onRoundClick when round buttons are clicked", () => {
    const mockOnRoundClick = vi.fn(() => () => vi.fn());
    vi.mocked(useBotCHooks.useTracker).mockReturnValue({
      botcPlayers: mockBotcPlayers,
      round: 0,
      roundNotes: mockRoundNotes,
      tracker: mockTracker,
      onNotesChange: vi.fn(),
      onRoundClick: mockOnRoundClick,
      onTrackClick: vi.fn(() => () => vi.fn()),
    });

    render(<Tracker end={8} />);

    const round5Button = screen.getByText("5");
    fireEvent.click(round5Button);

    expect(mockOnRoundClick).toHaveBeenCalledWith(4); // 0-indexed, so round 5 is index 4
  });

  it("should call onTrackClick when player buttons are clicked", () => {
    const mockOnTrackClick = vi.fn(() => () => vi.fn());
    vi.mocked(useBotCHooks.useTracker).mockReturnValue({
      botcPlayers: mockBotcPlayers,
      round: 0,
      roundNotes: mockRoundNotes,
      tracker: mockTracker,
      onNotesChange: vi.fn(),
      onRoundClick: vi.fn(() => () => vi.fn()),
      onTrackClick: mockOnTrackClick,
    });

    render(<Tracker end={8} />);

    const player3Button = screen.getByText("Player3");
    fireEvent.click(player3Button);

    expect(mockOnTrackClick).toHaveBeenCalledWith(2); // 0-indexed, so Player3 is index 2
  });

  it("should handle edge case with minimum players", () => {
    render(<Tracker end={5} />);

    // Should only render 5 players
    expect(screen.getByText("Player1")).toBeInTheDocument();
    expect(screen.getByText("Player5")).toBeInTheDocument();
    expect(screen.queryByText("Player6")).not.toBeInTheDocument();
  });

  it("should handle edge case with maximum players", () => {
    render(<Tracker end={8} />);

    // Should render all 8 players
    for (let i = 1; i <= 8; i++) {
      expect(screen.getByText(`Player${i}`)).toBeInTheDocument();
    }
  });

  it("should render notes field with correct MUI props", () => {
    render(<Tracker end={8} />);

    const notesField = screen.getByLabelText("Notes");
    // Check that the TextField is rendered with the correct classes
    expect(notesField).toHaveClass("MuiInputBase-input");
    expect(notesField).toHaveClass("MuiInput-input");
  });

  it("should render round buttons with correct accessibility label", () => {
    render(<Tracker end={8} />);

    const buttonGroup = screen.getByLabelText("Pick Round");
    expect(buttonGroup).toBeInTheDocument();
    expect(buttonGroup).toHaveClass("MuiButtonGroup-root");
  });

  it("should handle empty round notes gracefully", () => {
    const emptyRoundNotes = ["", "", "", "", "", "", "", ""];
    vi.mocked(useBotCHooks.useTracker).mockReturnValue({
      botcPlayers: mockBotcPlayers,
      round: 0,
      roundNotes: emptyRoundNotes,
      tracker: mockTracker,
      onNotesChange: vi.fn(),
      onRoundClick: vi.fn(() => () => vi.fn()),
      onTrackClick: vi.fn(() => () => vi.fn()),
    });

    render(<Tracker end={8} />);

    const notesField = screen.getByLabelText("Notes");
    expect(notesField).toHaveAttribute("value", "");
  });

  it("should handle tracker values correctly for button styling", () => {
    // Test all three tracker states: 0, 1, 2
    const testTracker = [
      [0, 1, 2, 0, 1, 2, 0, 1], // Round 0 with all states
    ];

    vi.mocked(useBotCHooks.useTracker).mockReturnValue({
      botcPlayers: mockBotcPlayers,
      round: 0,
      roundNotes: mockRoundNotes,
      tracker: testTracker,
      onNotesChange: vi.fn(),
      onRoundClick: vi.fn(() => () => vi.fn()),
      onTrackClick: vi.fn(() => () => vi.fn()),
    });

    render(<Tracker end={8} />);

    // Player1: tracker[0][0] = 0 (outlined, primary)
    const player1Button = screen.getByText("Player1");
    expect(player1Button).toHaveClass("MuiButton-outlined");
    expect(player1Button).toHaveClass("MuiButton-colorPrimary");

    // Player2: tracker[0][1] = 1 (contained, primary)
    const player2Button = screen.getByText("Player2");
    expect(player2Button).toHaveClass("MuiButton-contained");
    expect(player2Button).toHaveClass("MuiButton-colorPrimary");

    // Player3: tracker[0][2] = 2 (contained, error)
    const player3Button = screen.getByText("Player3");
    expect(player3Button).toHaveClass("MuiButton-contained");
    expect(player3Button).toHaveClass("MuiButton-colorError");
  });
});
