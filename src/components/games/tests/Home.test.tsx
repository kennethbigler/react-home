import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../Home";

describe("games | Home", () => {
  it("renders as expected", () => {
    render(<Home />);

    expect(screen.getByText("ReactJS Games")).toBeInTheDocument();
    expect(
      screen.getByText("This site was created to learn, check out the")
    ).toBeInTheDocument();
    expect(screen.getByText("<source code/>")).toBeInTheDocument();
  });
});
