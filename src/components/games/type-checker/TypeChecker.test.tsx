import React from "react";
import { render, screen } from "@testing-library/react";
import TypeChecker from "./TypeChecker";

describe("resume | type-checker", () => {
  it("renders as expected", () => {
    render(<TypeChecker />);

    expect(screen.getByText("Type Checker")).toBeInTheDocument();
  });
});
