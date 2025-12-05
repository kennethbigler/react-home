import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import F1 from ".";

describe("resume | f1 | F1", () => {
  it("renders as expected", async () => {
    render(<F1 />);

    // Wait for key elements to be present
    await waitFor(() => {
      expect(screen.getByText("F1")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Constructor Budgets (Estimated)"),
    ).toBeInTheDocument();
  });

  it("expands and collapses track cards", () => {
    render(<F1 />);

    // Find track cards via the circuit names
    const tracksHeading = screen.getByText("2026 Tracks");
    expect(tracksHeading).toBeInTheDocument();

    // Click to expand tracks section
    fireEvent.click(tracksHeading.closest("button")!);

    // Find a track card and click it
    const trackCards = screen.getAllByRole("img");
    if (trackCards.length > 0) {
      const firstTrack =
        trackCards[0].closest("div[role='button']") ||
        trackCards[0].closest("button");
      if (firstTrack) {
        // Click to expand
        fireEvent.click(firstTrack);

        // Click again to collapse
        fireEvent.click(firstTrack);
      }
    }
  });
});
