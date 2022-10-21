import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import render from "../../../../recoil-test-render";
import Yahtzee from "../Yahtzee";

describe("games | yahtzee | Yahtzee", () => {
  it("renders as expected", async () => {
    const { container } = render(<Yahtzee />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();

    expect(screen.getAllByText("Yahtzee")).toHaveLength(2);
    // button 0
    expect(screen.getByText("Score History")).toBeInTheDocument();
    expect(screen.getByText("Roll #0/3")).toBeInTheDocument();
    // button 1-5 are game dice
    expect(screen.getAllByRole("button")).toHaveLength(7);
    // button 6
    expect(screen.getByText("First Roll")).toBeInTheDocument();
    expect(screen.getByText("Total: 0")).toBeInTheDocument();
    expect(screen.getByText("Minimum Required for Bonus")).toBeInTheDocument();
    expect(screen.getByText("Aces: 1,1,1 = 3")).toBeInTheDocument();
    expect(screen.getByText("Twos: 2,2,2 = 6")).toBeInTheDocument();
    expect(screen.getByText("Threes: 3,3,3 = 9")).toBeInTheDocument();
    expect(screen.getByText("Fours: 4,4,4 = 12")).toBeInTheDocument();
    expect(screen.getByText("Fives: 5,5,5 = 15")).toBeInTheDocument();
    expect(screen.getByText("Sixes: 6,6,6 = 18")).toBeInTheDocument();
    expect(screen.getByText("Total == 63")).toBeInTheDocument();
    expect(screen.getByText("Bonus if >= 63")).toBeInTheDocument();
    expect(screen.getAllByText("Upper Half Total")).toHaveLength(2);
    expect(screen.getByText("3 of a kind")).toBeInTheDocument();
    expect(screen.getByText("4 of a kind")).toBeInTheDocument();
    expect(screen.getByText("Full House")).toBeInTheDocument();
    expect(screen.getByText("Sm. Straight (4)")).toBeInTheDocument();
    expect(screen.getByText("Lg. Straight (5)")).toBeInTheDocument();
    expect(screen.getByText("Chance")).toBeInTheDocument();
    expect(screen.getByText("Lower Half Total")).toBeInTheDocument();
    expect(screen.getByText("Grand Total")).toBeInTheDocument();
  });

  it("plays the game", () => {
    const { container } = render(<Yahtzee />);

    // --------------------     saves and un-saves a dice     -------------------- //
    // baseline
    expect(
      container.querySelectorAll(".MuiButton-outlinedSecondary")
    ).toHaveLength(5);
    expect(
      container.querySelectorAll(".MuiButton-containedPrimary")
    ).toHaveLength(2);

    // it doesn't save if dice aren't ready
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(
      container.querySelectorAll(".MuiButton-outlinedSecondary")
    ).toHaveLength(5);
    expect(
      container.querySelectorAll(".MuiButton-containedPrimary")
    ).toHaveLength(2);

    // roll the dice
    fireEvent.click(screen.getByText("First Roll"));
    expect(
      container.querySelectorAll(".MuiButton-outlinedSecondary")
    ).toHaveLength(18);
    expect(
      container.querySelectorAll(".MuiButton-containedPrimary")
    ).toHaveLength(2);

    // save the first button
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(
      container.querySelectorAll(".MuiButton-outlinedSecondary")
    ).toHaveLength(17);
    expect(
      container.querySelectorAll(".MuiButton-containedPrimary")
    ).toHaveLength(3);

    // un-save the first button
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(
      container.querySelectorAll(".MuiButton-outlinedSecondary")
    ).toHaveLength(18);
    expect(
      container.querySelectorAll(".MuiButton-containedPrimary")
    ).toHaveLength(2);

    // --------------------     saves to the top half scores     -------------------- //
    // do the next 2 rolls, then try to do the 4th
    fireEvent.click(screen.getByText("Second Roll"));
    fireEvent.click(screen.getByText("Last Roll"));
    fireEvent.click(screen.getByText("Score"));
    // the 4th click will not work
    expect(screen.getByText("Score")).toBeInTheDocument();
    // so instead we pick our score
    fireEvent.click(screen.getAllByText("0")[0]);
    // now Score should be gone
    expect(screen.queryByText("Score")).toBeNull();
    // 1 zero should have been added to the UI
    expect(screen.getAllByText("0")).toHaveLength(12);
    // and adds to the bottom score
    fireEvent.click(screen.getByText("First Roll"));
    fireEvent.click(screen.getByText("Second Roll"));
    fireEvent.click(screen.getByText("Last Roll"));
    const buttons = screen.getAllByRole("button");
    const chanceButton = buttons[buttons.length - 1];
    fireEvent.click(chanceButton);
    const textContent = chanceButton.textContent || [
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
    ];
    const submittedValue = parseInt(textContent[4] + textContent[5], 10);
    expect(screen.getAllByText(`${submittedValue}`)).toHaveLength(3);
  });
});
