import { screen, fireEvent } from "@testing-library/react";
import render from "../../../recoil-test-render";
import BotC from "./BotC";

describe("games | BotC", () => {
  it("renders as expected", async () => {
    render(<BotC />);

    expect(screen.getByText("BotC")).toBeInTheDocument();
    // Press Players button then close
    fireEvent.click(screen.getByText("Players"));
    expect(screen.getByText("Close")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    // Press Roles button (for Player Dashboard)
    fireEvent.click(screen.getAllByText("Roles")[0]);
    expect(screen.getByText("Chef")).toBeInTheDocument();
    expect(screen.getByText("Monk")).toBeInTheDocument();
    // Select 2 roles
    expect(screen.getAllByText("Chef")).toHaveLength(1);
    fireEvent.click(screen.getByText("Chef"));
    expect(screen.getAllByText("Chef")).toHaveLength(2);
    fireEvent.click(screen.getByText("Monk"));
    expect(screen.getAllByText("Chef")).toHaveLength(1);
    expect(screen.getByText("Chef, Monk")).toBeInTheDocument();
    // Deselect a role
    fireEvent.click(screen.getByText("Monk"));
    expect(screen.getAllByText("Chef")).toHaveLength(2);
  });
});
