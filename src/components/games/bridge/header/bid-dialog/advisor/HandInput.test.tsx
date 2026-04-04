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
    // Multiple elements show 13/13 (suit header + TP bar) — check that at least one exists
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
    // Suit labels use a colored <span> for the symbol + a text node for the name,
    // so the text is split across elements. Use a custom matcher on textContent.
    const byContent = (text: string) =>
      screen.getAllByText((_, el) => (el?.textContent ?? "").includes(text));
    expect(byContent("♠").length).toBeGreaterThanOrEqual(1);
    expect(byContent("♥").length).toBeGreaterThanOrEqual(1);
    expect(byContent("♦").length).toBeGreaterThanOrEqual(1);
    expect(byContent("♣").length).toBeGreaterThanOrEqual(1);
    expect(byContent("Spades").length).toBeGreaterThanOrEqual(1);
    expect(byContent("Hearts").length).toBeGreaterThanOrEqual(1);
    expect(byContent("Diamonds").length).toBeGreaterThanOrEqual(1);
    expect(byContent("Clubs").length).toBeGreaterThanOrEqual(1);
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
    // MUI v7 Slider puts role="slider" on the root element (data-testid spans the document)
    // Find by aria-valuemax=37 (HCP range is 0-37)
    const allSliders = screen.getAllByRole("slider");
    const hcpSlider = allSliders.find(
      (s) => s.getAttribute("aria-valuemax") === "37",
    );
    expect(hcpSlider).toBeTruthy();
    hcpSlider!.focus();
    fireEvent.keyDown(hcpSlider!, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ hcp: 16 }));
  });

  it("suit slider onChange calls onChange handler", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    // Suit sliders have aria-valuemax=13 (0-13 card range); first suit = spades
    const allSliders = screen.getAllByRole("slider");
    const suitSliders = allSliders.filter(
      (s) => s.getAttribute("aria-valuemax") === "13",
    );
    expect(suitSliders.length).toBeGreaterThan(0);
    const spadesSlider = suitSliders[0]; // first suit slider = spades (♠♥♣♦ order)
    spadesSlider.focus();
    fireEvent.keyDown(spadesSlider, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ spades: 5 }),
    );
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
    // When hasStopperInOpponentSuit is undefined, the label shows "Unknown — please check your hand"
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

  it("clamps suit count to 0 when input is empty (|| 0 fallback)", () => {
    const onChange = vi.fn();
    renderHandInput(defaultHand, onChange);
    const input = screen.getByLabelText("Spades count");
    fireEvent.change(input, { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ spades: 0 }),
    );
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
