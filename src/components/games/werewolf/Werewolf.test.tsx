import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, type Mock } from "vitest";
import Werewolf from ".";
import WerewolfPanel from "./WerewolfPanel";

function clickRatingStar(name: string, index: number) {
  const rating = screen.getByRole("group", { name: `${name} rating` });
  fireEvent.click(within(rating).getAllByRole("radio")[index]);
}

function clearRating(name: string) {
  const rating = screen.getByRole("group", { name: `${name} rating` });
  const radios = within(rating).getAllByRole("radio");
  fireEvent.click(radios[radios.length - 1]);
}

interface KeyboardRatingExpectation {
  value?: number;
  count?: number;
  handleStar?: Mock;
  singleStar?: boolean;
}

async function exerciseRatingKeyboard(
  name: string,
  startIndex: number,
  expected?: KeyboardRatingExpectation,
) {
  const user = userEvent.setup();
  const rating = screen.getByRole("group", { name: `${name} rating` });
  const radios = within(rating).getAllByRole("radio");
  const startRadio = radios[startIndex];

  startRadio.focus();
  await user.keyboard("{ArrowRight}");

  const nextRadio = radios[startIndex + 1];

  if (
    expected?.singleStar &&
    expected.handleStar &&
    expected.value !== undefined
  ) {
    expect(expected.handleStar).not.toHaveBeenCalledWith(
      expected.value,
      2,
      name,
    );
    expect(rating).toContainElement(document.activeElement as HTMLElement);
    return;
  }

  if (expected?.handleStar && nextRadio?.getAttribute("value")) {
    expect(nextRadio).toHaveFocus();
    expect(expected.handleStar).toHaveBeenCalledWith(
      expected.value,
      expected.count,
      name,
    );
  }
}

function getCategoryToggle(name: "Villagers" | "Outsiders" | "Wolves") {
  return screen.getByRole("button", { name: new RegExp(`^${name}\\b`) });
}

function ensureCategoryExpanded(name: "Villagers" | "Outsiders" | "Wolves") {
  const toggle = getCategoryToggle(name);
  if (toggle.getAttribute("aria-expanded") === "false") {
    fireEvent.click(toggle);
  }
}

