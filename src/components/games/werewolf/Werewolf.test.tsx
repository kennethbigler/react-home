import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Werewolf from ".";
import WerewolfPanel from "./WerewolfPanel";

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

  it("handles Mason role count changes (count > 0 and count = 0 branches)", () => {
    render(<Werewolf />);
    fireEvent.click(screen.getAllByRole("button")[1]);

    const masonText = screen.getByText("Mason");
    const masonSummary = masonText.closest(".MuiAccordionSummary-root")!;
    const labels = masonSummary.querySelectorAll("label");

    // Click star label (count > 0 branch)
    fireEvent.click(labels[0]);
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();

    // Click deselect label (count = 0 branch)
    fireEvent.click(labels[labels.length - 1]);
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();
  });

  it("handles Villager role count changes (count > 0 and count = 0 branches)", () => {
    render(<Werewolf />);
    fireEvent.click(screen.getAllByRole("button")[1]);

    const villagerText = screen.getByText("Villager");
    const villagerSummary = villagerText.closest(".MuiAccordionSummary-root")!;
    const labels = villagerSummary.querySelectorAll("label");

    fireEvent.click(labels[0]);
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();

    fireEvent.click(labels[labels.length - 1]);
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();
  });

  it("handles Vampire role count changes (count > 0 and count = 0 branches)", () => {
    render(<Werewolf />);
    fireEvent.click(screen.getAllByRole("button")[2]);

    const vampireText = screen.getByText("Vampire");
    const vampireSummary = vampireText.closest(".MuiAccordionSummary-root")!;
    const labels = vampireSummary.querySelectorAll("label");

    fireEvent.click(labels[0]);
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();

    fireEvent.click(labels[labels.length - 1]);
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();
  });

  it("handles Werewolf role count changes (count > 0 and count = 0 branches)", () => {
    render(<Werewolf />);
    fireEvent.click(screen.getAllByRole("button")[3]);

    // "Werewolf" appears as both page h2 and role name; find the one in an accordion summary
    const werewolfTexts = screen.getAllByText("Werewolf");
    const werewolfText = werewolfTexts.find(
      (el) => el.closest(".MuiAccordionSummary-root") !== null,
    )!;
    const werewolfSummary = werewolfText.closest(".MuiAccordionSummary-root")!;
    const labels = werewolfSummary.querySelectorAll("label");

    fireEvent.click(labels[0]);
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();

    fireEvent.click(labels[labels.length - 1]);
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();
  });

  it("handles default role (non-countable) changes", () => {
    render(<Werewolf />);
    fireEvent.click(screen.getAllByRole("button")[1]);

    const seerText = screen.getByText("Seer");
    expect(seerText).toBeInTheDocument();

    const seerSummary = seerText.closest(".MuiAccordionSummary-root")!;
    const labels = seerSummary.querySelectorAll("label");

    fireEvent.click(labels[0]);
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();
  });
});

describe("games | werewolf | handleStar branches via WerewolfPanel", () => {
  const handleChange = vi.fn(() => vi.fn());

  it("Mason: count > 0 branch (star click) and count = 0 branch (deselect)", () => {
    const handleStar = vi.fn();
    const { container } = render(
      <WerewolfPanel
        expanded=""
        expandedKey="mason-0"
        handleChange={handleChange}
        handleStar={handleStar}
        name="Mason"
        description="test"
        value={2}
        count={3}
      />,
    );
    const labels = container.querySelectorAll("label");
    // Click star 1 (count = 1, true branch)
    fireEvent.click(labels[0]);
    expect(handleStar).toHaveBeenCalledWith(2, 1, "Mason");
    // Click deselect label (count = 0, false branch)
    fireEvent.click(labels[labels.length - 1]);
    expect(handleStar).toHaveBeenCalledWith(-2, 0, "Mason");
  });

  it("Villager: count > 0 branch and count = 0 branch", () => {
    const handleStar = vi.fn();
    const { container } = render(
      <WerewolfPanel
        expanded=""
        expandedKey="villager-0"
        handleChange={handleChange}
        handleStar={handleStar}
        name="Villager"
        description="test"
        value={1}
        count={5}
      />,
    );
    const labels = container.querySelectorAll("label");
    fireEvent.click(labels[0]);
    expect(handleStar).toHaveBeenCalledWith(1, 1, "Villager");
    fireEvent.click(labels[labels.length - 1]);
    expect(handleStar).toHaveBeenCalledWith(-1, 0, "Villager");
  });

  it("Vampire: count > 0 branch and count = 0 branch", () => {
    const handleStar = vi.fn();
    const { container } = render(
      <WerewolfPanel
        expanded=""
        expandedKey="vampire-0"
        handleChange={handleChange}
        handleStar={handleStar}
        name="Vampire"
        description="test"
        value={-7}
        count={8}
      />,
    );
    const labels = container.querySelectorAll("label");
    fireEvent.click(labels[0]);
    expect(handleStar).toHaveBeenCalledWith(-7, 1, "Vampire");
    fireEvent.click(labels[labels.length - 1]);
    expect(handleStar).toHaveBeenCalledWith(7, 0, "Vampire");
  });

  it("Werewolf: count > 0 branch and count = 0 branch", () => {
    const handleStar = vi.fn();
    const { container } = render(
      <WerewolfPanel
        expanded=""
        expandedKey="werewolf-0"
        handleChange={handleChange}
        handleStar={handleStar}
        name="Werewolf"
        description="test"
        value={-6}
        count={12}
      />,
    );
    const labels = container.querySelectorAll("label");
    fireEvent.click(labels[0]);
    expect(handleStar).toHaveBeenCalledWith(-6, 1, "Werewolf");
    fireEvent.click(labels[labels.length - 1]);
    expect(handleStar).toHaveBeenCalledWith(6, 0, "Werewolf");
  });

  it("default role (no count): triggers default branch", () => {
    const handleStar = vi.fn();
    const { container } = render(
      <WerewolfPanel
        expanded=""
        expandedKey="seer-0"
        handleChange={handleChange}
        handleStar={handleStar}
        name="Seer"
        description="test"
        value={7}
      />,
    );
    const labels = container.querySelectorAll("label");
    fireEvent.click(labels[0]);
    expect(handleStar).toHaveBeenCalledWith(7, 1, "Seer");
  });
});
