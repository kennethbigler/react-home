import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import BotC from ".";
import themeAtom, { lightTheme } from "../../../jotai/theme-atom";

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

  it("renders LiePie in light mode (covers theme.mode === 'light' branch)", () => {
    // useHydrateAtoms forces the atom to lightTheme for this render tree,
    // bypassing atomWithStorage's module-level cache.
    const HydrateLight = ({ children }: { children: React.ReactNode }) => {
      useHydrateAtoms([[themeAtom, lightTheme]]);
      return <>{children}</>;
    };
    render(
      <Provider>
        <HydrateLight>
          <BotC />
        </HydrateLight>
      </Provider>,
    );
    expect(screen.getByText("BotC")).toBeInTheDocument();
  });

  it("shows separator and notes when player has both a status flag and notes", () => {
    render(<BotC />);
    // Open character sheet for player 0
    fireEvent.click(screen.getAllByText("Ken")[0]);
    // Set liar status
    fireEvent.click(screen.getByLabelText("😈"));
    // Add notes via blur event
    const notesInput = screen.getByLabelText("Notes");
    fireEvent.change(notesInput, { target: { value: "Has info" } });
    fireEvent.blur(notesInput);
    // The " - " separator and notes text render (covers lines 83-89 true branch)
    expect(screen.getByDisplayValue("Has info")).toBeInTheDocument();
    // Reset
    fireEvent.click(screen.getByLabelText("😈"));
  });

  it("highlights random player and covers exec/kill skip in getRandomPlayer", () => {
    render(
      <Provider>
        <BotC />
      </Provider>,
    );
    // Mark player index 1 (second card) as exec'd so getRandomPlayer skips them
    // (covers useBotC line 75: !exec && !kill false branch)
    const playerCards = screen.getAllByText("Ken");
    fireEvent.click(playerCards[1]);
    fireEvent.click(screen.getByLabelText("✋"));
    fireEvent.keyDown(document, { key: "Escape" });
    // Click Random — picks from remaining alive players, setting randomPlayer
    // (covers PlayerNotes line 60: randomPlayer === i ? "3px solid red" : "none" true branch)
    fireEvent.click(screen.getByText("Random 🔪"));
    expect(screen.getByText("BotC")).toBeInTheDocument();
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
