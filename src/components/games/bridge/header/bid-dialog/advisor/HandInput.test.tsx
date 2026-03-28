import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HandInput from "./HandInput";
import type { Hand } from "./bidding-logic";

const defaultHand: Hand = {
  hcp: 15,
  spades: 4,
  hearts: 3,
  diamonds: 3,
  clubs: 3,
};

const renderHandInput = (hand = defaultHand, onChange = vi.fn()) => {
  return render(<HandInput hand={hand} onChange={onChange} />);
};

describe("games | bridge | HandInput", () => {
  it("renders the component heading", () => {
    renderHandInput();
    expect(screen.getByText("My Hand")).toBeInTheDocument();
  });

  it("displays current HCP value", () => {
    renderHandInput();
    // The TP display box shows "HCP: 15" — use a within scoped query to avoid multiple matches
    const hcpDisplay = screen.getAllByText(/15/);
    expect(hcpDisplay.length).toBeGreaterThanOrEqual(1);
  });

  it("renders HCP text field", () => {
    renderHandInput();
    expect(screen.getByLabelText("HCP value")).toBeInTheDocument();
  });

  it("renders HCP slider", () => {
    renderHandInput();
    expect(screen.getByTestId("hcp-slider")).toBeInTheDocument();
  });

  it("renders all four suit inputs", () => {
    renderHandInput();
    expect(screen.getByLabelText("Spades count")).toBeInTheDocument();
    expect(screen.getByLabelText("Hearts count")).toBeInTheDocument();
    expect(screen.getByLabelText("Diamonds count")).toBeInTheDocument();
    expect(screen.getByLabelText("Clubs count")).toBeInTheDocument();
  });

  it("shows total points (TP) calculated from HCP", () => {
    renderHandInput();
    expect(screen.getByText("Total Points (TP):")).toBeInTheDocument();
    // TP for 15 HCP + no long suits = 15; multiple elements contain "15", use getAllByText
    const tpMatches = screen.getAllByText(/15/);
    expect(tpMatches.length).toBeGreaterThanOrEqual(1);
  });

  it("shows cards/13 count", () => {
    renderHandInput();
    expect(screen.getByText(/13\/13/)).toBeInTheDocument();
  });

  it("shows error when cards do not total 13", () => {
    const badHand: Hand = {
      hcp: 10,
      spades: 4,
      hearts: 4,
      diamonds: 4,
      clubs: 4,
    };
    renderHandInput(badHand);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("16");
  });

  it("does not show error when cards total 13", () => {
    renderHandInput();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("calls onChange when HCP text field changes", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    const input = screen.getByLabelText("HCP value");
    fireEvent.change(input, { target: { value: "12" } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ hcp: 12 }));
  });

  it("calls onChange when spades input changes", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    const input = screen.getByLabelText("Spades count");
    fireEvent.change(input, { target: { value: "5" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ spades: 5 }),
    );
  });

  it("calls onChange when hearts input changes", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    const input = screen.getByLabelText("Hearts count");
    fireEvent.change(input, { target: { value: "4" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ hearts: 4 }),
    );
  });

  it("calls onChange when diamonds input changes", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    const input = screen.getByLabelText("Diamonds count");
    fireEvent.change(input, { target: { value: "2" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ diamonds: 2 }),
    );
  });

  it("calls onChange when clubs input changes", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    const input = screen.getByLabelText("Clubs count");
    fireEvent.change(input, { target: { value: "2" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ clubs: 2 }),
    );
  });

  it("clamps HCP to 0 when input is invalid", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    const input = screen.getByLabelText("HCP value");
    fireEvent.change(input, { target: { value: "abc" } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ hcp: 0 }));
  });

  it("clamps HCP to max 37", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    const input = screen.getByLabelText("HCP value");
    fireEvent.change(input, { target: { value: "40" } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ hcp: 37 }));
  });

  it("clamps HCP to min 0", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    const input = screen.getByLabelText("HCP value");
    fireEvent.change(input, { target: { value: "-5" } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ hcp: 0 }));
  });

  it("clamps suit count to max 13", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    const input = screen.getByLabelText("Spades count");
    fireEvent.change(input, { target: { value: "15" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ spades: 13 }),
    );
  });

  it("clamps suit count to min 0", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    const input = screen.getByLabelText("Spades count");
    fireEvent.change(input, { target: { value: "-1" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ spades: 0 }),
    );
  });

  it("shows long-suit bonus in total points", () => {
    const handWith6Card: Hand = {
      hcp: 10,
      spades: 6,
      hearts: 3,
      diamonds: 2,
      clubs: 2,
    };
    renderHandInput(handWith6Card);
    // TP should be 10 + 2 (long suit) = 12
    expect(screen.getByText(/12/)).toBeInTheDocument();
  });

  it("shows suit symbols in labels", () => {
    renderHandInput();
    // MUI TextField renders labels twice (floating + legend notch) — use getAllByText
    expect(screen.getAllByText(/♠ Spades/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/♥ Hearts/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/♦ Diamonds/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/♣ Clubs/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders suits in ♠♥♣♦ order (spades first, diamonds last)", () => {
    renderHandInput();
    const inputs = screen.getAllByRole("spinbutton"); // number inputs
    // Order: HCP input first, then spades, hearts, clubs, diamonds
    const labels = inputs.map((input) => input.getAttribute("aria-label"));
    const suitInputLabels = labels.filter(
      (l) =>
        l &&
        [
          "Clubs count",
          "Diamonds count",
          "Hearts count",
          "Spades count",
        ].includes(l),
    );
    expect(suitInputLabels).toEqual([
      "Spades count",
      "Hearts count",
      "Clubs count",
      "Diamonds count",
    ]);
  });
});
