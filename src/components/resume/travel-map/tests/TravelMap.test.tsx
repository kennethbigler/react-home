import React from "react";
import { render, screen } from "@testing-library/react";
import TravelTable from "../TravelTable";

describe("resume | travel-map | TravelMap", () => {
  it("renders as expected", () => {
    render(<TravelTable />);

    expect(
      screen.getByText("I have been to 32 countries:")
    ).toBeInTheDocument();
    expect(screen.getByText("North America")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("Bahamas 🇧🇸")).toBeInTheDocument();
  });
});
