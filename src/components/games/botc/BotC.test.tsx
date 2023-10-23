import { screen, fireEvent } from "@testing-library/react";
import render from "../../../recoil-test-render";
import BotC from "./BotC";

describe("games | BotC", () => {
  it("renders as expected", () => {
    render(<BotC />);

    expect(screen.getByText("BotC")).toBeInTheDocument();
    // Press Players button then close
    fireEvent.click(screen.getByText("Players"));
    expect(screen.getByText("Close")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    // Press Roles button (for Player Dashboard)
    fireEvent.click(screen.getAllByText("Ken")[0]);
    expect(screen.getByText("Chef")).toBeInTheDocument();
    expect(screen.getByText("Monk")).toBeInTheDocument();
    // Select 2 roles
    expect(screen.getAllByText("Chef")).toHaveLength(1);
    fireEvent.click(screen.getByText("Chef"));
    expect(screen.getAllByText("Chef")).toHaveLength(2);
    fireEvent.click(screen.getByText("Monk"));
    expect(screen.getAllByText("Monk")).toHaveLength(2);
    // Deselect a role
    fireEvent.click(screen.getAllByText("Monk")[1]);
    expect(screen.getAllByText("Monk")).toHaveLength(1);
    expect(screen.getAllByText("Chef")).toHaveLength(2);
  });
});
