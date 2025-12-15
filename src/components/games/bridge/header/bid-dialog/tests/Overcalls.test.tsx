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

  it("renders simple overcall guidance", () => {
    renderInTable(<Overcalls />);

    // Simple and Overcall appear multiple times
    const simpleText = screen.getAllByText(/simple/i);
    expect(simpleText.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("8-15 HCP")).toBeInTheDocument();
    expect(screen.getByText(/must be a 5 card suit/i)).toBeInTheDocument();
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

    // 19+ appears in the component
    const range19plus = screen.getAllByText("19+");
    expect(range19plus.length).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByText(/with balanced hand, first double/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/second rebid nt at lowest level/i),
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

  it("has proper displayName", () => {
    expect(Overcalls.displayName).toBe("Overcalls");
  });
});
