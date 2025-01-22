import { render, screen } from "@testing-library/react";
import ImperialAssault from ".";

describe("games | imperial-assault", () => {
  it("renders as expected", () => {
    render(<ImperialAssault />);

    expect(screen.getByText("Imperial Assault")).toBeInTheDocument();
  });
});
