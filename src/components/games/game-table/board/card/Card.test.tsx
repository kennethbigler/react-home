import { render, screen } from "@testing-library/react";
import Card from "./Card";

describe("games | game-table | Card", () => {
  it("renders as expected", () => {
    render(
      <Card cardNo={1} dropped handNo={2} name="K" playerNo={3} suit="O" />,
    );

    expect(screen.getByText("KO")).toBeInTheDocument();
    expect(screen.getByText("O")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveStyle({
      backgroundColor: "rgb(255, 205, 210)",
    });
  });
});
