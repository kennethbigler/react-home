import { screen } from "@testing-library/react";
import render from "../../../recoil-test-render";
import BotC from "./BotC";

describe("games | BotC", () => {
  it("renders as expected", () => {
    render(<BotC />);

    expect(screen.getByText("BotC")).toBeInTheDocument();
  });
});
