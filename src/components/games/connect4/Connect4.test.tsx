import { screen, fireEvent } from "@testing-library/react";
import render from "../../../recoil-test-render";
import Connect4 from "./Connect4";

describe("games | connect4 | Connect4", () => {
  it("renders as expected", () => {
    render(<Connect4 />);

    expect(
      screen.getByText("Welcome to Ken's Connect4 Game")
    ).toBeInTheDocument();
    expect(screen.getByText("Turn:")).toBeInTheDocument();
    // get buttons only once to save time
    const buttons = screen.getAllByRole("button");
    // button 0, should be red because they goes first
    expect(buttons[0]).toHaveStyle({ backgroundColor: "rgb(244, 67, 54)" });
    // button 1
    expect(screen.getByText("Reset Game")).toBeInTheDocument();
    // button 2-8 are to play the game
    expect(buttons[2]).toHaveStyle({ backgroundColor: "rgb(244, 67, 54)" });
    expect(buttons[8]).toHaveStyle({ backgroundColor: "rgb(244, 67, 54)" });
    // 9-51 are for display
    expect(buttons).toHaveLength(51);
  });

  it("plays a piece and can reset after", () => {
    render(<Connect4 />);

    let buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveStyle({ backgroundColor: "rgb(244, 67, 54)" });
    expect(buttons[2]).toHaveStyle({ backgroundColor: "rgb(244, 67, 54)" });
    expect(buttons[8]).toHaveStyle({ backgroundColor: "rgb(244, 67, 54)" });
    expect(buttons[44]).not.toHaveStyle({
      backgroundColor: "rgb(244, 67, 54)",
    });

    fireEvent.click(buttons[2]);
    buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveStyle({ backgroundColor: "black" });
    expect(buttons[2]).toHaveStyle({ backgroundColor: "black" });
    expect(buttons[8]).toHaveStyle({ backgroundColor: "black" });
    expect(buttons[44]).toHaveStyle({ backgroundColor: "rgb(244, 67, 54)" });

    fireEvent.click(screen.getByText("Reset Game"));
    buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveStyle({ backgroundColor: "rgb(244, 67, 54)" });
    expect(buttons[2]).toHaveStyle({ backgroundColor: "rgb(244, 67, 54)" });
    expect(buttons[8]).toHaveStyle({ backgroundColor: "rgb(244, 67, 54)" });
    expect(buttons[44]).not.toHaveStyle({
      backgroundColor: "rgb(244, 67, 54)",
    });
  });

  it("marks the winner", () => {
    render(<Connect4 />);

    expect(screen.getByText("Turn:")).toBeInTheDocument();
    expect(screen.getAllByRole("button")[0]).toHaveStyle({
      backgroundColor: "rgb(244, 67, 54)",
    });

    fireEvent.click(screen.getByText("Reset Game"));

    let buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[2]);
    fireEvent.click(buttons[3]);
    fireEvent.click(buttons[2]);
    fireEvent.click(buttons[3]);
    fireEvent.click(buttons[2]);
    fireEvent.click(buttons[3]);
    buttons = screen.getAllByRole("button");
    expect(buttons[44]).toHaveStyle("background-color: rgb(244, 67, 54)");
    fireEvent.click(buttons[2]);

    expect(screen.getByText("Winner:")).toBeInTheDocument();
    buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveStyle({ backgroundColor: "rgb(244, 67, 54)" });
    expect(buttons[44]).toHaveStyle("background-color: rgb(124, 179, 66);");
  });

  it("recognizes 5 in a row", () => {
    render(<Connect4 />);

    fireEvent.click(screen.getByText("Reset Game"));

    expect(screen.getByText("Turn:")).toBeInTheDocument();
    expect(screen.getAllByRole("button")[0]).toHaveStyle({
      backgroundColor: "rgb(244, 67, 54)",
    });

    let buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[2]);
    fireEvent.click(buttons[2]);
    fireEvent.click(buttons[3]);
    fireEvent.click(buttons[3]);
    fireEvent.click(buttons[4]);
    fireEvent.click(buttons[4]);
    fireEvent.click(buttons[6]);
    fireEvent.click(buttons[6]);
    buttons = screen.getAllByRole("button");
    expect(buttons[44]).toHaveStyle("background-color: rgb(244, 67, 54)");
    fireEvent.click(buttons[5]);

    expect(screen.getByText("Winner:")).toBeInTheDocument();
    buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveStyle({ backgroundColor: "rgb(244, 67, 54)" });
    expect(buttons[44]).toHaveStyle("background-color: rgb(124, 179, 66);");
  });
});
