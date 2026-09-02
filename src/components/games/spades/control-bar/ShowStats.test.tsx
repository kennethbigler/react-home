import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShowStats from "./ShowStats";
import themeAtom, { darkTheme, lightTheme } from "@/jotai/theme-atom";
import { renderWithHydratedAtoms } from "@/test-utils/renderWithHydratedAtoms";

describe("games | spades | ShowStats", () => {
  const defaultProps = { initials: "ABCD" };

  it("renders the Stats button", () => {
    renderWithHydratedAtoms(<ShowStats {...defaultProps} />);
    expect(screen.getByText("Stats")).toBeInTheDocument();
  });

  it("opens popup and shows total chips in light mode", async () => {
    const user = userEvent.setup();
    renderWithHydratedAtoms(<ShowStats {...defaultProps} />, [
      [themeAtom, lightTheme] as const,
    ]);
    await user.click(screen.getByText("Stats"));
    expect(await screen.findByText("Totals:")).toBeInTheDocument();
    expect(screen.getByText("AC")).toBeInTheDocument();
    expect(screen.getByText("BD")).toBeInTheDocument();
  });

  it("renders correctly in dark mode", async () => {
    const user = userEvent.setup();
    renderWithHydratedAtoms(<ShowStats {...defaultProps} />, [
      [themeAtom, darkTheme] as const,
    ]);
    await user.click(screen.getByText("Stats"));
    expect(await screen.findByText("Totals:")).toBeInTheDocument();
  });
});
