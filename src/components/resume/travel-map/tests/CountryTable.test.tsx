import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import CountryTable from "../CountryTable";

describe("resume | travel-map | TravelMap", () => {
  it("passes axe", async () => {
    const { container } = render(<CountryTable />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders as expected", () => {
    render(<CountryTable />);

    expect(
      screen.getByText("I have been to 35 countries:")
    ).toBeInTheDocument();
    expect(screen.getByText("The Americas")).toBeInTheDocument();
    expect(screen.getByText("Europe & Africa")).toBeInTheDocument();
    expect(screen.getByText("Asia & Australia")).toBeInTheDocument();
    expect(screen.getByText("Bahamas 🇧🇸")).toBeInTheDocument();
  });
});