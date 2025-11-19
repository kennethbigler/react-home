import { render, screen } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import ScoreDisplay from "./ScoreDisplay";
import bridgeAtom from "../../../jotai/bridge-atom";

describe("ScoreDisplay Component", () => {
  it("renders initial empty score table", () => {
    render(
      <Provider>
        <ScoreDisplay />
      </Provider>,
    );

    expect(screen.getByText("We")).toBeInTheDocument();
    expect(screen.getByText("They")).toBeInTheDocument();
    expect(screen.getAllByText("Total: 0")).toHaveLength(2); // One for each team
    expect(screen.getAllByText("Wins: 0")).toHaveLength(2); // One for each team
  });

  it("displays vulnerability indicator when we have won a game", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[120], []], // We won first game (>100)
        [[], []],
        [[], []],
      ],
      weBelow: [],
      theyBelow: [],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <ScoreDisplay />
      </Provider>,
    );

    expect(screen.getByText(/We 🥇/)).toBeInTheDocument();
  });

  it("displays vulnerability indicator when they have won a game", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[], [120]], // They won first game (>100)
        [[], []],
        [[], []],
      ],
      weBelow: [],
      theyBelow: [],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <ScoreDisplay />
      </Provider>,
    );

    expect(screen.getByText(/They 🥇/)).toBeInTheDocument();
  });

  it("displays scores above and below the line", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[40], [30]], // Above the line scores
        [[], []],
        [[], []],
      ],
      weBelow: [50], // Below the line score
      theyBelow: [25],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <ScoreDisplay />
      </Provider>,
    );

    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("Total: 90")).toBeInTheDocument(); // 40 + 50
    expect(screen.getByText("Total: 55")).toBeInTheDocument(); // 30 + 25
  });

  it("displays multiple scores in same game", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [
          [20, 30, 40],
          [15, 25],
        ], // Multiple scores
        [[], []],
        [[], []],
      ],
      weBelow: [],
      theyBelow: [],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <ScoreDisplay />
      </Provider>,
    );

    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("displays rubber wins", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[], []],
        [[], []],
        [[], []],
      ],
      weBelow: [],
      theyBelow: [],
      weRubbers: 2,
      theyRubbers: 1,
    });

    render(
      <Provider store={store}>
        <ScoreDisplay />
      </Provider>,
    );

    expect(screen.getByText("Wins: 2")).toBeInTheDocument();
    expect(screen.getByText("Wins: 1")).toBeInTheDocument();
  });

  it("displays multiple games with scores", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[100], [80]],
        [[60], [120]],
        [[40], []],
      ],
      weBelow: [10, 20],
      theyBelow: [15],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <ScoreDisplay />
      </Provider>,
    );

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
  });

  it("correctly reverses the order of above the line scores", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[20], []],
        [[40], []],
        [[60], []],
      ],
      weBelow: [],
      theyBelow: [],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <ScoreDisplay />
      </Provider>,
    );

    // Should display all three scores
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
  });

  it("handles empty arrays correctly", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[], []],
        [[], []],
        [[], []],
      ],
      weBelow: [],
      theyBelow: [],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <ScoreDisplay />
      </Provider>,
    );

    expect(screen.getAllByText("Total: 0")).toHaveLength(2); // One for each team
  });
});
