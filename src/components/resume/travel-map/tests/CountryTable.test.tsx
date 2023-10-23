import { render, screen } from "@testing-library/react";
import CountryTable from "../CountryTable";

describe("resume | travel-map | TravelMap", () => {
  it("renders as expected", () => {
    render(<CountryTable />);

    expect(
      screen.getByText("I have been to 39 countries:"),
    ).toBeInTheDocument();
    expect(screen.getByText("The Americas")).toBeInTheDocument();
    expect(screen.getByText("Europe & Africa")).toBeInTheDocument();
    expect(screen.getByText("Asia & Australia")).toBeInTheDocument();
    expect(screen.getByText("Bahamas 🇧🇸")).toBeInTheDocument();
  });
});
