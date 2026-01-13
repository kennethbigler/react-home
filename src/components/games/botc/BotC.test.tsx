import { render, screen, fireEvent } from "@testing-library/react";
import BotC from ".";

describe("games | BotC", () => {
  it("renders as expected", () => {
    render(<BotC />);

    expect(screen.getByText("BotC")).toBeInTheDocument();
    // Press Players button  to open modal
    fireEvent.click(screen.getByLabelText("settings"));
    // swap to icon mode then back to text mode
    fireEvent.click(screen.getByLabelText("toggle text"));
    fireEvent.click(screen.getByLabelText("toggle text"));
    // click the reset button
    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByText("Game Reset")).toBeInTheDocument();
    // swap number of players
    expect(screen.getByText("Players: 8 (5, 1, 1, 1)"));
    fireEvent.click(screen.getByLabelText("add player"));
    expect(screen.getByText("Players: 9 (5, 2, 1, 1)"));
    // swap number of travelers
    expect(screen.getByText("Travelers"));
    fireEvent.click(screen.getByLabelText("1 traveler"));
    expect(screen.getByText("Travelers"));

    // Close Players modal
    expect(screen.getByText("Close")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));

    // Press Roles button (for Player Dashboard)
    // expect(screen.getByText("Andrew")).toBeInTheDocument();
  });

  it("can move players", () => {
    render(<BotC />);

    expect(screen.queryByLabelText("up")).toBeNull();
    fireEvent.click(screen.getByLabelText("move players"));
    expect(screen.getAllByLabelText("up")).not.toBeNull();
  });

  it("can take notes on players", () => {
    render(<BotC />);
    fireEvent.click(screen.getAllByText("Ken")[0]);
    expect(screen.getByText("Chef")).toBeInTheDocument();
    expect(screen.getByText("Monk")).toBeInTheDocument();
    // Select 2 roles
    expect(screen.getAllByText("Chef")).toHaveLength(1);
    fireEvent.click(screen.getByText("Chef"));
    expect(screen.getAllByText("Chef")).toHaveLength(2);
    fireEvent.click(screen.getByText("Monk"));
    expect(screen.getAllByText("Monk")).toHaveLength(2);
    // Deselect a role
    fireEvent.click(screen.getAllByText("Monk")[1]);
    expect(screen.getAllByText("Monk")).toHaveLength(1);
    expect(screen.getAllByText("Chef")).toHaveLength(2);
  });

  it("can alter statuses and take notes", () => {
    render(<BotC />);
    fireEvent.click(screen.getAllByText("Ken")[0]);
    // set status states
    fireEvent.click(screen.getByLabelText("😈"));
    fireEvent.click(screen.getByLabelText("❌"));
    fireEvent.click(screen.getByLabelText("💀"));
    fireEvent.click(screen.getByLabelText("✋"));
    // edit notes
    fireEvent.change(screen.getByLabelText("Notes"), {
      target: { value: "Sketchy" },
    });
    expect(screen.getByDisplayValue("Sketchy")).toBeInTheDocument();
    // deselect statuses
    fireEvent.click(screen.getByLabelText("😈"));
    fireEvent.click(screen.getByLabelText("❌"));
    fireEvent.click(screen.getByLabelText("💀"));
    fireEvent.click(screen.getByLabelText("✋"));
  });

  it("can track players over rounds", () => {
    render(<BotC />);
    // open tracker
    fireEvent.click(screen.getByLabelText("track players"));
    expect(screen.getByText("Close")).toBeInTheDocument();
    // click a first time
    const kenButton = screen.getAllByText("Ken")[0];
    // expect(kenButton).toHaveClass(".MuiButton-textPrimary");
    fireEvent.click(kenButton);
  });
});
