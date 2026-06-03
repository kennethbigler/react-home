import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../Home";

describe("games | Home", () => {
  const renderHome = (onItemClick?: (loc: string) => void) =>
    render(
      <MemoryRouter>
        <Home onItemClick={onItemClick} />
      </MemoryRouter>,
    );

  it("renders as expected", () => {
    renderHome();

    expect(screen.getAllByText("Games")).toHaveLength(2);
    expect(
      screen.getByText("This site was created to learn, check out the"),
    ).toBeInTheDocument();
    expect(screen.getByText("<source code/>")).toBeInTheDocument();
  });

  it("calls onClick handler when menu item is clicked", () => {
    const mockOnClick = vi.fn();
    renderHome(mockOnClick);

    // Find cards/buttons
    const links = screen.getAllByRole("link", { name: /open/i });

    // Click one of the game cards
    if (links.length > 0) {
      expect(links[0]).toHaveAttribute("href");
      fireEvent.click(links[0]);
      expect(mockOnClick).toHaveBeenCalled();
    }
  });
});
