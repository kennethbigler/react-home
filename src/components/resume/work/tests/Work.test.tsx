import { render, screen } from "@testing-library/react";
import Work from "..";

describe("resume | work | Work", () => {
  it("renders as expected", () => {
    render(<Work />);

    expect(screen.getByText("Experience")).toBeInTheDocument();

    expect(screen.queryByText("Second Harvest Food Bank")).toBeNull();
    expect(
      screen.getByText("Santa Clara University BS, Santa Clara, CA"),
    ).toBeInTheDocument();

    expect(screen.getByText("work Experience")).toBeInTheDocument();
    expect(screen.getByText("Intuit, Mountain View, CA")).toBeInTheDocument();
    expect(
      screen.getByText("Head of Accessibility Engineering"),
    ).toBeInTheDocument();
    expect(screen.getByText("Frontend Software Engineer")).toBeInTheDocument();

    expect(screen.getByText("volunteer Experience")).toBeInTheDocument();
    expect(
      screen.getByText("Midnight Game Club, Sunnyvale, CA"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Frontend Software Engineer and Project Manager"),
    ).toBeInTheDocument();
  });
});
