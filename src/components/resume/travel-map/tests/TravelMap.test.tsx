import React from "react";
import { render, screen } from "@testing-library/react";
import TravelTable from "../TravelTable";

describe("resume | travel-map | TravelMap", () => {
  it("renders as expected", () => {
    render(<TravelTable />);

    expect(
      screen.getByText("I have been to 32 countries:")
    ).toBeInTheDocument();
    expect(screen.getByText("The Americas")).toBeInTheDocument();
    expect(screen.getByText("Europe & Africa")).toBeInTheDocument();
    expect(screen.getByText("Asia & Australia")).toBeInTheDocument();
    expect(screen.getByText("Bahamas 🇧🇸")).toBeInTheDocument();
  });
});
