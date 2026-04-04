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
    const hcpMatches = screen.getAllByText(/15/);
    expect(hcpMatches.length).toBeGreaterThanOrEqual(1);
  });

  it("renders HCP text field", () => {
    renderHandInput();
    expect(screen.getByLabelText("HCP value")).toBeInTheDocument();
  });

  it("renders HCP slider", () => {
    renderHandInput();
    expect(screen.getByTestId("hcp-slider")).toBeInTheDocument();
  });

  it("renders all four suit decrease/increase buttons", () => {
    renderHandInput();
    expect(
      screen.getByRole("button", { name: "Decrease Spades" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Decrease Hearts" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Decrease Diamonds" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Decrease Clubs" }),
    ).toBeInTheDocument();
  });

  it("displays current suit counts", () => {
    renderHandInput();
    expect(screen.getByLabelText("Spades count")).toHaveTextContent("4");
    expect(screen.getByLabelText("Hearts count")).toHaveTextContent("3");
    expect(screen.getByLabelText("Clubs count")).toHaveTextContent("3");
    expect(screen.getByLabelText("Diamonds count")).toHaveTextContent("3");
  });

  it("shows total points (TP) calculated from HCP", () => {
    renderHandInput();
    expect(screen.getByText("Total Points (TP):")).toBeInTheDocument();
    const tpMatches = screen.getAllByText(/15/);
    expect(tpMatches.length).toBeGreaterThanOrEqual(1);
  });

  it("shows cards/13 count", () => {
    renderHandInput();
    expect(screen.getAllByText(/13\/13/).length).toBeGreaterThanOrEqual(1);
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

  it("calls onChange with incremented spades when Increase Spades clicked", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    fireEvent.click(screen.getByRole("button", { name: "Increase Spades" }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ spades: 5 }),
    );
  });

  it("calls onChange with decremented spades when Decrease Spades clicked", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    fireEvent.click(screen.getByRole("button", { name: "Decrease Spades" }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ spades: 3 }),
    );
  });

  it("calls onChange with incremented hearts when Increase Hearts clicked", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    fireEvent.click(screen.getByRole("button", { name: "Increase Hearts" }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ hearts: 4 }),
    );
  });

  it("calls onChange with incremented diamonds when Increase Diamonds clicked", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    fireEvent.click(screen.getByRole("button", { name: "Increase Diamonds" }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ diamonds: 4 }),
    );
  });

  it("calls onChange with incremented clubs when Increase Clubs clicked", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    fireEvent.click(screen.getByRole("button", { name: "Increase Clubs" }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ clubs: 4 }),
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

  it("Decrease button is disabled when suit count is 0", () => {
    renderHandInput({
      ...defaultHand,
      spades: 0,
      hearts: 6,
      diamonds: 4,
      clubs: 3,
    });
    const decreaseBtn = screen.getByRole("button", { name: "Decrease Spades" });
    expect(decreaseBtn).toBeDisabled();
  });

  it("Increase button is disabled when suit count is at max (13 - others)", () => {
    // All cards in spades: 13 spades, 0 in other suits → maxForSuit=13, plus btn disabled
    renderHandInput({
      ...defaultHand,
      spades: 13,
      hearts: 0,
      diamonds: 0,
      clubs: 0,
    });
    const increaseBtn = screen.getByRole("button", { name: "Increase Spades" });
    expect(increaseBtn).toBeDisabled();
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
    const byContent = (text: string) =>
      screen.getAllByText((_, el) => (el?.textContent ?? "").includes(text));
    expect(byContent("♠").length).toBeGreaterThanOrEqual(1);
    expect(byContent("♥").length).toBeGreaterThanOrEqual(1);
    expect(byContent("♦").length).toBeGreaterThanOrEqual(1);
    expect(byContent("♣").length).toBeGreaterThanOrEqual(1);
  });

  it("renders suits in ♠♥♣♦ order (spades first, diamonds last)", () => {
    renderHandInput();
    // Check decrease buttons appear in the correct suit order
    const decreaseBtns = screen.getAllByRole("button", {
      name: /Decrease (Spades|Hearts|Clubs|Diamonds)/,
    });
    const suitOrder = decreaseBtns.map((btn) =>
      btn.getAttribute("aria-label")?.replace("Decrease ", ""),
    );
    expect(suitOrder).toEqual(["Spades", "Hearts", "Clubs", "Diamonds"]);
  });

  it("does NOT show aces input by default", () => {
    renderHandInput();
    expect(screen.queryByLabelText("Aces count")).not.toBeInTheDocument();
  });

  it("does NOT show kings input by default", () => {
    renderHandInput();
    expect(screen.queryByLabelText("Kings count")).not.toBeInTheDocument();
  });

  it("shows aces input when showAcesInput=true", () => {
    render(
      <HandInput hand={defaultHand} onChange={vi.fn()} showAcesInput={true} />,
    );
    expect(screen.getByLabelText("Aces count")).toBeInTheDocument();
    expect(
      screen.getByText(/Partner bid 4NT \(Blackwood\)/),
    ).toBeInTheDocument();
  });

  it("shows kings input when showKingsInput=true", () => {
    render(
      <HandInput hand={defaultHand} onChange={vi.fn()} showKingsInput={true} />,
    );
    expect(screen.getByLabelText("Kings count")).toBeInTheDocument();
    expect(screen.getByText(/Partner bid 5NT/)).toBeInTheDocument();
  });

  it("calls onChange with aces value when aces input changes", () => {
    const onChange = vi.fn();
    render(
      <HandInput hand={defaultHand} onChange={onChange} showAcesInput={true} />,
    );
    const acesInput = screen.getByLabelText("Aces count");
    fireEvent.change(acesInput, { target: { value: "2" } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ aces: 2 }));
  });

  it("calls onChange with kings value when kings input changes", () => {
    const onChange = vi.fn();
    render(
      <HandInput
        hand={defaultHand}
        onChange={onChange}
        showKingsInput={true}
      />,
    );
    const kingsInput = screen.getByLabelText("Kings count");
    fireEvent.change(kingsInput, { target: { value: "1" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ kings: 1 }),
    );
  });

  it("clamps aces input to max 4", () => {
    const onChange = vi.fn();
    render(
      <HandInput hand={defaultHand} onChange={onChange} showAcesInput={true} />,
    );
    const acesInput = screen.getByLabelText("Aces count");
    fireEvent.change(acesInput, { target: { value: "6" } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ aces: 4 }));
  });

  it("clamps kings input to min 0", () => {
    const onChange = vi.fn();
    render(
      <HandInput
        hand={defaultHand}
        onChange={onChange}
        showKingsInput={true}
      />,
    );
    const kingsInput = screen.getByLabelText("Kings count");
    fireEvent.change(kingsInput, { target: { value: "-2" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ kings: 0 }),
    );
  });

  it("displays existing aces value from hand prop", () => {
    const handWithAces: Hand = {
      ...defaultHand,
      aces: 2,
    };
    render(
      <HandInput hand={handWithAces} onChange={vi.fn()} showAcesInput={true} />,
    );
    const acesInput = screen.getByLabelText("Aces count") as HTMLInputElement;
    expect(acesInput.value).toBe("2");
  });

  it("HCP slider onChange calls onChange handler", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    const allSliders = screen.getAllByRole("slider");
    const hcpSlider = allSliders.find(
      (s) => s.getAttribute("aria-valuemax") === "37",
    );
    expect(hcpSlider).toBeTruthy();
    hcpSlider!.focus();
    fireEvent.keyDown(hcpSlider!, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ hcp: 16 }));
  });

  it("does NOT show stopper input by default", () => {
    renderHandInput();
    expect(
      screen.queryByLabelText("Has stopper in opponent's suit"),
    ).not.toBeInTheDocument();
  });

  it("shows stopper checkbox when showStopperInput=true", () => {
    render(
      <HandInput
        hand={defaultHand}
        onChange={vi.fn()}
        showStopperInput={true}
        opponentSuitLabel="♠ spades"
      />,
    );
    expect(
      screen.getByLabelText("Has stopper in opponent's suit"),
    ).toBeInTheDocument();
  });

  it("stopper checkbox onChange calls onChange with updated stopper value", () => {
    const onChange = vi.fn();
    render(
      <HandInput
        hand={{ ...defaultHand, hasStopperInOpponentSuit: undefined }}
        onChange={onChange}
        showStopperInput={true}
        opponentSuitLabel="♠ spades"
      />,
    );
    const checkbox = screen.getByLabelText(
      "Has stopper in opponent's suit",
    ) as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ hasStopperInOpponentSuit: true }),
    );
  });

  it("stopper checkbox shows indeterminate state when value is undefined", () => {
    render(
      <HandInput
        hand={{ ...defaultHand, hasStopperInOpponentSuit: undefined }}
        onChange={vi.fn()}
        showStopperInput={true}
        opponentSuitLabel="♦ diamonds"
      />,
    );
    expect(screen.getByText(/Unknown.*please check/i)).toBeInTheDocument();
  });

  it("stopper checkbox shows checked when hand has stopper", () => {
    render(
      <HandInput
        hand={{ ...defaultHand, hasStopperInOpponentSuit: true }}
        onChange={vi.fn()}
        showStopperInput={true}
        opponentSuitLabel="♥ hearts"
      />,
    );
    const checkbox = screen.getByLabelText(
      "Has stopper in opponent's suit",
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it("stopper checkbox shows 'No stopper' label when hasStopperInOpponentSuit is false", () => {
    render(
      <HandInput
        hand={{ ...defaultHand, hasStopperInOpponentSuit: false }}
        onChange={vi.fn()}
        showStopperInput={true}
        opponentSuitLabel="♠ spades"
      />,
    );
    expect(screen.getByText(/No stopper in their suit/i)).toBeInTheDocument();
  });

  it("clamps aces count to 0 when input is empty (|| 0 fallback)", () => {
    const onChange = vi.fn();
    render(
      <HandInput
        hand={{ ...defaultHand, aces: 2 }}
        onChange={onChange}
        showAcesInput={true}
      />,
    );
    const acesInput = screen.getByLabelText("Aces count");
    fireEvent.change(acesInput, { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ aces: 0 }));
  });

  it("clamps kings count to 0 when input is empty (|| 0 fallback)", () => {
    const onChange = vi.fn();
    render(
      <HandInput
        hand={{ ...defaultHand, kings: 2 }}
        onChange={onChange}
        showKingsInput={true}
      />,
    );
    const kingsInput = screen.getByLabelText("Kings count");
    fireEvent.change(kingsInput, { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ kings: 0 }),
    );
  });
});
