import { render, screen, fireEvent } from "@testing-library/react";
import BotC from ".";

describe("games | BotC", () => {
  it("renders as expected", () => {
    render(<BotC />);

    expect(screen.getByText("BotC")).toBeInTheDocument();
    // Press Players button  to open modal
    fireEvent.click(screen.getByText("Players"));
    // swap to icon mode then back to text mode
    fireEvent.click(screen.getByLabelText("toggle text"));
    fireEvent.click(screen.getByLabelText("toggle text"));
    // click the reset button
    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByText("Game Reset")).toBeInTheDocument();
    // move a player up
    fireEvent.click(screen.getAllByLabelText("up")[1]);
    fireEvent.click(screen.getAllByLabelText("down")[0]);
    // swap number of players
    expect(screen.getByText("Players: 8 / Dist: 5,1,1,1"));
    fireEvent.change(screen.getByLabelText("player count"), {
      target: { value: 9 },
    });
    expect(screen.getByText("Players: 9 / Dist: 5,2,1,1"));
    // swap number of travelers
    expect(screen.getByText("Travelers: 0"));
    fireEvent.change(screen.getByLabelText("traveler count"), {
      target: { value: 1 },
    });
    expect(screen.getByText("Travelers: 1"));

    // update a name
    // fireEvent.change(screen.getAllByDisplayValue("Ken")[0], {
    //   target: { value: "Andrew" },
    // });
    // expect(screen.getByText("Andrew")).toBeInTheDocument();
    // switch script
    // fireEvent.click(screen.getByLabelText("Script"));
    // fireEvent.click(screen.getByLabelText("Trouble Brewing"));
    // await waitFor(() => expect(screen.getByText("Other")).toBeInTheDocument());
    // fireEvent.click(screen.getByText("Other"));

    // Close Players modal
    expect(screen.getByText("Close")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));

    // Press Roles button (for Player Dashboard)
    // expect(screen.getByText("Andrew")).toBeInTheDocument();
  });

  it("can can take notes on players", () => {
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
    fireEvent.click(screen.getByText("Tracker"));
    expect(screen.getByText("Close")).toBeInTheDocument();
    // click a first time
    const kenButton = screen.getAllByText("Ken")[0];
    // expect(kenButton).toHaveClass(".MuiButton-textPrimary");
    fireEvent.click(kenButton);
    // click a second time
    // kenButton = screen.getAllByText("Ken")[0];
    expect(kenButton).toHaveClass("MuiButton-containedPrimary");
    fireEvent.click(kenButton);
    // click a third time
    // kenButton = screen.getAllByText("Ken")[0];
    // expect(kenButton).toHaveClass("MuiButton-containedError");
    fireEvent.click(kenButton);
    // test a fourth time
    // kenButton = screen.getAllByText("Ken")[0];
    // expect(kenButton).toHaveClass("MuiButton-textPrimary");

    // select a new round number
    fireEvent.click(screen.getByText(2));
  });
});
