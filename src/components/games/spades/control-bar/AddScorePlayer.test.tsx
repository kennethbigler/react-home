import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import AddScorePlayer from "./AddScorePlayer";

describe("games | spades | AddScorePlayer", () => {
  const defaultProps = {
    initial: "A",
    lastBid: 3,
    made: 3,
    setMade: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders player initial, bid, and current made value", () => {
    render(<AddScorePlayer {...defaultProps} made={5} />);
    expect(screen.getByText("A Bid: 3")).toBeInTheDocument();
    // The inner Made: div contains the number alongside buttons
    const makeDiv = screen.getByText(
      (_, el) =>
        el?.tagName === "DIV" && el.textContent?.startsWith("Made:") === true,
    );
    expect(makeDiv.textContent).toContain("5");
  });

  it("calls setMade with incremented value when increase is clicked", () => {
    const setMade = vi.fn();
    render(<AddScorePlayer {...defaultProps} made={3} setMade={setMade} />);
    fireEvent.click(screen.getByLabelText("increase"));
    expect(setMade).toHaveBeenCalledWith(4);
  });

  it("calls setMade with decremented value when decrease is clicked", () => {
    const setMade = vi.fn();
    render(<AddScorePlayer {...defaultProps} made={3} setMade={setMade} />);
    fireEvent.click(screen.getByLabelText("decrease"));
    expect(setMade).toHaveBeenCalledWith(2);
  });

  it("clamps made value at MIN_BID when decrease is clicked at minimum", () => {
    const setMade = vi.fn();
    render(<AddScorePlayer {...defaultProps} made={0} setMade={setMade} />);
    const decreaseBtn = screen.getByLabelText("decrease").closest("button");
    expect(decreaseBtn).toBeDisabled();
  });

  it("clamps made value at MAX_BID when increase is clicked at maximum", () => {
    const setMade = vi.fn();
    render(<AddScorePlayer {...defaultProps} made={13} setMade={setMade} />);
    const increaseBtn = screen.getByLabelText("increase").closest("button");
    expect(increaseBtn).toBeDisabled();
  });
});
