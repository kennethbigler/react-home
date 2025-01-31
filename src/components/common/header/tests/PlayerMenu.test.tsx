import { render, fireEvent, screen } from "@testing-library/react";
import PlayerMenu from "../PlayerMenu";

describe("common | header | PlayerMenu", () => {
  it("renders expected text", () => {
    render(<PlayerMenu />);
    // open menu
    expect(screen.getByText("Players")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Players"));
    // test menu
    expect(screen.getByText("Edit Player Names")).toBeInTheDocument();
    expect(screen.getByText("Is Bot?")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("Enter Player Name")).toBeDefined();
    expect(screen.getByTitle("player 0 name")).toBeInTheDocument();
  });

  it("performs onToggle", () => {
    render(<PlayerMenu />);

    // open menu
    expect(screen.getByText("Players")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Players"));

    // test menu
    const BotTog = screen
      .getByTitle("isBot-switch-0")
      .querySelector(".MuiSwitch-input");

    // verify it renders properly
    expect(BotTog).toBeInTheDocument();
    expect(BotTog?.attributes?.getNamedItem("value")?.value).toEqual("false");

    // click the expected element and confirm toggle
    fireEvent.click(BotTog || screen.getByTitle("isBot-switch-0"));
    expect(BotTog?.attributes?.getNamedItem("value")?.value).toEqual("true");

    // confirm it can toggle back to false
    fireEvent.click(BotTog || screen.getByTitle("isBot-switch-0"));
    expect(BotTog?.attributes?.getNamedItem("value")?.value).toEqual("false");
  });

  it("performs name update onKeyPress", () => {
    render(<PlayerMenu />);

    // open menu
    expect(screen.getByText("Players")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Players"));

    // verify it renders properly
    expect(screen.getByDisplayValue("Ken")).toBeInTheDocument();

    // click the expected element
    fireEvent.click(screen.getByDisplayValue("Ken"));
    fireEvent.change(screen.getByDisplayValue("Ken"), {
      target: { value: "Kenny" },
    });
    fireEvent.blur(screen.getByDisplayValue("Kenny"));
    fireEvent.click(screen.getByText("Edit Player Names"));

    expect(screen.getByDisplayValue("Kenny")).toBeInTheDocument();
  });
});
