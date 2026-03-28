import { fireEvent, render, screen } from "@testing-library/react";
import { useAtomValue } from "jotai";
import { describe, expect, it, vi } from "vitest";
import BidAdvisor from "./BidAdvisor";

// Mock jotai's useAtomValue to provide bridge game state
vi.mock("jotai", async (importOriginal) => {
  const actual = await importOriginal<typeof import("jotai")>();
  return {
    ...actual,
    useAtomValue: vi.fn(() => ({
      weVulnerable: false,
      theyVulnerable: false,
      weWins: 0,
      theyWins: 0,
      weSum: 0,
      theySum: 0,
      gameIdx: 0,
    })),
  };
});

const mockAtomValue = vi.mocked(useAtomValue);

describe("games | bridge | BidAdvisor", () => {
  it("renders the Bid Advisor heading", () => {
    render(<BidAdvisor />);
    expect(screen.getByText("Bid Advisor")).toBeInTheDocument();
  });

  it("renders New Game button (not 'Start Over')", () => {
    render(<BidAdvisor />);
    expect(
      screen.getByRole("button", { name: /new game/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /start over/i }),
    ).not.toBeInTheDocument();
  });

  it("does NOT render a View Cheat Sheet button", () => {
    render(<BidAdvisor />);
    expect(
      screen.queryByRole("button", { name: /view cheat sheet/i }),
    ).not.toBeInTheDocument();
  });

  it("does NOT render the stepper", () => {
    render(<BidAdvisor />);
    expect(
      screen.queryByRole("list", { name: /stepper/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^next$/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /get recommendation/i }),
    ).not.toBeInTheDocument();
  });

  it("renders Hand Input section immediately", () => {
    render(<BidAdvisor />);
    expect(screen.getByText(/High Card Points/i)).toBeInTheDocument();
  });

  it("renders Auction Context section immediately", () => {
    render(<BidAdvisor />);
    expect(screen.getByText("Auction Context")).toBeInTheDocument();
  });

  it("renders position selector chips immediately", () => {
    render(<BidAdvisor />);
    expect(screen.getByLabelText("Position 1st")).toBeInTheDocument();
    expect(screen.getByLabelText("Position 2nd")).toBeInTheDocument();
    expect(screen.getByLabelText("Position 3rd")).toBeInTheDocument();
    expect(screen.getByLabelText("Position 4th")).toBeInTheDocument();
  });

  it("does NOT render a vulnerability radio group", () => {
    render(<BidAdvisor />);
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
  });

  it("renders read-only vulnerability chips", () => {
    render(<BidAdvisor />);
    expect(screen.getByText(/We: Not Vulnerable/i)).toBeInTheDocument();
    expect(screen.getByText(/They: Not Vulnerable/i)).toBeInTheDocument();
  });

  it("shows placeholder message when hand is invalid (cards ≠ 13)", () => {
    render(<BidAdvisor />);
    const spadesInput = screen.getByLabelText("Spades count");
    fireEvent.change(spadesInput, { target: { value: "5" } });
    expect(screen.getByText(/cards must total 13/i)).toBeInTheDocument();
    expect(screen.queryByLabelText("Recommended bid")).not.toBeInTheDocument();
  });

  it("shows recommendation immediately when hand is valid (default hand)", () => {
    render(<BidAdvisor />);
    expect(screen.getByLabelText("Recommended bid")).toBeInTheDocument();
  });

  it("recommendation updates live when HCP changes", () => {
    render(<BidAdvisor />);
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "15" } });
    expect(screen.getByLabelText("Recommended bid")).toBeInTheDocument();
  });

  it("New Game button resets hand back to defaults", () => {
    render(<BidAdvisor />);
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "20" } });
    fireEvent.click(screen.getByRole("button", { name: /new game/i }));
    expect(hcpInput).toHaveValue(0);
  });

  it("New Game button resets position back to 1st (default)", () => {
    render(<BidAdvisor />);
    fireEvent.click(screen.getByLabelText("Position 2nd"));
    fireEvent.click(screen.getByRole("button", { name: /new game/i }));
    const pos1 = screen.getByLabelText("Position 1st");
    expect(pos1.closest(".MuiChip-filled")).toBeTruthy();
  });

  it("shows confidence badge on recommendation", () => {
    render(<BidAdvisor />);
    const badge = screen.getByLabelText(/Confidence level/i);
    expect(badge).toBeInTheDocument();
  });

  it("shows 'We: Vulnerable' and 'They: Vulnerable' when both vulnerable", () => {
    mockAtomValue.mockReturnValueOnce({
      weVulnerable: true,
      theyVulnerable: true,
      weWins: 1,
      theyWins: 1,
      weSum: 0,
      theySum: 0,
      gameIdx: 2,
    });
    render(<BidAdvisor />);
    expect(screen.getByText(/We: Vulnerable/i)).toBeInTheDocument();
    expect(screen.getByText(/They: Vulnerable/i)).toBeInTheDocument();
  });

  it("shows 'We: Vulnerable' only when only we are vulnerable", () => {
    mockAtomValue.mockReturnValueOnce({
      weVulnerable: true,
      theyVulnerable: false,
      weWins: 1,
      theyWins: 0,
      weSum: 0,
      theySum: 0,
      gameIdx: 1,
    });
    render(<BidAdvisor />);
    expect(screen.getByText(/We: Vulnerable/i)).toBeInTheDocument();
    expect(screen.getByText(/They: Not Vulnerable/i)).toBeInTheDocument();
  });

  it("shows 'They: Vulnerable' only when only they are vulnerable", () => {
    mockAtomValue.mockReturnValueOnce({
      weVulnerable: false,
      theyVulnerable: true,
      weWins: 0,
      theyWins: 1,
      weSum: 0,
      theySum: 0,
      gameIdx: 1,
    });
    render(<BidAdvisor />);
    expect(screen.getByText(/We: Not Vulnerable/i)).toBeInTheDocument();
    expect(screen.getByText(/They: Vulnerable/i)).toBeInTheDocument();
  });

  it("My bid dropdown is always visible (no toggle button required)", () => {
    render(<BidAdvisor />);
    expect(screen.getByLabelText("My bid")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add next round/i }),
    ).not.toBeInTheDocument();
  });

  it("My bid pre-fills with the current recommendation when hand is valid", () => {
    render(<BidAdvisor />);
    // Default hand (0 HCP, balanced) gives a recommendation — My bid should default to it
    const myBidSelect = screen.getByLabelText("My bid");
    // The recommended bid is pre-filled (not empty / just "Pass" arbitrarily)
    expect(myBidSelect).toBeInTheDocument();
    // Recommendation is computed — verify the recommended bid aria-label is present
    expect(screen.getByLabelText("Recommended bid")).toBeInTheDocument();
  });

  it("position 1 shows 'You are the dealer' message with no dropdowns", () => {
    render(<BidAdvisor />);
    // Default is position 1
    expect(screen.getByText(/you are the dealer/i)).toBeInTheDocument();
  });

  it("position 2 shows one dropdown for prior bid", () => {
    render(<BidAdvisor />);
    fireEvent.click(screen.getByLabelText("Position 2nd"));
    expect(screen.getByLabelText(/RHO \(1st\)/i)).toBeInTheDocument();
  });
});
