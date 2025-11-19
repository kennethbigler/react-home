import { render, screen } from "@testing-library/react";
import ScoreForm from "./ScoreForm";
import { vi } from "vitest";

describe("ScoreForm Component", () => {
  const defaultProps = {
    contractSuit: "nt",
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
    expect(screen.getByText("Score")).toBeInTheDocument();
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

  it("displays winner message when bid is made", () => {
    render(<ScoreForm {...defaultProps} madeBid={true} winner="we" />);

    expect(screen.getByText("Declarer (we) won the hand!")).toBeInTheDocument();
  });

  it("displays defender message when bid fails", () => {
    render(<ScoreForm {...defaultProps} madeBid={false} winner="they" />);

    expect(
      screen.getByText("Defender (they) successfully defended!"),
    ).toBeInTheDocument();
  });

  it("shows above the line score only when bid is made", () => {
    const { rerender } = render(
      <ScoreForm {...defaultProps} madeBid={true} aboveTheLine={40} />,
    );

    expect(screen.getByText("Above the line: 40")).toBeInTheDocument();

    rerender(<ScoreForm {...defaultProps} madeBid={false} aboveTheLine={0} />);
    expect(screen.queryByText(/Above the line/)).not.toBeInTheDocument();
  });

  it("always shows below the line score", () => {
    render(<ScoreForm {...defaultProps} belowTheLine={150} />);

    expect(screen.getByText("Below the line: 150")).toBeInTheDocument();
  });

  it("shows 4 aces option for no trump", () => {
    render(<ScoreForm {...defaultProps} contractSuit="nt" />);

    expect(screen.getByText("4 Aces in 1 hand?")).toBeInTheDocument();
    expect(screen.queryByText("4 Honours in 1 hand?")).not.toBeInTheDocument();
  });

  it("shows 4/5 honours options for major suits", () => {
    render(<ScoreForm {...defaultProps} contractSuit="major" />);

    expect(screen.getByText("4 Honours in 1 hand?")).toBeInTheDocument();
    expect(screen.getByText("5 Honours in 1 hand?")).toBeInTheDocument();
    expect(screen.queryByText("4 Aces in 1 hand?")).not.toBeInTheDocument();
  });

  it("shows 4/5 honours options for minor suits", () => {
    render(<ScoreForm {...defaultProps} contractSuit="minor" />);

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

  it("displays correct winner message for 'they' declarer win", () => {
    render(<ScoreForm {...defaultProps} madeBid={true} winner="they" />);

    expect(
      screen.getByText("Declarer (they) won the hand!"),
    ).toBeInTheDocument();
  });

  it("displays correct defender message for 'we' defense win", () => {
    render(<ScoreForm {...defaultProps} madeBid={false} winner="we" />);

    expect(
      screen.getByText("Defender (we) successfully defended!"),
    ).toBeInTheDocument();
  });

  it("displays question about bid winner", () => {
    render(<ScoreForm {...defaultProps} />);

    expect(screen.getByText("Who won the bid?")).toBeInTheDocument();
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
    expect(switches.some((sw) => sw.checked)).toBe(true);
  });

  it("shows redoubled switch", () => {
    render(<ScoreForm {...defaultProps} isRedouble={true} />);

    expect(screen.getByRole("switch", { name: /redoubled/i })).toBeChecked();
  });

  it("shows 4 aces switch for no trump", () => {
    render(<ScoreForm {...defaultProps} contractSuit="nt" is4Aces={true} />);

    expect(screen.getByRole("switch", { name: /4 aces/i })).toBeChecked();
  });

  it("shows 4 honours switch for trump suits", () => {
    render(
      <ScoreForm {...defaultProps} contractSuit="major" is4Honours={true} />,
    );

    expect(screen.getByRole("switch", { name: /4 honours/i })).toBeChecked();
  });

  it("shows 5 honours switch for trump suits", () => {
    render(
      <ScoreForm {...defaultProps} contractSuit="major" is5Honours={true} />,
    );

    expect(screen.getByRole("switch", { name: /5 honours/i })).toBeChecked();
  });
});
