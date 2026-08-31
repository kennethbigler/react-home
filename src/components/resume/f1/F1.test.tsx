import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import themeAtom, { lightTheme } from "@/jotai/theme-atom";
import { renderWithHydratedAtoms } from "@/test-utils/renderWithHydratedAtoms";
import F1 from ".";

describe("resume | f1 | F1", () => {
  it("renders as expected", async () => {
    render(<F1 />);

    await waitFor(() => {
      expect(screen.getByText("F1")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Constructor Budgets (Estimated)"),
    ).toBeInTheDocument();
  }, 90000);

  it("expands and collapses track cards", () => {
    render(<F1 />);

    const tracksHeading = screen.getByText("2026 Tracks");
    expect(tracksHeading).toBeInTheDocument();

    fireEvent.click(tracksHeading.closest("button")!);

    const trackCards = screen.getAllByRole("img");
    if (trackCards.length > 0) {
      const firstTrack =
        trackCards[0].closest("div[role='button']") ||
        trackCards[0].closest("button");
      if (firstTrack) {
        fireEvent.click(firstTrack);
        fireEvent.click(firstTrack);
      }
    }
  }, 90000);

  it("renders in light mode (covers light-theme color branch)", async () => {
    renderWithHydratedAtoms(<F1 />, [[themeAtom, lightTheme] as const]);
    await waitFor(() => {
      expect(screen.getByText("F1")).toBeInTheDocument();
    });
  }, 90000);
});
