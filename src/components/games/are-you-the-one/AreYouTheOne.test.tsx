import { screen, fireEvent, waitFor } from "@testing-library/react";
import render from "../../../recoil-test-render";
import AreYouTheOne from "./AreYouTheOne";

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

    // Set Season to 5 (so I don't need to update tests)
    expect(screen.getByLabelText("select season")).toBeInTheDocument();
    expect(screen.getByText("Season 9")).toBeInTheDocument();
    expect(screen.queryByText("Season 5")).toBeNull();
    // open menu
    fireEvent.click(screen.getByLabelText("select season"));
    expect(screen.getAllByText("Season 9")).toHaveLength(2);
    expect(screen.getByText("Season 5")).toBeInTheDocument();
    // select item
    fireEvent.click(screen.getByText("Season 5"));
    await waitFor(() => expect(screen.queryByText("Season 9")).toBeNull());
    expect(screen.getByText("Season 5")).toBeInTheDocument();

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
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getAllByText("-")[0]);
    expect(screen.getByText("Tyranny-Tyler - 9%")).toBeInTheDocument();
    // open menu
    fireEvent.click(screen.getByLabelText("select matchup"));
    expect(screen.getAllByText("Matchup 1")).toHaveLength(3);
    expect(screen.getByText("Truth Booth")).toBeInTheDocument();
    // select item
    fireEvent.click(screen.getByText("Truth Booth"));
    await waitFor(() =>
      expect(screen.getAllByText("Matchup 1")).toHaveLength(1),
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

  it("can blackout", async () => {
    render(<AreYouTheOne />);

    // Set Season to 5 (so I don't need to update tests)
    expect(screen.getByLabelText("select season")).toBeInTheDocument();
    expect(screen.getByText("Season 9")).toBeInTheDocument();
    expect(screen.queryByText("Season 5")).toBeNull();
    // open menu
    fireEvent.click(screen.getByLabelText("select season"));
    expect(screen.getAllByText("Season 9")).toHaveLength(2);
    expect(screen.getByText("Season 5")).toBeInTheDocument();
    // select item
    fireEvent.click(screen.getByText("Season 5"));
    await waitFor(() => expect(screen.queryByText("Season 9")).toBeNull());
    expect(screen.getByText("Season 5")).toBeInTheDocument();

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
    fireEvent.click(screen.getByText("Blackout"));
    expect(AAButton).toHaveClass("MuiButton-containedError");
    expect(CDButton).toHaveClass("MuiButton-containedError");
    expect(CEButton).toHaveClass("MuiButton-containedError");
    expect(GHButton).toHaveClass("MuiButton-containedError");
    expect(HJButton).toHaveClass("MuiButton-containedError");
    expect(KJButton).toHaveClass("MuiButton-containedError");
    expect(KM1Button).toHaveClass("MuiButton-containedError");
    expect(KM2Button).toHaveClass("MuiButton-containedError");
    expect(SOButton).toHaveClass("MuiButton-containedError");
    expect(TOButton).toHaveClass("MuiButton-containedError");
    expect(TTButton).toHaveClass("MuiButton-containedError");
  });

  it("can change couples to match or no match via truth booth", async () => {
    render(<AreYouTheOne />);

    // Set Season to 5 (so I don't need to update tests)
    expect(screen.getByLabelText("select season")).toBeInTheDocument();
    expect(screen.getByText("Season 9")).toBeInTheDocument();
    expect(screen.queryByText("Season 5")).toBeNull();
    // open menu
    fireEvent.click(screen.getByLabelText("select season"));
    expect(screen.getAllByText("Season 9")).toHaveLength(2);
    expect(screen.getByText("Season 5")).toBeInTheDocument();
    // select item
    fireEvent.click(screen.getByText("Season 5"));
    await waitFor(() => expect(screen.queryByText("Season 9")).toBeNull());
    expect(screen.getByText("Season 5")).toBeInTheDocument();

    // Set matchup to Truth Booth
    expect(screen.getByLabelText("select matchup")).toBeInTheDocument();
    expect(screen.getByText("Matchup 1")).toBeInTheDocument();
    expect(screen.queryByText("Truth Booth")).toBeNull();
    // open menu
    fireEvent.click(screen.getByLabelText("select matchup"));
    expect(screen.getByText("Truth Booth")).toBeInTheDocument();
    // select item
    fireEvent.click(screen.getByText("Truth Booth"));
    await waitFor(() => expect(screen.queryByText("Matchup 1")).toBeNull());
    expect(screen.getByText("Truth Booth")).toBeInTheDocument();

    const AAButton = screen.getByText("A-A");
    const ADButton = screen.getByText("A-D");
    const CDButton = screen.getAllByText("C-D")[0];
    const CEButton = screen.getAllByText("C-E")[1];

    // test match
    expect(AAButton).toHaveClass("MuiButton-outlined");
    fireEvent.click(AAButton);
    fireEvent.click(screen.getByText("Match"));
    expect(AAButton).toHaveClass("MuiButton-containedSuccess");
    // verify other pairs for these people got no match
    expect(ADButton).toHaveClass("MuiButton-containedError");

    // test no match
    expect(CDButton).toHaveClass("MuiButton-outlined");
    fireEvent.click(CDButton);
    fireEvent.click(screen.getByText("No Match"));
    expect(CDButton).toHaveClass("MuiButton-containedError");

    // test cancel
    expect(CEButton).toHaveClass("MuiButton-outlined");
    fireEvent.click(CEButton);
    fireEvent.click(screen.getByText("Cancel"));
    expect(CEButton).toHaveClass("MuiButton-outlined");
  });
});
