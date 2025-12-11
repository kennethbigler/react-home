import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BalancedHands from "./BalancedHands";

// Wrap in table for valid HTML structure
const renderInTable = (component: React.ReactNode) => {
  return render(<table>{component}</table>);
};

describe("games | bridge | BalancedHands", () => {
  it("renders balanced hands section header", () => {
    renderInTable(<BalancedHands />);

    expect(screen.getByText(/balanced hands/i)).toBeInTheDocument();
    expect(screen.getByText(/points shown are hcp/i)).toBeInTheDocument();
  });

  it("renders main column headers", () => {
    renderInTable(<BalancedHands />);

    expect(
      screen.getByRole("heading", { name: /opening bids/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /responding bids/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /opener's rebids/i }),
    ).toBeInTheDocument();
  });

  it("renders 12-14 point range opening bid guidance", () => {
    renderInTable(<BalancedHands />);

    expect(screen.getByText("12-14")).toBeInTheDocument();
    expect(
      screen.getByText(/open 1 of a suit.*then rebid nt/i),
    ).toBeInTheDocument();
  });

  it("renders 15-17 point range (1NT opening) guidance", () => {
    renderInTable(<BalancedHands />);

    expect(screen.getByText("15-17")).toBeInTheDocument();
    expect(screen.getByText(/open 1nt/i)).toBeInTheDocument();
  });

  it("renders responding bid point ranges for 1NT opening", () => {
    renderInTable(<BalancedHands />);

    // Point ranges appear multiple times, use getAllByText
    const range07 = screen.getAllByText("0-7");
    expect(range07.length).toBeGreaterThanOrEqual(1);

    const range815 = screen.getAllByText("8-15");
    expect(range815.length).toBeGreaterThanOrEqual(1);

    const range1617 = screen.getAllByText("16-17");
    expect(range1617.length).toBeGreaterThanOrEqual(1);
  });

  it("renders Stayman convention guidance", () => {
    renderInTable(<BalancedHands />);

    // Use getAllByText since Stayman appears multiple times
    const staymanTexts = screen.getAllByText(/stayman/i);
    expect(staymanTexts.length).toBeGreaterThanOrEqual(1);

    const bid2cTexts = screen.getAllByText(/2♣️/);
    expect(bid2cTexts.length).toBeGreaterThanOrEqual(1);
  });

  it("renders transfer bid guidance", () => {
    renderInTable(<BalancedHands />);

    // Use getAllByText since transfer appears multiple times
    const transferTexts = screen.getAllByText(/transfer/i);
    expect(transferTexts.length).toBeGreaterThanOrEqual(1);
  });

  it("renders 18-19 point range guidance", () => {
    renderInTable(<BalancedHands />);

    expect(screen.getByText("18-19")).toBeInTheDocument();
    // Use getAllByText for common text patterns
    const openTexts = screen.getAllByText(/first open 1 of a suit/i);
    expect(openTexts.length).toBeGreaterThanOrEqual(1);
  });

  it("renders 20-21 point range (2NT opening) guidance", () => {
    renderInTable(<BalancedHands />);

    expect(screen.getByText("20-21")).toBeInTheDocument();
    expect(screen.getByText(/open 2nt/i)).toBeInTheDocument();
  });

  it("renders responding bid ranges for 2NT opening", () => {
    renderInTable(<BalancedHands />);

    expect(screen.getByText("0-3")).toBeInTheDocument();
    expect(screen.getByText("4-11")).toBeInTheDocument();
  });

  it("renders HCP explanation cell", () => {
    renderInTable(<BalancedHands />);

    // The HCP abbreviation appears multiple times, so just check the cell content
    const hcpCell = screen.getByText((content, element) => {
      return (
        element?.tagName === "TD" &&
        content.includes("High") &&
        element.textContent?.includes("Card") &&
        element.textContent?.includes("Points")
      );
    });
    expect(hcpCell).toBeInTheDocument();
  });

  it("renders invitational bid guidance", () => {
    renderInTable(<BalancedHands />);

    // Multiple invitational references, use getAllByText
    const invitationalTexts = screen.getAllByText(/invitational/i);
    expect(invitationalTexts.length).toBeGreaterThanOrEqual(1);
  });

  it("renders opener rebid guidance for balanced hands", () => {
    renderInTable(<BalancedHands />);

    expect(
      screen.getByText(/give a single raise with 4 card support/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/show a 4 card major at the 1 level/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/otherwise rebid nt at the lowest level/i),
    ).toBeInTheDocument();
  });

  it("renders pass guidance for 1NT response", () => {
    renderInTable(<BalancedHands />);

    expect(
      screen.getByText(/pass if the response was 1nt/i),
    ).toBeInTheDocument();
  });

  it("renders 17 point upgrade guidance", () => {
    renderInTable(<BalancedHands />);

    expect(
      screen.getByText(/raise 2nt to 3nt with 17 points/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/raise 4nt to 6nt with 17 points/i),
    ).toBeInTheDocument();
  });

  it("renders multiple table sections with proper structure", () => {
    renderInTable(<BalancedHands />);

    // Check for table head and body elements
    const tableHeaders = screen.getAllByRole("columnheader");
    expect(tableHeaders.length).toBeGreaterThan(0);

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(10);
  });

  it("has proper displayName", () => {
    expect(BalancedHands.displayName).toBe("BalancedHands");
  });
});
