import { render, screen, fireEvent } from "@testing-library/react";
import ImperialAssault from ".";

describe("games | imperial-assault", () => {
  it("renders as expected", () => {
    render(<ImperialAssault />);

    expect(screen.getByText("Imperial Assault")).toBeInTheDocument();

    const xpTracker = screen.getAllByText("1");

    // click XP tracker for each rebel and the empire
    fireEvent.click(xpTracker[0]);
    fireEvent.click(xpTracker[1]);
    fireEvent.click(xpTracker[2]);
    fireEvent.click(xpTracker[3]);
    fireEvent.click(xpTracker[4]);
    fireEvent.click(xpTracker[5]);

    // click mission trackers
    fireEvent.click(screen.getAllByText("Threat")[0]);
    fireEvent.click(screen.getAllByText("Tier 1 Items (14), Spend XP")[0]);
    fireEvent.click(screen.getAllByText("Agenda, Spend XP")[0]);

    // if we wanted to actually test this, we'd look for class names appearing/disappearing
  });
});
