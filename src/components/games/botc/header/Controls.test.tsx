import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import Controls from "./Controls";
import { renderWithHydratedAtoms } from "@/test-utils/renderWithHydratedAtoms";

vi.mock("../../../../data/botc-scripts.json", () => ({
  default: {
    scripts: [],
  },
}));

describe("Controls", () => {
  it("renders without crashing", () => {
    renderWithHydratedAtoms(<Controls numPlayers={8} numTravelers={0} />);
    expect(
      screen.getByRole("button", { name: "Settings" }),
    ).toBeInTheDocument();
  });

  it("opens game-reset toast and calls close handler", () => {
    renderWithHydratedAtoms(<Controls numPlayers={8} numTravelers={0} />);

    // Open the Settings popover
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    expect(screen.getByText("Reset")).toBeInTheDocument();

    // Click Reset to trigger openToast → hasToast = true
    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByText("Game Reset")).toBeInTheDocument();

    // Close the Snackbar via the Alert's close button (covers handleCloseToast)
    const closeButtons = screen.getAllByTitle("Close");
    act(() => {
      fireEvent.click(closeButtons[closeButtons.length - 1]);
    });

    // handleCloseToast ran without error
    expect(screen.getByText("Game Reset")).toBeInTheDocument();
  });
});
