import { render, screen, fireEvent } from "@testing-library/react";
import getButtonValues from "./table/getButtonValues";
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

  it("can select a couple, change the score, then blackout", () => {
    render(<AreYouTheOne />);

    expect(screen.getByText("Score: -1")).toBeInTheDocument();
    expect(screen.queryByText("0%")).toBeNull();
    fireEvent.click(screen.getAllByText("9%")[0]);
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByText("Score: 0")).toBeInTheDocument();

    fireEvent.click(screen.getByText("+"));
    expect(screen.getByText("Score: 1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Blackout"));
    expect(screen.getByText("Score: 0")).toBeInTheDocument();

    expect(screen.queryByText("0")).toBeNull();
    fireEvent.click(screen.getByText("Show All Couples"));
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("getButtonValues works as expected", () => {
    // isTB and noMatch
    expect(getButtonValues(true, true, false, false, 0)).toEqual({
      color: "error",
      histValue: 0,
      variant: "contained",
    });
    // isTB and match
    expect(getButtonValues(true, false, true, false, 0)).toEqual({
      color: "success",
      histValue: 0,
      variant: "contained",
    });
    // match and isPaired
    expect(getButtonValues(false, false, true, true, 0)).toEqual({
      color: "success",
      histValue: 0,
      variant: "contained",
    });
    // isTB and hist over 0
    expect(getButtonValues(true, false, false, false, 1)).toEqual({
      color: "primary",
      histValue: 1,
      variant: "contained",
    });
    // all false
    expect(getButtonValues(false, false, false, false, 0)).toEqual({
      color: "primary",
      histValue: 0,
      variant: "outlined",
    });
  });
});
