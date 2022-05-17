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

  // it("can process a round", async () => {
  //   render(<AreYouTheOne />);

  //   // select Table Matchups
  //   fireEvent.click(screen.getByText("A-A"));
  //   await waitFor(() => TODO: wait for this to change to primary color);
  //   expect(something?).toBeInTheDocument();
  // });
});
