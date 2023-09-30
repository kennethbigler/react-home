import { render, screen, fireEvent } from "@testing-library/react";
import MurderMystery from "./MurderMystery";

describe("resume | murder-mystery", () => {
  it("renders as expected", () => {
    render(<MurderMystery />);

    expect(
      screen.getByText("Murder at The Grand Cinema Magic Hotel and Casino")
    ).toBeInTheDocument();

    expect(screen.getByText("The Casino Owner")).toBeInTheDocument();
    expect(screen.getByText("The Reporter")).toBeInTheDocument();
    expect(screen.getByText("The Gun Nut")).toBeInTheDocument();
    expect(screen.getByText("The Escort")).toBeInTheDocument();
    expect(
      screen.getByText("The Recently Fired Gladiator Actor")
    ).toBeInTheDocument();
    expect(screen.getByText("The Singing Coach")).toBeInTheDocument();
    expect(screen.getByText("The Bouncer")).toBeInTheDocument();
    expect(screen.getByText("The Second Act")).toBeInTheDocument();
    expect(screen.getByText("The Dancer")).toBeInTheDocument();
    expect(screen.getByText("The Depressed Director")).toBeInTheDocument();
    expect(screen.getByText("The Lawyer")).toBeInTheDocument();
    expect(screen.getByText("The Scuba Diver")).toBeInTheDocument();
    expect(screen.getByText("The Retired Cop")).toBeInTheDocument();
    expect(screen.getByText("The Professor")).toBeInTheDocument();
    expect(screen.getByText("The Owner of the Diner")).toBeInTheDocument();
    expect(screen.getByText("The UFO Conspiracy Nut")).toBeInTheDocument();
    expect(screen.getByText("The Caped Crusader")).toBeInTheDocument();
    expect(screen.getByText("The Librarian")).toBeInTheDocument();
    expect(screen.getByText("The Nearly Famous Author")).toBeInTheDocument();
    expect(
      screen.getByText("The Professional Poker Player")
    ).toBeInTheDocument();

    expect(screen.getAllByText("Required")).toHaveLength(6);
    expect(screen.getAllByText("Recommended")).toHaveLength(3);
    expect(screen.getAllByText("Optional")).toHaveLength(11);

    expect(screen.getAllByText("Gender")).toHaveLength(20);
    expect(screen.getAllByText("Description")).toHaveLength(20);
    expect(screen.getAllByText("Hint")).toHaveLength(19);
    expect(screen.getAllByText("Clue")).toHaveLength(20);

    expect(screen.getAllByText("M/F")).toHaveLength(13);
    expect(screen.getAllByText("M")).toHaveLength(4);
    expect(screen.getAllByText("F")).toHaveLength(3);
  });

  it("handles accordion open and close", () => {
    render(<MurderMystery />);

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
