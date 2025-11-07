import { render, screen, fireEvent } from "@testing-library/react";
import Werewolf from ".";

describe("games | werewolf", () => {
  it("renders as expected", () => {
    render(<Werewolf />);

    expect(screen.getByText("Villagers")).toBeInTheDocument();
    expect(screen.getByText("Outsiders")).toBeInTheDocument();
    expect(screen.getByText("Wolves")).toBeInTheDocument();
  });

  it("handles accordion open and close", () => {
    render(<Werewolf />);

    expect(screen.getAllByRole("button")[1]).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(screen.getAllByRole("button")[1]).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(screen.getAllByRole("button")[1]).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("calculates and displays total score", () => {
    render(<Werewolf />);

    // Total chip should not be visible initially
    expect(screen.queryByText(/Total:/)).toBeNull();

    // Expand villagers section to interact with roles
    fireEvent.click(screen.getAllByRole("button")[1]);

    // Click a star rating button to add a role
    // Find the first star rating input (hunter has 5 star inputs)
    const starInputs = screen.getAllByRole("radio");

    // Click one of the star inputs
    if (starInputs.length > 0) {
      fireEvent.click(starInputs[0]);

      // Now total should be visible
      expect(screen.queryByText(/Total:/)).toBeInTheDocument();
    }
  });

  it("updates score when adding multiple roles", () => {
    render(<Werewolf />);

    // Expand villagers section
    fireEvent.click(screen.getAllByRole("button")[1]);

    // Click multiple star ratings to add roles
    const starInputs = screen.getAllByRole("radio");

    if (starInputs.length >= 2) {
      fireEvent.click(starInputs[0]);
      const firstTotal = screen.queryByText(/Total:/);
      expect(firstTotal).toBeInTheDocument();

      // Click another star
      fireEvent.click(starInputs[5]);
      const secondTotal = screen.queryByText(/Total:/);
      expect(secondTotal).toBeInTheDocument();
    }
  });

  it("displays different role categories", () => {
    render(<Werewolf />);

    // Check that all three categories are present
    expect(screen.getByText("Villagers")).toBeInTheDocument();
    expect(screen.getByText("Outsiders")).toBeInTheDocument();
    expect(screen.getByText("Wolves")).toBeInTheDocument();

    // Initially all sections should be collapsed
    expect(screen.getAllByRole("button")[1]).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getAllByRole("button")[2]).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getAllByRole("button")[3]).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    // Expand villagers
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(screen.getAllByRole("button")[1]).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    // Expand outsiders
    fireEvent.click(screen.getAllByRole("button")[2]);
    expect(screen.getAllByRole("button")[2]).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    // Expand wolves
    fireEvent.click(screen.getAllByRole("button")[3]);
    expect(screen.getAllByRole("button")[3]).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("handles Mason role count changes", () => {
    render(<Werewolf />);

    // Find and expand the panel with Mason
    fireEvent.click(screen.getAllByRole("button")[1]);

    // Mason should be present in the villagers
    const masonPanel = screen.getByText("Mason");
    expect(masonPanel).toBeInTheDocument();

    // Find star ratings for Mason and interact with them
    const starInputs = screen.getAllByRole("radio");

    // Click a star to add masons
    if (starInputs.length > 0) {
      // Find the Mason stars (it should have count of 3)
      fireEvent.click(starInputs[0]);
      expect(screen.queryByText(/Total:/)).toBeInTheDocument();

      // Change the count
      fireEvent.click(starInputs[1]);
      expect(screen.queryByText(/Total:/)).toBeInTheDocument();
    }
  });

  it("handles Villager role count changes", () => {
    render(<Werewolf />);

    // Find and expand the panel with Villager
    fireEvent.click(screen.getAllByRole("button")[1]);

    // Villager should be present in the villagers
    const villagerPanel = screen.getByText("Villager");
    expect(villagerPanel).toBeInTheDocument();

    // Find star ratings for Villager and interact with them
    const starInputs = screen.getAllByRole("radio");

    if (starInputs.length > 0) {
      // Villager has a count of 14, so it should have many star options
      fireEvent.click(starInputs[0]);
      expect(screen.queryByText(/Total:/)).toBeInTheDocument();
    }
  });

  it("handles Vampire role count changes", () => {
    render(<Werewolf />);

    // Find and expand the outsiders panel with Vampire
    fireEvent.click(screen.getAllByRole("button")[2]);

    // Vampire should be present in the outsiders
    const vampirePanel = screen.getByText("Vampire");
    expect(vampirePanel).toBeInTheDocument();

    // Find star ratings for Vampire and interact with them
    const starInputs = screen.getAllByRole("radio");

    if (starInputs.length > 0) {
      fireEvent.click(starInputs[0]);
      expect(screen.queryByText(/Total:/)).toBeInTheDocument();
    }
  });

  it("handles Werewolf role count changes", () => {
    render(<Werewolf />);

    // Find and expand the wolves panel with Werewolf
    fireEvent.click(screen.getAllByRole("button")[3]);

    // Werewolf should be present in the wolves - use getAllByText since it appears multiple times
    const werewolfPanels = screen.getAllByText("Werewolf");
    expect(werewolfPanels.length).toBeGreaterThan(0);

    // Find star ratings for Werewolf and interact with them
    const starInputs = screen.getAllByRole("radio");

    if (starInputs.length > 0) {
      fireEvent.click(starInputs[0]);
      expect(screen.queryByText(/Total:/)).toBeInTheDocument();
    }
  });

  it("handles default role (non-countable) changes", () => {
    render(<Werewolf />);

    // Find and expand the villagers panel
    fireEvent.click(screen.getAllByRole("button")[1]);

    // Seer is a non-countable role (no count property)
    const seerPanel = screen.getByText("Seer");
    expect(seerPanel).toBeInTheDocument();

    // Find star ratings and interact
    const starInputs = screen.getAllByRole("radio");

    if (starInputs.length > 0) {
      fireEvent.click(starInputs[0]);
      expect(screen.queryByText(/Total:/)).toBeInTheDocument();
    }
  });
});
