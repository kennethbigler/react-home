import { render, screen, fireEvent } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import Header from "./Header";
import bridgeAtom from "../../../../jotai/bridge-atom";

describe("Header Component", () => {
  it("renders title and buttons", () => {
    render(
      <Provider>
        <Header />
      </Provider>,
    );

    expect(screen.getByText("🌉")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /bid/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /score/i })).toBeInTheDocument();
  });

  it("shows Score button initially", () => {
    render(
      <Provider>
        <Header />
      </Provider>,
    );

    expect(screen.getByRole("button", { name: /score/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /new game/i }),
    ).not.toBeInTheDocument();
  });

  it("shows New Game button after 3 games played (gameIdx > 2)", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[120], []],
        [[], [120]],
        [[120], []],
      ],
      bids: [],
      weBelow: [],
      theyBelow: [],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <Header />
      </Provider>,
    );

    expect(
      screen.getByRole("button", { name: /new game/i }),
    ).toBeInTheDocument();
    // Score dialog is still available after 3 games
    expect(screen.getByRole("button", { name: /score/i })).toBeInTheDocument();
  });

  it("shows New Game button when we have 2 wins", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[120], []],
        [[120], []],
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
        <Header />
      </Provider>,
    );

    expect(
      screen.getByRole("button", { name: /new game/i }),
    ).toBeInTheDocument();
  });

  it("shows New Game button when they have 2 wins", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[], [120]],
        [[], [120]],
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
        <Header />
      </Provider>,
    );

    expect(
      screen.getByRole("button", { name: /new game/i }),
    ).toBeInTheDocument();
  });

  it("increments weRubbers when we win (higher score)", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[110], [40]], // We win game 1
        [[120], [50]], // We win game 2 (rubber complete with 2 wins)
        [[], []],
      ],
      bids: [],
      weBelow: [100],
      theyBelow: [50],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <Header />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /new game/i }));

    const state = store.get(bridgeAtom);
    expect(state.weRubbers).toBe(1);
    expect(state.theyRubbers).toBe(0);
  });

  it("increments theyRubbers when they win (higher score)", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[40], [110]], // They win game 1
        [[50], [120]], // They win game 2 (rubber complete with 2 wins)
        [[], []],
      ],
      bids: [],
      weBelow: [50],
      theyBelow: [100],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <Header />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /new game/i }));

    const state = store.get(bridgeAtom);
    expect(state.weRubbers).toBe(0);
    expect(state.theyRubbers).toBe(1);
  });

  it("awards rubber to we when scores are tied and we have more wins", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[120], [50]], // We win game 1
        [[110], [70]], // We win game 2 (rubber complete)
        [[], []],
      ],
      bids: [],
      weBelow: [],
      theyBelow: [10], // Total score tied at 230 each
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <Header />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /new game/i }));

    const state = store.get(bridgeAtom);
    expect(state.weRubbers).toBe(1);
  });

  it("awards rubber to they when scores are tied and they have more wins", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[50], [120]], // They win game 1
        [[70], [110]], // They win game 2 (rubber complete)
        [[], []],
      ],
      bids: [],
      weBelow: [10], // Total score tied at 230 each
      theyBelow: [],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <Header />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /new game/i }));

    const state = store.get(bridgeAtom);
    expect(state.theyRubbers).toBe(1);
  });

  it("awards rubber to we when both score and wins are tied after 3 games", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[110], [50]], // We win game 1
        [[50], [110]], // They win game 2
        [[100], [80]], // We win game 3 (gameIdx > 2, button shows)
      ],
      bids: [],
      weBelow: [],
      theyBelow: [],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <Header />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /new game/i }));

    const state = store.get(bridgeAtom);
    // We have 2 wins (game 1 and 3), they have 1 win (game 2)
    // Total scores: We=260, They=240, so we win on score
    expect(state.weRubbers).toBe(1);
  });

  // Tiebreaker branch (weSum === theySum): weWins >= theyWins → we win
  it("tiebreaker: exact score tie — we win rubber because we have more wins", () => {
    const store = createStore();
    // weWins=2, theyWins=0 → weSum gets +700 rubber bonus.
    // weAbove=400, weBelow=0, +700 = 1100
    // theyAbove=0, theyBelow=1100 = 1100  → perfect tie
    store.set(bridgeAtom, {
      aboveScores: [
        [[200], [0]], // we win game 1 (200 > 0, >= 100): weWins=1
        [[200], [0]], // we win game 2: weWins=2 → button shows
        [[], []],
      ],
      bids: [],
      weBelow: [],
      theyBelow: [1100],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <Header />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /new game/i }));

    const state = store.get(bridgeAtom);
    // weSum === theySum (both 1100), weWins(2) >= theyWins(0) → we win rubber
    expect(state.weRubbers).toBe(1);
    expect(state.theyRubbers).toBe(0);
  });

  // Tiebreaker branch (weSum === theySum): weWins < theyWins → they win
  it("tiebreaker: exact score tie — they win rubber because they have more wins", () => {
    const store = createStore();
    // theyWins=2, weWins=0 → theySum gets +700 rubber bonus.
    // theyAbove=400, theyBelow=0, +700 = 1100
    // weAbove=0, weBelow=1100 = 1100 → perfect tie
    store.set(bridgeAtom, {
      aboveScores: [
        [[0], [200]], // they win game 1: theyWins=1
        [[0], [200]], // they win game 2: theyWins=2 → button shows
        [[], []],
      ],
      bids: [],
      weBelow: [1100],
      theyBelow: [],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <Header />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /new game/i }));

    const state = store.get(bridgeAtom);
    // weSum === theySum (both 1100), weWins(0) < theyWins(2) → they win rubber
    expect(state.weRubbers).toBe(0);
    expect(state.theyRubbers).toBe(1);
  });

  it("resets game state on new game", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[110], [50]], // We win game 1
        [[120], [60]], // We win game 2 (rubber complete)
        [[], []],
      ],
      bids: [],
      weBelow: [50],
      theyBelow: [25],
      weRubbers: 0,
      theyRubbers: 0,
    });

    render(
      <Provider store={store}>
        <Header />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /new game/i }));

    const state = store.get(bridgeAtom);
    expect(state.aboveScores).toEqual([
      [[], []],
      [[], []],
      [[], []],
    ]);
    expect(state.weBelow).toEqual([]);
    expect(state.theyBelow).toEqual([]);
  });

  it("preserves rubber counts through new game", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[110], [50]], // We win game 1
        [[120], [60]], // We win game 2 (rubber complete)
        [[], []],
      ],
      bids: [],
      weBelow: [100],
      theyBelow: [50],
      weRubbers: 2,
      theyRubbers: 1,
    });

    render(
      <Provider store={store}>
        <Header />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /new game/i }));

    const state = store.get(bridgeAtom);
    expect(state.weRubbers).toBe(3); // 2 + 1 from winning
    expect(state.theyRubbers).toBe(1); // unchanged
  });
});
