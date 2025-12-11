import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import UnbalancedHands from "../UnbalancedHands";

// Wrap in table for valid HTML structure
const renderInTable = (component: React.ReactNode) => {
  return render(<table>{component}</table>);
};

describe("games | bridge | UnbalancedHands", () => {
  it("renders unbalanced hands section header", () => {
    renderInTable(<UnbalancedHands />);

    expect(screen.getByText(/unbalanced hands/i)).toBeInTheDocument();
    expect(
      screen.getByText(/points shown are total points/i),
    ).toBeInTheDocument();
  });

  it("renders opening bids of 1 of a suit section", () => {
    renderInTable(<UnbalancedHands />);

    expect(screen.getByText("13-21")).toBeInTheDocument();
    expect(
      screen.getByText(/opening bids of 1 of a suit/i),
    ).toBeInTheDocument();
  });

  it("renders guidance for 5 card or longer suits", () => {
    renderInTable(<UnbalancedHands />);

    expect(
      screen.getByText(/with a 5 card or longer suit/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/bid the longest suit/i)).toBeInTheDocument();
    expect(
      screen.getByText(/bid the higher ranking of suits of equal length/i),
    ).toBeInTheDocument();
  });

  it("renders guidance for no 5 card suit", () => {
    renderInTable(<UnbalancedHands />);

    expect(
      screen.getByText(/with no 5 card or longer suit/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/bid the longer minor/i)).toBeInTheDocument();
    expect(screen.getByText(/bid 1♦️ with 4 ♣️s & 4 ♦️s/i)).toBeInTheDocument();
    expect(screen.getByText(/bid 1♣️ with 3 ♣️s & 3 ♦️s/i)).toBeInTheDocument();
  });

  it("renders Rule of 20 guidance", () => {
    renderInTable(<UnbalancedHands />);

    // Rule of 20 appears multiple times, use getAllByText
    const rule20Texts = screen.getAllByText(/rule of 20/i);
    expect(rule20Texts.length).toBeGreaterThanOrEqual(1);

    // Use getAllByText for text that appears multiple times
    const with12Texts = screen.getAllByText(/with 12 total points/i);
    expect(with12Texts.length).toBeGreaterThanOrEqual(1);
  });

  it("renders responding bid point ranges for major suit support", () => {
    renderInTable(<UnbalancedHands />);

    // Point ranges appear multiple times, use getAllByText
    const range69 = screen.getAllByText("6-9");
    expect(range69.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/raise to 2 level/i)).toBeInTheDocument();

    const range1012 = screen.getAllByText("10-12");
    expect(range1012.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/raise to 3 level/i)).toBeInTheDocument();

    const range13plus = screen.getAllByText("13+");
    expect(range13plus.length).toBeGreaterThanOrEqual(1);
  });

  it("renders Weak 2 opening guidance", () => {
    renderInTable(<UnbalancedHands />);

    // "5-10 HCP" appears multiple times in various contexts
    const hcpTexts = screen.getAllByText(/5-10 hcp/i);
    expect(hcpTexts.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/weak 2/i)).toBeInTheDocument();
    expect(screen.getByText(/needs 6 card suit/i)).toBeInTheDocument();
  });

  it("renders pre-emptive response guidance", () => {
    renderInTable(<UnbalancedHands />);

    expect(screen.getByText(/raises are pre-emptive/i)).toBeInTheDocument();
    expect(screen.getByText(/not invitational/i)).toBeInTheDocument();
  });

  it("renders 2NT response guidance for Weak 2 opening", () => {
    renderInTable(<UnbalancedHands />);

    // 15+ appears multiple times
    const range15plus = screen.getAllByText("15+");
    expect(range15plus.length).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByText(/bid 2nt to find out more from partner/i),
    ).toBeInTheDocument();
  });

  it("renders response to 2NT inquiry", () => {
    renderInTable(<UnbalancedHands />);

    expect(screen.getByText("5-7")).toBeInTheDocument();
    expect(
      screen.getByText(/bid 3 of own suit with minimum hand/i),
    ).toBeInTheDocument();
    expect(screen.getByText("8-10")).toBeInTheDocument();
    expect(
      screen.getByText(/bid a suit containing an ace or king/i),
    ).toBeInTheDocument();
  });

  it("renders 2♣ opening bid guidance", () => {
    renderInTable(<UnbalancedHands />);

    expect(screen.getByText("22+")).toBeInTheDocument();
    expect(screen.getByText(/opening bid of 2♣/i)).toBeInTheDocument();
    expect(
      screen.getByText(/22\+ total points unbalanced/i),
    ).toBeInTheDocument();
  });

  it("renders 2♦ negative response guidance", () => {
    renderInTable(<UnbalancedHands />);

    expect(
      screen.getByText(/bid 2♦️ \(negative response\)/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/over 2♦️ bid 2nt with 22-24 balanced/i),
    ).toBeInTheDocument();
  });

  it("renders positive response guidance", () => {
    renderInTable(<UnbalancedHands />);

    // 8+ appears multiple times
    const range8plus = screen.getAllByText("8+");
    expect(range8plus.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/with any 1 ace & 1 king/i)).toBeInTheDocument();
    expect(screen.getByText(/positive response/i)).toBeInTheDocument();
  });

  it("renders pre-emptive 3 opening guidance", () => {
    renderInTable(<UnbalancedHands />);

    expect(
      screen.getByText(/pre-emptive opening bids of 3/i),
    ).toBeInTheDocument();
    // 7 card suit appears multiple times
    const sevenCardTexts = screen.getAllByText(/7 card suit/i);
    expect(sevenCardTexts.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/with 8 cards, open 4/i)).toBeInTheDocument();
  });

  it("renders responding to pre-emptive 3 opening", () => {
    renderInTable(<UnbalancedHands />);

    expect(screen.getByText("0-15")).toBeInTheDocument();
    expect(
      screen.getByText(/less than 3 card support, pass/i),
    ).toBeInTheDocument();
    // 16+ appears multiple times
    const range16plus = screen.getAllByText("16+");
    expect(range16plus.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/bid game in opener's suit/i)).toBeInTheDocument();
  });

  it("renders opener rebid guidance", () => {
    renderInTable(<UnbalancedHands />);

    expect(
      screen.getByText(/raise responder's major suit with a 4\+ cards/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/bid a new suit at the 1 level if possible/i),
    ).toBeInTheDocument();
  });

  it("renders point ranges for opener rebids", () => {
    renderInTable(<UnbalancedHands />);

    // These ranges appear multiple times, use getAllByText
    const range1315 = screen.getAllByText("13-15");
    expect(range1315.length).toBeGreaterThanOrEqual(1);

    const range1618 = screen.getAllByText("16-18");
    expect(range1618.length).toBeGreaterThanOrEqual(1);

    const range1921 = screen.getAllByText("19-21");
    expect(range1921.length).toBeGreaterThanOrEqual(1);
  });

  it("renders jump rebid guidance", () => {
    renderInTable(<UnbalancedHands />);

    expect(
      screen.getByText(/jump rebid own suit with 6\+ cards/i),
    ).toBeInTheDocument();
  });

  it("renders game forcing rebid guidance", () => {
    renderInTable(<UnbalancedHands />);

    expect(
      screen.getByText(/any other rebid is forcing to game/i),
    ).toBeInTheDocument();
  });

  it("has proper displayName", () => {
    expect(UnbalancedHands.displayName).toBe("UnbalancedHands");
  });
});
