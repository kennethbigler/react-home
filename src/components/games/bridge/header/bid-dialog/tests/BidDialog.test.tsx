import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BidDialog from "../BidDialog";

describe("games | bridge | BidDialog", () => {
  it("renders bid dialog button", () => {
    render(<BidDialog />);

    // InfoPopup should create a button with the title
    expect(screen.getByRole("button", { name: /bid/i })).toBeInTheDocument();
  });

  it("opens dialog when button is clicked", async () => {
    render(<BidDialog />);

    // Open the dialog
    fireEvent.click(screen.getByRole("button", { name: /bid/i }));

    await waitFor(() => {
      // Check that the dialog is open with the title
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /bid/i, level: 2 }),
      ).toBeInTheDocument();
    });
  });

  it("displays BiddingTable content when opened", async () => {
    render(<BidDialog />);

    fireEvent.click(screen.getByRole("button", { name: /bid/i }));

    await waitFor(() => {
      // Check for main table structure - BiddingTable renders two tables
      const tables = screen.getAllByRole("table");
      expect(tables.length).toBe(2);

      // Check for main section headers from all three sub-components
      const openingBidsHeadings = screen.getAllByRole("heading", {
        name: /opening bids/i,
      });
      expect(openingBidsHeadings.length).toBeGreaterThanOrEqual(1);

      const respondingBidsHeadings = screen.getAllByRole("heading", {
        name: /responding bids/i,
      });
      expect(respondingBidsHeadings.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("displays balanced hands section content", async () => {
    render(<BidDialog />);

    fireEvent.click(screen.getByRole("button", { name: /bid/i }));

    await waitFor(() => {
      // Balanced Hands section content - appears multiple places, use getAllByText
      const balancedTexts = screen.getAllByText(/balanced hands/i);
      expect(balancedTexts.length).toBeGreaterThanOrEqual(1);
      // Check for multiple point ranges that exist
      const pointRanges = screen.getAllByText(/12-14/);
      expect(pointRanges.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("displays unbalanced hands section content", async () => {
    render(<BidDialog />);

    fireEvent.click(screen.getByRole("button", { name: /bid/i }));

    await waitFor(() => {
      // Unbalanced Hands section content
      expect(screen.getByText(/unbalanced hands/i)).toBeInTheDocument();
    });
  });

  it("displays overcalls section content", async () => {
    render(<BidDialog />);

    fireEvent.click(screen.getByRole("button", { name: /bid/i }));

    await waitFor(() => {
      // Overcalls section content
      expect(
        screen.getByRole("heading", { name: /^overcalls$/i }),
      ).toBeInTheDocument();
    });
  });

  it("displays external link to nofearbridge.com", async () => {
    render(<BidDialog />);

    fireEvent.click(screen.getByRole("button", { name: /bid/i }));

    await waitFor(() => {
      const link = screen.getByRole("link", { name: /nofearbridge\.com/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://www.nofearbridge.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
