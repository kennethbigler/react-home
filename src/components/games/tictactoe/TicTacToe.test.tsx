import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import render from "../../../redux-test-render";
import TicTacToe from "./TicTacToe";

describe("games | tictactoe | TicTacToe", () => {
  it("renders as expected", () => {
    render(<TicTacToe />);

    expect(screen.getByText("Tic-Tac-Toe")).toBeInTheDocument();
    expect(screen.getByText("Turn: X")).toBeInTheDocument();
    // button 0
    expect(screen.getByText("Reset Game")).toBeInTheDocument();
    // button 1-9 are game buttons
    expect(screen.getAllByRole("button")).toHaveLength(12);
    // button 10
    expect(screen.getByText("Asc")).toBeInTheDocument();
    // button 11
    expect(screen.getByText("Game Start (Turn, Col, Row)")).toBeInTheDocument();
  });

  it("plays the game", () => {
    render(<TicTacToe />);

    // click first move
    expect(screen.queryByText("X")).toBeNull();
    expect(screen.queryByText("Move #1 (X, 0, 0)")).toBeNull();
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(screen.getByText("X")).toBeInTheDocument();
    expect(screen.getByText("Move #1 (X, 0, 0)")).toBeInTheDocument();

    // alternates players
    expect(screen.queryByText("O")).toBeNull();
    expect(screen.queryByText("Move #2 (O, 0, 1)")).toBeNull();
    fireEvent.click(screen.getAllByRole("button")[2]);
    expect(screen.getByText("O")).toBeInTheDocument();
    expect(screen.getByText("Move #2 (O, 0, 1)")).toBeInTheDocument();

    // ignores double clicks
    expect(screen.queryByText("Move #2", { exact: false })).toBeInTheDocument();
    expect(screen.queryByText("Move #3", { exact: false })).toBeNull();
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(screen.queryByText("Move #2", { exact: false })).toBeInTheDocument();
    expect(screen.queryByText("Move #3", { exact: false })).toBeNull();

    // can end the game on win
    expect(screen.getByText("Turn: X")).toBeInTheDocument();
    expect(screen.queryByText("Winner: X")).toBeNull();
    expect(screen.queryAllByText("X")).toHaveLength(1);
    expect(screen.queryAllByText("O")).toHaveLength(1);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[5]);
    fireEvent.click(buttons[3]);
    fireEvent.click(buttons[9]);

    expect(screen.getByText("Winner: X")).toBeInTheDocument();
    expect(screen.queryByText("Turn: X")).toBeNull();
    expect(screen.getAllByText("X")).toHaveLength(3);
    expect(screen.getAllByText("O")).toHaveLength(2);
    expect(screen.getByText("Move #5 (X, 2, 2)")).toBeInTheDocument();

    // it won't allow clicks after victory
    fireEvent.click(buttons[4]);
    expect(screen.getByText("Winner: X")).toBeInTheDocument();
    expect(screen.queryByText("Turn: X")).toBeNull();
    expect(screen.getAllByText("X")).toHaveLength(3);
    expect(screen.getAllByText("O")).toHaveLength(2);

    // it can reset to a new game
    fireEvent.click(buttons[0]);
    expect(screen.getByText("Turn: X")).toBeInTheDocument();
    expect(screen.queryByText("Winner: X")).toBeNull();
    expect(screen.queryAllByText("X")).toHaveLength(0);
    expect(screen.queryAllByText("O")).toHaveLength(0);
    expect(screen.queryByText("Move #5 (X, 2, 2)")).toBeNull();
  });

  it("Can Jump Steps", () => {
    render(<TicTacToe />);

    expect(screen.queryByText("X")).toBeNull();
    expect(screen.queryByText("Move #1 (X, 0, 0)")).toBeNull();
    expect(screen.queryByText("O")).toBeNull();
    expect(screen.queryByText("Move #2 (O, 1, 0)")).toBeNull();

    let buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[4]);

    expect(screen.getByText("X")).toBeInTheDocument();
    // button index 12
    expect(screen.getByText("Move #1 (X, 0, 0)")).toBeInTheDocument();
    expect(screen.getByText("O")).toBeInTheDocument();
    // button index 13
    expect(screen.getByText("Move #2 (O, 1, 0)")).toBeInTheDocument();
    // with the 2 Move buttons available, we should be at 14 now
    buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(14);

    fireEvent.click(buttons[12]);
    expect(screen.getByText("X")).toBeInTheDocument();
    expect(screen.getByText("Move #1 (X, 0, 0)")).toBeInTheDocument();
    // this is the only thing removed
    expect(screen.queryByText("O")).toBeNull();
    expect(screen.getByText("Move #2 (O, 1, 0)")).toBeInTheDocument();

    // double click will remove the ability to go forward in time
    fireEvent.click(buttons[12]);
    expect(screen.getByText("X")).toBeInTheDocument();
    expect(screen.getByText("Move #1 (X, 0, 0)")).toBeInTheDocument();
    expect(screen.queryByText("O")).toBeNull();
    // this is removed now too
    expect(screen.queryByText("Move #2 (O, 1, 0)")).toBeNull();
  });

  it("can change the displayed order of the history", () => {
    render(<TicTacToe />);

    const buttons = screen.getAllByRole("button");
    // populate history
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[4]);

    // button 10
    expect(screen.getByText("Asc")).toBeInTheDocument();
    expect(screen.queryByText("Desc")).toBeNull();
    fireEvent.click(buttons[10]);
    expect(screen.queryByText("Asc")).toBeNull();
    expect(screen.getByText("Desc")).toBeInTheDocument();
  });
});
