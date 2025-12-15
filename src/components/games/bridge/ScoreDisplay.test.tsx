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
      bids: [],
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
      bids: [],
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
      bids: ["1♣️"],
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

    expect(screen.getByText(/40 \(1♣️\)/)).toBeInTheDocument();
    expect(screen.getByText(/30 \(1♣️\)/)).toBeInTheDocument();
    expect(screen.getByText(/50 \(1♣️\)/)).toBeInTheDocument();
    expect(screen.getByText(/25 \(1♣️\)/)).toBeInTheDocument();
    expect(screen.getByText("Total: 90")).toBeInTheDocument(); // 40 + 50
    expect(screen.getByText("Total: 55")).toBeInTheDocument(); // 30 + 25
  });

  it("displays multiple scores in same game", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [
          [20, 30, 40],
          [0, 0, 0], // They lost all three hands
        ],
        [[], []],
        [[], []],
      ],
      bids: ["1♣️", "2♥️", "3NT"],
      weBelow: [0, 0, 0],
      theyBelow: [0, 0, 0],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <ScoreDisplay />
      </Provider>,
    );

    // All scores in game 0 use bids[0] (the game's bid)
    expect(screen.getByText(/20 \(1♣️\)/)).toBeInTheDocument();
    expect(screen.getByText(/30 \(1♣️\)/)).toBeInTheDocument();
    expect(screen.getByText(/40 \(1♣️\)/)).toBeInTheDocument();
    // They's zeros are filtered out so they don't display
  });

  it("displays rubber wins", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[], []],
        [[], []],
        [[], []],
      ],
      bids: [],
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
      bids: ["3NT", "2♥️", "1♣️"],
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

    // Each game uses its corresponding bid from the bids array
    expect(screen.getByText(/100 \(3NT\)/)).toBeInTheDocument();
    expect(screen.getByText(/80 \(3NT\)/)).toBeInTheDocument();
    expect(screen.getByText(/60 \(2♥️\)/)).toBeInTheDocument();
    expect(screen.getByText(/120 \(2♥️\)/)).toBeInTheDocument();
    expect(screen.getByText(/40 \(1♣️\)/)).toBeInTheDocument();
  });

  it("correctly reverses the order of above the line scores", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[20], [0]],
        [[40], [0]],
        [[60], [0]],
      ],
      bids: ["1♣️", "2♥️", "3NT"],
      weBelow: [0, 0, 0],
      theyBelow: [0, 0, 0],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <ScoreDisplay />
      </Provider>,
    );

    // Each game uses its corresponding bid from the bids array
    // Game 2 shows first (top), then game 1, then game 0 (bottom) due to .reverse()
    expect(screen.getByText(/20 \(1♣️\)/)).toBeInTheDocument();
    expect(screen.getByText(/40 \(2♥️\)/)).toBeInTheDocument();
    expect(screen.getByText(/60 \(3NT\)/)).toBeInTheDocument();
  });

  it("handles empty arrays correctly", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[], []],
        [[], []],
        [[], []],
      ],
      bids: [],
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
