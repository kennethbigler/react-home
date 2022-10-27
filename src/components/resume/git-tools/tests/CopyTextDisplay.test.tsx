import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CopyTextDisplay from "../CopyTextDisplay";

describe("resume | git-tools | CopyTextDisplay", () => {
  it("renders as expected", () => {
    const handleCopy = jest.fn();
    render(<CopyTextDisplay handleCopy={handleCopy} text="Copy this text" />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Copy this text")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Copy this text"));
    expect(handleCopy).toHaveBeenCalledWith("Copy this text");
  });

  it("handles alternative copy text", () => {
    const handleCopy = jest.fn();
    render(
      <CopyTextDisplay
        handleCopy={handleCopy}
        text="Copy this text"
        copyText="No, copy this instead"
      />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Copy this text")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Copy this text"));
    expect(handleCopy).toHaveBeenCalledWith("No, copy this instead");
  });
});
