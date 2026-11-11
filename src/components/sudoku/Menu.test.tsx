import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router";
import Menu from "./Menu";

describe("sudoku | Menu", () => {
  const renderMenu = (onItemClick?: () => void) =>
    render(
      <MemoryRouter>
        <Menu onItemClick={onItemClick} />
      </MemoryRouter>,
    );

  it("renders as expected", () => {
    const { container } = renderMenu();

    expect(screen.getByText("Back to Resume")).toBeInTheDocument();
    expect(screen.getByText("Sudoku")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Privacy")).toBeInTheDocument();
    expect(container.querySelector("hr")).toBeInTheDocument();
  });

  it("links to the section pages", () => {
    const handleItemClick = vi.fn();
    renderMenu(handleItemClick);

    expect(
      screen.getByRole("menuitem", { name: "Back to Resume" }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByRole("menuitem", { name: "Sudoku" })).toHaveAttribute(
      "href",
      "/sudoku/",
    );
    expect(screen.getByRole("menuitem", { name: "Support" })).toHaveAttribute(
      "href",
      "/sudoku/support",
    );
    expect(screen.getByRole("menuitem", { name: "Privacy" })).toHaveAttribute(
      "href",
      "/sudoku/privacy",
    );

    const supportLink = screen.getByRole("menuitem", { name: "Support" });
    fireEvent.click(supportLink);
    expect(handleItemClick).toHaveBeenCalledTimes(1);
  });
});
