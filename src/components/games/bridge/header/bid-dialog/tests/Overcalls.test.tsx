import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Overcalls from "../Overcalls";

// Wrap in table for valid HTML structure
const renderInTable = (component: React.ReactNode) => {
  return render(<table>{component}</table>);
};

describe("games | bridge | Overcalls", () => {
  it("renders overcalls section header", () => {
    renderInTable(<Overcalls />);

    expect(
      screen.getByRole("heading", { name: /^overcalls$/i }),
    ).toBeInTheDocument();
  });

  it("renders responding to overcalls header", () => {
    renderInTable(<Overcalls />);

    expect(
      screen.getByRole("heading", { name: /responding to overcalls/i }),
    ).toBeInTheDocument();
  });

  it("renders No Fear Bridge cheat sheet header", () => {
    renderInTable(<Overcalls />);

    expect(
      screen.getByRole("heading", { name: /no fear bridge cheat sheet/i }),
    ).toBeInTheDocument();
    // The subtitle contains the full text
    expect(
      screen.getByText(/american style 5 card majors/i),
    ).toBeInTheDocument();
  });

  it("renders takeout double guidance", () => {
    renderInTable(<Overcalls />);

    // Takeout and Double appear in same cell, check for both
    const takeoutText = screen.getAllByText(/takeout/i);
    expect(takeoutText.length).toBeGreaterThanOrEqual(1);

    const doubleText = screen.getAllByText(/double/i);
    expect(doubleText.length).toBeGreaterThanOrEqual(1);

    // 12-15 range for takeout double
    const range1215 = screen.getAllByText("12-15");
    expect(range1215.length).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByText(/with opening strength & good shape/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/4441, 5440/i)).toBeInTheDocument();
  });

  it("renders responding to takeout double point ranges", () => {
    renderInTable(<Overcalls />);

    // Point ranges appear multiple times throughout the table
    const range610 = screen.getAllByText("6-10");
    expect(range610.length).toBeGreaterThanOrEqual(1);

    // Check for the specific guidance text
    const stoppersText = screen.getAllByText(/stopper in opponent's suit/i);
    expect(stoppersText.length).toBeGreaterThanOrEqual(1);
  });

  it("renders Stayman convention section", () => {
    renderInTable(<Overcalls />);

    expect(
      screen.getByRole("heading", { name: /stayman.*nt response/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/bid 2♣️ to check for major suit fit/i),
    ).toBeInTheDocument();
  });

  it("renders Stayman responses", () => {
    renderInTable(<Overcalls />);

    expect(screen.getByText(/= no 4 card major/i)).toBeInTheDocument();
    expect(screen.getByText(/= 4 ❤️s/i)).toBeInTheDocument();
    expect(screen.getByText(/= 4 ♠️s/i)).toBeInTheDocument();
  });

  it("renders simple overcall guidance", () => {
    renderInTable(<Overcalls />);

    // Simple and Overcall appear multiple times
    const simpleText = screen.getAllByText(/simple/i);
    expect(simpleText.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("8-15 HCP")).toBeInTheDocument();
    expect(screen.getByText(/must be a 5 card suit/i)).toBeInTheDocument();
  });

  it("renders red suit transfers section", () => {
    renderInTable(<Overcalls />);

    expect(
      screen.getByRole("heading", { name: /red suit transfers/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/bid ♦️ for ❤️, bid ❤️ for ♠️/i),
    ).toBeInTheDocument();
  });

  it("renders transfer guidance details", () => {
    renderInTable(<Overcalls />);

    expect(
      screen.getByText(/nt bidder must bid next suit/i),
    ).toBeInTheDocument();
    // Use getAllByText since PASS text appears multiple times
    const passTexts = screen.getAllByText(/pass/i);
    expect(passTexts.length).toBeGreaterThanOrEqual(1);
  });

  it("renders jump overcall guidance", () => {
    renderInTable(<Overcalls />);

    // Jump appears multiple times
    const jumpTexts = screen.getAllByText(/jump/i);
    expect(jumpTexts.length).toBeGreaterThanOrEqual(1);

    // Check for specific point range
    const range510 = screen.getAllByText("5-10");
    expect(range510.length).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByText(/a 6 card suit containing 2 honors/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/a 7 card suit with 2 honors/i),
    ).toBeInTheDocument();
  });

  it("renders Gerber convention section", () => {
    renderInTable(<Overcalls />);

    expect(
      screen.getByRole("heading", { name: /gerber.*nt response/i }),
    ).toBeInTheDocument();
    // 4♣️ appears multiple times, use getAllByText
    const fourClubTexts = screen.getAllByText(/4♣️/);
    expect(fourClubTexts.length).toBeGreaterThanOrEqual(1);

    // Check for the Gerber aces response - may be split across elements
    expect(
      screen.getByText(/4♦️=0 or 4, 4❤️=1, 4♠️=2, 4nt=3/i),
    ).toBeInTheDocument();
  });

  it("renders Gerber kings response", () => {
    renderInTable(<Overcalls />);

    // 5♣️ appears multiple times, use getAllByText
    const fiveClubTexts = screen.getAllByText(/5♣️/);
    expect(fiveClubTexts.length).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByText(/5♦️=0 or 4, 5❤️=1, 5♠️=2, 5nt=3/i),
    ).toBeInTheDocument();
  });

  it("renders pre-emptive overcall guidance", () => {
    renderInTable(<Overcalls />);

    // Pre-emptive appears multiple times
    const preemptiveTexts = screen.getAllByText(/pre-/i);
    expect(preemptiveTexts.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/jump 2 levels/i)).toBeInTheDocument();
    expect(
      screen.getByText(/use with caution if vulnerable/i),
    ).toBeInTheDocument();
  });

  it("renders Blackwood convention section", () => {
    renderInTable(<Overcalls />);

    expect(
      screen.getByRole("heading", { name: /blackwood.*4nt/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/5♣️=0 or 4, 5♦️=1, 5❤️=2, 5♠️=3/i),
    ).toBeInTheDocument();
  });

  it("renders Blackwood kings response", () => {
    renderInTable(<Overcalls />);

    expect(
      screen.getByText(/6♣️=0 or 4, 6♦️=1, 6❤️=2, 6♠️=3/i),
    ).toBeInTheDocument();
  });

  it("renders strong overcall guidance", () => {
    renderInTable(<Overcalls />);

    // Strong appears multiple times
    const strongTexts = screen.getAllByText(/strong/i);
    expect(strongTexts.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("15-18")).toBeInTheDocument();
    expect(
      screen.getByText(/1nt - balanced hand w\/ stopper in opponent's suit/i),
    ).toBeInTheDocument();
  });

  it("renders 19+ point guidance", () => {
    renderInTable(<Overcalls />);

    // 19+ appears multiple times
    const range19plus = screen.getAllByText("19+");
    expect(range19plus.length).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByText(/balanced hand, double, then rebid nt at lowest level/i),
    ).toBeInTheDocument();
  });

  it("renders double of 1NT guidance", () => {
    renderInTable(<Overcalls />);

    // "Double of 1NT" appears in a specific pattern
    const doubleOf1NTTexts = screen.getAllByText(/of 1nt/i);
    expect(doubleOf1NTTexts.length).toBeGreaterThanOrEqual(1);

    // 16+ appears multiple times
    const range16plus = screen.getAllByText("16+");
    expect(range16plus.length).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByText(/this is always a penalty double/i),
    ).toBeInTheDocument();
  });

  it("renders responding to double of 1NT", () => {
    renderInTable(<Overcalls />);

    expect(screen.getByText("0-4")).toBeInTheDocument();
    expect(
      screen.getByText(/if very unbalanced, bid your longest suit/i),
    ).toBeInTheDocument();
    // 5+ appears multiple times
    const range5plus = screen.getAllByText("5+");
    expect(range5plus.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/generally pass/i)).toBeInTheDocument();
  });

  it("renders do not ask for Kings warning", () => {
    renderInTable(<Overcalls />);

    expect(
      screen.getByText(/do not ask for kings unless you know/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/you have the strength for a grand slam/i),
    ).toBeInTheDocument();
  });

  it("has proper displayName", () => {
    expect(Overcalls.displayName).toBe("Overcalls");
  });
});
