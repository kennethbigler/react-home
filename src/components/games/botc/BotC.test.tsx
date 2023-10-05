import { render, screen } from "@testing-library/react";
import BotC from "./BotC";

describe("games | BotC", () => {
  it("renders as expected", () => {
    render(<BotC />);

    expect(screen.getByText("Blood on the Clocktower")).toBeInTheDocument();
  });
});
