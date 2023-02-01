import * as React from "react";
import { render, screen } from "@testing-library/react";
import CopyTextDisplay from "../CopyTextDisplay";

describe("resume | git-tools | CopyTextDisplay", () => {
  it("renders as expected", () => {
    render(<CopyTextDisplay text="Copy this text" />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getAllByText("Copy this text")).toHaveLength(1);
  });
});
