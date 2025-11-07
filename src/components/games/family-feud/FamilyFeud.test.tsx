import { render, screen, fireEvent } from "@testing-library/react";
import FamilyFeud from ".";

describe("games | connect4 | Connect4", () => {
  it("renders as expected", () => {
    render(<FamilyFeud />);

    expect(screen.getByText("Family Feud!")).toBeInTheDocument();
    expect(screen.getAllByText("Team 1")).toHaveLength(2);
    expect(screen.getAllByText("0")).toHaveLength(2);

    expect(screen.getByText("Round 1")).toBeInTheDocument();
    expect(screen.getByText("Round 2")).toBeInTheDocument();
    expect(screen.getByText("Round 3")).toBeInTheDocument();
    expect(screen.getByText("Round 4")).toBeInTheDocument();
    expect(screen.getByText("Sudden Death")).toBeInTheDocument();
    expect(screen.getByText("Fast Money")).toBeInTheDocument();

    expect(screen.getByText("Points: 0")).toBeInTheDocument();
    expect(screen.getByText("Which Team Won?")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(13);
  });

  it("changes tabs", () => {
    render(<FamilyFeud />);
    expect(
      screen.queryByText(
        "Name a superpower that would give you an advantage in an easter egg hunt.",
      ),
    ).toBeNull();
    fireEvent.click(screen.getByText("Round 2"));
    expect(
      screen.getByText(
        "Name a superpower that would give you an advantage in an easter egg hunt.",
      ),
    ).toBeInTheDocument();
  });

  it("plays the game and scores", () => {
    render(<FamilyFeud />);

    // test left button
    expect(screen.queryByText("Food/Drink - 48")).toBeNull();
    fireEvent.click(screen.getByText("1"));
    expect(screen.getByText("Food/Drink - 48")).toBeInTheDocument();

    // test strike buttons
    expect(screen.getAllByText("X")).toHaveLength(3);
    fireEvent.click(screen.getAllByText("X")[2]);
    expect(screen.getAllByText("X")).toHaveLength(3);

    // test scoring buttons
    expect(screen.queryByText("48")).toBeNull();
    fireEvent.click(screen.getAllByText("Team 1")[1]);
    expect(screen.getByText("48")).toBeInTheDocument();
    fireEvent.click(screen.getAllByText("Team 2")[1]);
    expect(screen.getAllByText("48")).toHaveLength(2);

    // test right button
    expect(screen.queryByText("Laptop - 7")).toBeNull();
    fireEvent.click(screen.getByText("5"));
    expect(screen.getByText("Laptop - 7")).toBeInTheDocument();
  });

  it("plays fast money", () => {
    render(<FamilyFeud />);

    fireEvent.click(screen.getByText("Fast Money"));
    expect(screen.getByText("Total: 0")).toBeInTheDocument();

    // test left button
    expect(screen.queryByText("Reptiles")).toBeNull();
    fireEvent.click(screen.getAllByTitle("Reptiles")[0]);
    expect(screen.getByText("Reptiles")).toBeInTheDocument();
    // test right button
    expect(screen.queryByText("Duck")).toBeNull();
    fireEvent.click(screen.getByTitle("Duck"));
    expect(screen.getByText("Duck")).toBeInTheDocument();
    // test left wrong button
    expect(screen.getAllByTitle("Basketball")).toHaveLength(2);
    fireEvent.click(screen.getAllByTitle("Wrong")[0]);
    expect(screen.getByTitle("Basketball")).toBeInTheDocument();
    // test right wrong button
    fireEvent.click(screen.getAllByTitle("Wrong")[4]);
    expect(screen.queryByTitle("Basketball")).toBeNull();
  });

  it("plays round 3 with 2x modifier", () => {
    render(<FamilyFeud />);

    fireEvent.click(screen.getByText("Round 3"));

    // Answer a question worth 45 points with 2x modifier = 90 points
    fireEvent.click(screen.getByText("1")); // Phone - 45 points
    fireEvent.click(screen.getAllByText("Team 1")[1]);

    // Score should be 90 (45 * 2)
    expect(screen.getByText("90")).toBeInTheDocument();
  });

  it("plays round 4 with 3x modifier", () => {
    render(<FamilyFeud />);

    fireEvent.click(screen.getByText("Round 4"));

    // Answer a question worth 43 points with 3x modifier = 129 points
    fireEvent.click(screen.getByText("1")); // Walk/Hike - 43 points
    fireEvent.click(screen.getAllByText("Team 2")[1]);

    // Score should be 129 (43 * 3)
    expect(screen.getByText("129")).toBeInTheDocument();
  });

  it("plays sudden death with 300x modifier", () => {
    render(<FamilyFeud />);

    fireEvent.click(screen.getByText("Sudden Death"));

    // Answer a question worth 37 points with 300x modifier = 11100 points
    fireEvent.click(screen.getByText("1")); // Coffee - 37 points
    fireEvent.click(screen.getAllByText("Team 1")[1]);

    // Score should be 11100 (37 * 300)
    expect(screen.getByText("11100")).toBeInTheDocument();
  });

  it("accumulates scores across multiple rounds", () => {
    render(<FamilyFeud />);

    // Round 1: Add 48 points to Team 1
    fireEvent.click(screen.getByText("1")); // Food/Drink - 48
    fireEvent.click(screen.getAllByText("Team 1")[1]);
    expect(screen.getByText("48")).toBeInTheDocument();

    // Round 2: Add 46 points to Team 1
    fireEvent.click(screen.getByText("Round 2"));
    fireEvent.click(screen.getByText("1")); // Xray/Special Vision - 46
    fireEvent.click(screen.getAllByText("Team 1")[1]);
    expect(screen.getByText("94")).toBeInTheDocument(); // 48 + 46

    // Round 3: Add 90 points to Team 2 (45 * 2)
    fireEvent.click(screen.getByText("Round 3"));
    fireEvent.click(screen.getByText("1")); // Phone - 45 with 2x modifier
    fireEvent.click(screen.getAllByText("Team 2")[1]);
    expect(screen.getByText("94")).toBeInTheDocument(); // Team 1 still 94
    expect(screen.getByText("90")).toBeInTheDocument(); // Team 2 now 90
  });
});
