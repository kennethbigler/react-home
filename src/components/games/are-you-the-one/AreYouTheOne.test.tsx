import { screen } from "@testing-library/react";
import render from "../../../recoil-test-render";
import AreYouTheOne from ".";

describe("games | are-you-the-one | AreYouTheOne", () => {
  it("renders as expected", () => {
    render(<AreYouTheOne />);

    // Title
    expect(screen.getByText("Are You The One?")).toBeInTheDocument();
    // Top Bar
    expect(screen.getByText("Matchup 1")).toBeInTheDocument();
    expect(screen.getByText("Blackout")).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getAllByText("-")).toHaveLength(2);
    // Analysis
    expect(screen.getByText("Analysis")).toBeInTheDocument();
    expect(screen.getByText("Show All Couples")).toBeInTheDocument();
  });
});
