import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import render from "../../../redux-test-render";
import AreYouTheOne from "./AreYouTheOne";

describe("games | are-you-the-one | AreYouTheOne", () => {
  it("renders as expected", () => {
    render(<AreYouTheOne />);

    // Title
    expect(screen.getByText("Are You The One?")).toBeInTheDocument();
    // Top Bar
    expect(screen.getByText("Matchup 1")).toBeInTheDocument();
    expect(screen.getByText("Blackout")).toBeInTheDocument();
    expect(screen.getAllByText("Score")).toHaveLength(2);
    // Table
    expect(screen.getByText("Andre")).toBeInTheDocument();
    expect(screen.getByText("Alicia")).toBeInTheDocument();
    expect(screen.getByText("A-A")).toBeInTheDocument();
    // Analysis
    expect(screen.getByText("Analysis")).toBeInTheDocument();
    expect(screen.getByText("Show All Couples")).toBeInTheDocument();
  });

  it("can change the round and close the menu early", async () => {
    render(<AreYouTheOne />);

    expect(screen.getByLabelText("select matchup")).toBeInTheDocument();
    expect(screen.getByText("Matchup 1")).toBeInTheDocument();
    expect(screen.queryByText("Matchup 2")).toBeNull();
    // open menu
    fireEvent.click(screen.getByLabelText("select matchup"));
    expect(screen.getAllByText("Matchup 1")).toHaveLength(2);
    expect(screen.getByText("Matchup 2")).toBeInTheDocument();
    // select item
    fireEvent.click(screen.getByText("Matchup 2"));
    await waitFor(() => expect(screen.queryByText("Matchup 1")).toBeNull());
    expect(screen.getByText("Matchup 2")).toBeInTheDocument();
  });

  it("can process a round", async () => {
    render(<AreYouTheOne />);

    const AAButton = screen.getByText("A-A");
    const CDButton = screen.getAllByText("C-D")[0];
    const CEButton = screen.getAllByText("C-E")[1];
    const GHButton = screen.getByText("G-H");
    const HJButton = screen.getAllByText("H-J")[0];
    const KJButton = screen.getAllByText("K-J")[1];
    const KM1Button = screen.getAllByText("K-M")[2];
    const KM2Button = screen.getAllByText("K-M")[5];
    const SOButton = screen.getAllByText("S-O")[0];
    const TOButton = screen.getAllByText("T-O")[1];
    const TTButton = screen.getAllByText("T-T")[1];

    // select Table Matchups
    expect(AAButton).toHaveClass("MuiButton-outlined");
    fireEvent.click(AAButton);
    expect(AAButton).toHaveClass("MuiButton-contained");
    expect(CDButton).toHaveClass("MuiButton-outlined");
    fireEvent.click(CDButton);
    expect(CDButton).toHaveClass("MuiButton-contained");
    expect(CEButton).toHaveClass("MuiButton-outlined");
    fireEvent.click(CEButton);
    expect(CEButton).toHaveClass("MuiButton-contained");
    expect(GHButton).toHaveClass("MuiButton-outlined");
    fireEvent.click(GHButton);
    expect(GHButton).toHaveClass("MuiButton-contained");
    expect(HJButton).toHaveClass("MuiButton-outlined");
    fireEvent.click(HJButton);
    expect(HJButton).toHaveClass("MuiButton-contained");
    expect(KJButton).toHaveClass("MuiButton-outlined");
    fireEvent.click(KJButton);
    expect(KJButton).toHaveClass("MuiButton-contained");
    expect(KM1Button).toHaveClass("MuiButton-outlined");
    fireEvent.click(KM1Button);
    expect(KM1Button).toHaveClass("MuiButton-contained");
    expect(KM2Button).toHaveClass("MuiButton-outlined");
    fireEvent.click(KM2Button);
    expect(KM2Button).toHaveClass("MuiButton-contained");
    expect(SOButton).toHaveClass("MuiButton-outlined");
    fireEvent.click(SOButton);
    expect(SOButton).toHaveClass("MuiButton-contained");
    expect(TOButton).toHaveClass("MuiButton-outlined");
    fireEvent.click(TOButton);
    expect(TOButton).toHaveClass("MuiButton-contained");
    expect(TTButton).toHaveClass("MuiButton-outlined");
    fireEvent.click(TTButton);
    expect(TTButton).toHaveClass("MuiButton-contained");
    // verify equations were made
    expect(screen.getByText("Tyranny-Tyler - 0%")).toBeInTheDocument();
    // verify score updating works
    fireEvent.change(screen.getByDisplayValue("-1"), {
      target: { value: "1" },
    });
    expect(screen.getByText("Tyranny-Tyler - 9%")).toBeInTheDocument();
    // open menu
    fireEvent.click(screen.getByLabelText("select matchup"));
    expect(screen.getAllByText("Matchup 1")).toHaveLength(3);
    expect(screen.getByText("Truth Booth")).toBeInTheDocument();
    // select item
    fireEvent.click(screen.getByText("Truth Booth"));
    await waitFor(() =>
      expect(screen.getAllByText("Matchup 1")).toHaveLength(1)
    );
    expect(screen.getByText("Truth Booth")).toBeInTheDocument();
    // assign a no match
    fireEvent.click(AAButton);
    fireEvent.click(screen.getByText("No Match"));
    expect(screen.getByText("Tyranny-Tyler - 10%")).toBeInTheDocument();
    // assign a match
    fireEvent.click(CDButton);
    fireEvent.click(screen.getByText("Match"));
    expect(screen.getByText("Tyranny-Tyler - 0%")).toBeInTheDocument();
  });
});
