import { render, screen } from "@testing-library/react";
import ScoreForm from "./ScoreForm";
import { vi } from "vitest";

describe("ScoreForm Component", () => {
  const defaultProps = {
    contractSuit: "NT",
    contractTricks: 1,
    declarerTricks: 7,
    isWe: true,
    isDouble: false,
    isRedouble: false,
    is4Honours: false,
    is5Honours: false,
    is4Aces: false,
    winner: "we" as const,
    madeBid: true,
    aboveTheLine: 40,
    belowTheLine: 0,
    onContractSuitChange: vi.fn(),
    onContractTricksChange: vi.fn(),
    onDeclarerTricksChange: vi.fn(),
    onBidWinnerToggle: vi.fn(),
    onRedoubleToggle: vi.fn(),
    onDoubleToggle: vi.fn(),
    on4AcesToggle: vi.fn(),
    on5HonoursToggle: vi.fn(),
    on4HonoursToggle: vi.fn(),
  };

  it("renders all form sections", () => {
    render(<ScoreForm {...defaultProps} />);

    expect(screen.getByText("Contract")).toBeInTheDocument();
    expect(screen.getByText("Honours")).toBeInTheDocument();
  });

  it("displays contract suit dropdown", () => {
    render(<ScoreForm {...defaultProps} />);

    expect(screen.getByLabelText("Contract Suit")).toBeInTheDocument();
  });

  it("displays contract tricks dropdown", () => {
    render(<ScoreForm {...defaultProps} />);

    expect(screen.getByLabelText("Contract Tricks")).toBeInTheDocument();
  });

  it("displays declarer tricks dropdown", () => {
    render(<ScoreForm {...defaultProps} />);

    expect(screen.getByLabelText("Declarer Team Tricks")).toBeInTheDocument();
  });

  it("shows 4 aces option for no trump", () => {
    render(<ScoreForm {...defaultProps} contractSuit="NT" />);

    expect(screen.getByText("4 Aces in 1 hand?")).toBeInTheDocument();
    expect(screen.queryByText("4 Honours in 1 hand?")).not.toBeInTheDocument();
  });

  it("shows 4/5 honours options for major suits", () => {
    render(<ScoreForm {...defaultProps} contractSuit="♥️" />);

    expect(screen.getByText("4 Honours in 1 hand?")).toBeInTheDocument();
    expect(screen.getByText("5 Honours in 1 hand?")).toBeInTheDocument();
    expect(screen.queryByText("4 Aces in 1 hand?")).not.toBeInTheDocument();
  });

  it("shows 4/5 honours options for minor suits", () => {
    render(<ScoreForm {...defaultProps} contractSuit="♣️" />);

    expect(screen.getByText("4 Honours in 1 hand?")).toBeInTheDocument();
    expect(screen.getByText("5 Honours in 1 hand?")).toBeInTheDocument();
    expect(screen.queryByText("4 Aces in 1 hand?")).not.toBeInTheDocument();
  });

  it("displays bid winner switch with 'We' label", () => {
    render(<ScoreForm {...defaultProps} isWe={true} />);
    expect(screen.getByText("We")).toBeInTheDocument();
  });

  it("displays bid winner switch with 'They' label", () => {
    render(<ScoreForm {...defaultProps} isWe={false} />);
    expect(screen.getByText("They")).toBeInTheDocument();
  });

  it("displays doubled and redoubled switches", () => {
    render(<ScoreForm {...defaultProps} />);

    expect(screen.getByText("Doubled?")).toBeInTheDocument();
    expect(screen.getByText("Redoubled?")).toBeInTheDocument();
  });

  it("displays bid winner selector", () => {
    render(<ScoreForm {...defaultProps} />);

    // Should show "Bid: " label and the current team
    expect(screen.getByText("Bid:")).toBeInTheDocument();
    expect(screen.getByText("We")).toBeInTheDocument();
  });

  it("renders with different contract tricks values", () => {
    render(<ScoreForm {...defaultProps} contractTricks={7} />);

    // The select should be rendered
    expect(screen.getByLabelText("Contract Tricks")).toBeInTheDocument();
  });

  it("renders with different declarer tricks values", () => {
    render(<ScoreForm {...defaultProps} declarerTricks={13} />);

    // The select should be rendered
    expect(screen.getByLabelText("Declarer Team Tricks")).toBeInTheDocument();
  });

  it("shows doubled switch", () => {
    render(<ScoreForm {...defaultProps} isDouble={true} />);

    const switches = screen.getAllByRole("switch", { name: /doubled/i });
    // One for "doubled" and possibly one for "redoubled" - check the correct one
    expect(switches.some((sw) => (sw as HTMLInputElement).checked)).toBe(true);
  });

  it("shows redoubled switch", () => {
    render(<ScoreForm {...defaultProps} isRedouble={true} />);

    expect(screen.getByRole("switch", { name: /redoubled/i })).toBeChecked();
  });

  it("shows 4 aces switch for no trump", () => {
    render(<ScoreForm {...defaultProps} contractSuit="NT" is4Aces={true} />);

    expect(screen.getByRole("switch", { name: /4 aces/i })).toBeChecked();
  });

  it("shows 4 honours switch for trump suits", () => {
    render(<ScoreForm {...defaultProps} contractSuit="♥️" is4Honours={true} />);

    expect(screen.getByRole("switch", { name: /4 honours/i })).toBeChecked();
  });

  it("shows 5 honours switch for trump suits", () => {
    render(<ScoreForm {...defaultProps} contractSuit="♠️" is5Honours={true} />);

    expect(screen.getByRole("switch", { name: /5 honours/i })).toBeChecked();
  });

  it("renders contract suit select with current value", () => {
    render(<ScoreForm {...defaultProps} contractSuit="♥️" />);

    const suitSelect = screen.getByRole("combobox", {
      name: /contract suit/i,
    });
    expect(suitSelect).toHaveTextContent("♥️");
  });

  it("renders bid winner label and current team", () => {
    render(<ScoreForm {...defaultProps} isWe={true} />);

    // Check the text label and team name are displayed
    expect(screen.getByText("Bid:")).toBeInTheDocument();
    expect(screen.getByText("We")).toBeInTheDocument();
  });

  it("renders doubled and redoubled switches", () => {
    render(<ScoreForm {...defaultProps} />);

    // Both switches should be present - use exact names to avoid regex overlap
    expect(
      screen.getByRole("switch", { name: "Doubled?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Redoubled?" }),
    ).toBeInTheDocument();
  });

  it("renders all dropdown options", () => {
    render(<ScoreForm {...defaultProps} />);

    // All three dropdowns should be present
    expect(screen.getByLabelText("Contract Suit")).toBeInTheDocument();
    expect(screen.getByLabelText("Contract Tricks")).toBeInTheDocument();
    expect(screen.getByLabelText("Declarer Team Tricks")).toBeInTheDocument();
  });

  it("does not show honours section when bid is not made", () => {
    render(<ScoreForm {...defaultProps} madeBid={false} />);

    expect(screen.queryByText("Honours")).not.toBeInTheDocument();
    expect(screen.queryByText("4 Aces in 1 hand?")).not.toBeInTheDocument();
    expect(screen.queryByText("4 Honours in 1 hand?")).not.toBeInTheDocument();
  });
});
