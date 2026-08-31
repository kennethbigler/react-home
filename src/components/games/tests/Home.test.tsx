import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Home from "../Home";

describe("games | Home", () => {
  const renderHome = () =>
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

  it("renders as expected", () => {
    renderHome();

    expect(screen.getAllByText("Games")).toHaveLength(2);
    expect(
      screen.getByText("This site was created to learn, check out the"),
    ).toBeInTheDocument();
    expect(screen.getByText("<source code/>")).toBeInTheDocument();
  });

  it("links each game card to its route", () => {
    renderHome();

    const links = screen.getAllByRole("link", { name: /open/i });
    expect(links.length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: "Open BlackJack" }),
    ).toHaveAttribute("href", "/games/blackjack");
  });
});
