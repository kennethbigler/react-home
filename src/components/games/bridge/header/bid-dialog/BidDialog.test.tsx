import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BidDialog from "./BidDialog";

describe("games | bridge | BidDialog", () => {
  it("renders bid dialog popup", () => {
    render(<BidDialog />);

    // InfoPopup should create a button with the title
    expect(screen.getByRole("button", { name: /bid/i })).toBeInTheDocument();
  });

  it("displays all three bidding cheat sheet images when opened", async () => {
    render(<BidDialog />);

    // Open the dialog
    fireEvent.click(screen.getByRole("button", { name: /bid/i }));

    await waitFor(() => {
      // Check that all three images are present with proper alt text
      const images = screen.getAllByRole("img");
      expect(images).toHaveLength(3);

      expect(
        screen.getByAltText("Bridge Bidding Cheat Sheet Page 1"),
      ).toBeInTheDocument();
      expect(
        screen.getByAltText("Bridge Bidding Cheat Sheet Page 2"),
      ).toBeInTheDocument();
      expect(screen.getByAltText("Ken Bridge Betting")).toBeInTheDocument();
    });
  });

  it("sets images to 100% width when opened", async () => {
    render(<BidDialog />);

    // Open the dialog
    fireEvent.click(screen.getByRole("button", { name: /bid/i }));

    await waitFor(() => {
      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        expect(img).toHaveAttribute("width", "100%");
      });
    });
  });

  it("shows correct alt text for accessibility", async () => {
    render(<BidDialog />);

    fireEvent.click(screen.getByRole("button", { name: /bid/i }));

    await waitFor(() => {
      const page1 = screen.getByAltText("Bridge Bidding Cheat Sheet Page 1");
      const page2 = screen.getByAltText("Bridge Bidding Cheat Sheet Page 2");
      const pageK = screen.getByAltText("Ken Bridge Betting");

      expect(page1).toHaveAttribute("alt", "Bridge Bidding Cheat Sheet Page 1");
      expect(page2).toHaveAttribute("alt", "Bridge Bidding Cheat Sheet Page 2");
      expect(pageK).toHaveAttribute("alt", "Ken Bridge Betting");
    });
  });
});
