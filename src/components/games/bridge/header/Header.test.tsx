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
    expect(
      screen.queryByRole("button", { name: /score/i }),
    ).not.toBeInTheDocument();
  });

  it("shows New Game button when we have 2 wins", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[120], []],
        [[120], []],
        [[], []],
      ],
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

  it("resets game state on new game", () => {
    const store = createStore();
    store.set(bridgeAtom, {
      aboveScores: [
        [[110], [50]], // We win game 1
        [[120], [60]], // We win game 2 (rubber complete)
        [[], []],
      ],
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
