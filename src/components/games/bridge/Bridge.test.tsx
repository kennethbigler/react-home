import { render, screen, fireEvent } from "@testing-library/react";
import Bridge from ".";

describe("common | Bridge", () => {
  it("renders as expected", () => {
    render(<Bridge />);
    expect(screen.getByText("🌉")).toBeInTheDocument();

    expect(screen.queryByText("Scoring Table")).toBeNull();
    fireEvent.click(screen.getByText("Score"));
    expect(screen.getByText("Scoring Table")).toBeInTheDocument();

    expect(screen.queryByText("Bridge Bidding Cheat Sheet Page 1")).toBeNull();
    fireEvent.click(screen.getByText("Bid"));
    expect(
      screen.getByAltText("Bridge Bidding Cheat Sheet Page 1"),
    ).toBeInTheDocument();
  });
});
