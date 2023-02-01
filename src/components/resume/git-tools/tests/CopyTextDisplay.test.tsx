import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CopyTextDisplay from "../CopyTextDisplay";

describe("resume | git-tools | CopyTextDisplay", () => {
  it("renders as expected", () => {
    render(<CopyTextDisplay text="Copy this text" />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Copy this text")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Copy this text"));
    expect(
      screen.getByText("Copied Commit Text to clipboard!")
    ).toBeInTheDocument();
  });
});
