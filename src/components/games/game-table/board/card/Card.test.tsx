import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Card from "./Card";

describe("games | game-table | Card", () => {
  it("renders as expected", () => {
    render(
      <Card cardNo={1} dropped handNo={2} name="K" playerNo={3} suit="O" />,
    );

    expect(screen.getByText("KO")).toBeInTheDocument();
    expect(screen.getByText("O")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveStyle({
      backgroundColor: "rgb(255, 205, 210)",
    });
  });

  it("calls cardHandler with correct args when clicked (line 28 true branch)", () => {
    const handler = vi.fn();
    render(
      <Card
        cardNo={2}
        dropped={false}
        handNo={1}
        name="A"
        playerNo={0}
        suit="♠"
        cardHandler={handler}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handler).toHaveBeenCalledWith(0, 1, 2);
  });

  it("does not throw when clicked without cardHandler (line 28 false branch)", () => {
    render(
      <Card
        cardNo={0}
        dropped={false}
        handNo={0}
        name="2"
        playerNo={1}
        suit="♣"
      />,
    );
    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
  });
});
