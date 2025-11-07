import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../Home";

describe("games | Home", () => {
  it("renders as expected", () => {
    render(<Home />);

    expect(screen.getAllByText("Games")).toHaveLength(2);
    expect(
      screen.getByText("This site was created to learn, check out the"),
    ).toBeInTheDocument();
    expect(screen.getByText("<source code/>")).toBeInTheDocument();
  });

  it("calls onClick handler when menu item is clicked", () => {
    const mockOnClick = vi.fn();
    render(<Home onItemClick={mockOnClick} />);

    // Find cards/buttons
    const buttons = screen.getAllByRole("button");

    // Click one of the game cards
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      expect(mockOnClick).toHaveBeenCalled();
    }
  });
});
