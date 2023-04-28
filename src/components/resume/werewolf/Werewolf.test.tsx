import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import Werewolf from "./Werewolf";

describe("games | werewolf", () => {
  it("passes axe", async () => {
    const { container } = render(<Werewolf />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders as expected", () => {
    render(<Werewolf />);

    expect(screen.getByText("Werewolf")).toBeInTheDocument();
  });

  it("handles accordion open and close", () => {
    render(<Werewolf />);

    expect(screen.getAllByRole("button")[0]).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getAllByRole("button")[0]).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getAllByRole("button")[0]).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});
