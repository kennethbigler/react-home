import { render, screen, fireEvent } from "@testing-library/react";
import Werewolf from "./Werewolf";

describe("games | werewolf", () => {
  it("renders as expected", () => {
    render(<Werewolf />);

    expect(screen.getByText("Villagers")).toBeInTheDocument();
    expect(screen.getByText("Outsiders")).toBeInTheDocument();
    expect(screen.getByText("Wolves")).toBeInTheDocument();
  });

  it("handles accordion open and close", () => {
    render(<Werewolf />);

    expect(screen.getAllByRole("button")[0]).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getAllByRole("button")[0]).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getAllByRole("button")[0]).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
