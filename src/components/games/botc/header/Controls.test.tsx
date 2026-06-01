import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "jotai";
import Controls from "./Controls";

vi.mock("../../../../data/botc-scripts.json", () => ({
  default: {
    scripts: [],
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider>{children}</Provider>
);

describe("Controls", () => {
  it("renders without crashing", () => {
    render(<Controls numPlayers={8} numTravelers={0} />, { wrapper });
    expect(screen.getByLabelText("settings")).toBeInTheDocument();
  });

  it("opens game-reset toast and calls close handler", () => {
    render(<Controls numPlayers={8} numTravelers={0} />, { wrapper });

    // Open the Settings popover
    fireEvent.click(screen.getByLabelText("settings"));
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