describe("games | werewolf", () => {
  it("renders as expected", () => {
    render(<Werewolf />);

    expect(screen.getByText("Villagers")).toBeInTheDocument();
    expect(screen.getByText("Outsiders")).toBeInTheDocument();
    expect(screen.getByText("Wolves")).toBeInTheDocument();
  });

  it("handles accordion open and close", async () => {
    const user = userEvent.setup();
    render(<Werewolf />);

    const villagersToggle = getCategoryToggle("Villagers");
    expect(villagersToggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(villagersToggle);
    expect(villagersToggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(villagersToggle);
    expect(villagersToggle).toHaveAttribute("aria-expanded", "true");

    villagersToggle.focus();
    await user.keyboard("{Enter}");
    expect(villagersToggle).toHaveAttribute("aria-expanded", "false");
    await user.keyboard(" ");
    expect(villagersToggle).toHaveAttribute("aria-expanded", "true");
  });

  it("calculates and displays total score", () => {
    render(<Werewolf />);

    // Total chip should not be visible initially
    expect(screen.queryByText(/Total:/)).toBeNull();

    // Expand villagers section to interact with roles
    ensureCategoryExpanded("Villagers");

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
    ensureCategoryExpanded("Villagers");

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

    // All sections start expanded
    expect(getCategoryToggle("Villagers")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(getCategoryToggle("Outsiders")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(getCategoryToggle("Wolves")).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    // Collapse villagers
    fireEvent.click(getCategoryToggle("Villagers"));
    expect(getCategoryToggle("Villagers")).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    // Collapse outsiders
    fireEvent.click(getCategoryToggle("Outsiders"));
    expect(getCategoryToggle("Outsiders")).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    // Collapse wolves
    fireEvent.click(getCategoryToggle("Wolves"));
    expect(getCategoryToggle("Wolves")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("handles Mason role count changes (count > 0 and count = 0 branches)", async () => {
    render(<Werewolf />);
    ensureCategoryExpanded("Villagers");

    clickRatingStar("Mason", 0);
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();
    await exerciseRatingKeyboard("Mason", 0);

    clearRating("Mason");
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();
  });

  it("handles Villager role count changes (count > 0 and count = 0 branches)", async () => {
    render(<Werewolf />);
    ensureCategoryExpanded("Villagers");

    clickRatingStar("Villager", 0);
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();
    await exerciseRatingKeyboard("Villager", 0);

    clearRating("Villager");
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();
  });

  it("handles Vampire role count changes (count > 0 and count = 0 branches)", async () => {
    render(<Werewolf />);
    ensureCategoryExpanded("Outsiders");

    clickRatingStar("Vampire", 0);
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();
    await exerciseRatingKeyboard("Vampire", 0);

    clearRating("Vampire");
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();
  });

  it("handles Werewolf role count changes (count > 0 and count = 0 branches)", async () => {
    render(<Werewolf />);
    ensureCategoryExpanded("Wolves");

    clickRatingStar("Werewolf", 0);
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();
    await exerciseRatingKeyboard("Werewolf", 0);

    clearRating("Werewolf");
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();
  });

  it("handles default role (non-countable) changes", async () => {
    render(<Werewolf />);
    ensureCategoryExpanded("Villagers");

    clickRatingStar("Seer", 0);
    expect(screen.queryByText(/Total:/)).toBeInTheDocument();
    await exerciseRatingKeyboard("Seer", 0);
  });
});

describe("games | werewolf | handleStar branches via WerewolfPanel", () => {
  const handleChange = vi.fn(() => vi.fn());

  it("Mason: count > 0 branch (star click) and count = 0 branch (deselect)", async () => {
    const handleStar = vi.fn();
    render(
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
    clickRatingStar("Mason", 0);
    expect(handleStar).toHaveBeenCalledWith(2, 1, "Mason");
    await exerciseRatingKeyboard("Mason", 0, {
      value: 2,
      count: 2,
      handleStar,
    });
    clearRating("Mason");
    expect(handleStar).toHaveBeenCalledWith(-2, 0, "Mason");
  });

  it("Villager: count > 0 branch and count = 0 branch", async () => {
    const handleStar = vi.fn();
    render(
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
    clickRatingStar("Villager", 0);
    expect(handleStar).toHaveBeenCalledWith(1, 1, "Villager");
    await exerciseRatingKeyboard("Villager", 0, {
      value: 1,
      count: 2,
      handleStar,
    });
    clearRating("Villager");
    expect(handleStar).toHaveBeenCalledWith(-1, 0, "Villager");
  });

  it("Vampire: count > 0 branch and count = 0 branch", async () => {
    const handleStar = vi.fn();
    render(
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
    clickRatingStar("Vampire", 0);
    expect(handleStar).toHaveBeenCalledWith(-7, 1, "Vampire");
    await exerciseRatingKeyboard("Vampire", 0, {
      value: -7,
      count: 2,
      handleStar,
    });
    clearRating("Vampire");
    expect(handleStar).toHaveBeenCalledWith(7, 0, "Vampire");
  });

  it("Werewolf: count > 0 branch and count = 0 branch", async () => {
    const handleStar = vi.fn();
    render(
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
    clickRatingStar("Werewolf", 0);
    expect(handleStar).toHaveBeenCalledWith(-6, 1, "Werewolf");
    await exerciseRatingKeyboard("Werewolf", 0, {
      value: -6,
      count: 2,
      handleStar,
    });
    clearRating("Werewolf");
    expect(handleStar).toHaveBeenCalledWith(6, 0, "Werewolf");
  });

  it("default role (no count): triggers default branch", async () => {
    const handleStar = vi.fn();
    render(
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
    clickRatingStar("Seer", 0);
    expect(handleStar).toHaveBeenCalledWith(7, 1, "Seer");
    handleStar.mockClear();
    await exerciseRatingKeyboard("Seer", 0, {
      handleStar,
      singleStar: true,
      value: 7,
    });
  });
});
