import { screen } from "@testing-library/react";
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
    renderWithHydratedAtoms(<ShowStats {...defaultProps} />, [
      [themeAtom, lightTheme] as const,
    ]);
    screen.getByText("Stats").click();
    expect(await screen.findByText("Totals:")).toBeInTheDocument();
    expect(screen.getByText("AC")).toBeInTheDocument();
    expect(screen.getByText("BD")).toBeInTheDocument();
  });

  it("renders correctly in dark mode", async () => {
    renderWithHydratedAtoms(<ShowStats {...defaultProps} />, [
      [themeAtom, darkTheme] as const,
    ]);
    screen.getByText("Stats").click();
    expect(await screen.findByText("Totals:")).toBeInTheDocument();
  });
});
