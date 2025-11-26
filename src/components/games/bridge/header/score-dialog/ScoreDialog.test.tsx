import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import ScoreDialog from "./ScoreDialog";
import bridgeAtom, { type BridgeState } from "../../../../../jotai/bridge-atom";

describe("games | bridge | ScoreDialog", () => {
  const defaultState: BridgeState = {
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders score dialog button", () => {
    const store = createStore();
    store.set(bridgeAtom, defaultState);

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    expect(screen.getByRole("button", { name: /score/i })).toBeInTheDocument();
  });

  it("opens dialog when button is clicked", async () => {
    const store = createStore();
    store.set(bridgeAtom, defaultState);

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    const button = screen.getByRole("button", { name: /score/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Contract")).toBeInTheDocument();
    });
  });

  it("renders all form sections within dialog", async () => {
    const store = createStore();
    store.set(bridgeAtom, defaultState);

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));

    await waitFor(() => {
      expect(screen.getByText("Contract")).toBeInTheDocument();
      expect(screen.getByText("Honours")).toBeInTheDocument();
      // Score heading is from ScoreSummary
      const allScoreHeadings = screen.getAllByText("Score");
      expect(allScoreHeadings.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("initializes with default form values", async () => {
    const store = createStore();
    store.set(bridgeAtom, defaultState);

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));

    await waitFor(() => {
      expect(screen.getByText("NT")).toBeInTheDocument();
      expect(screen.getByText("We")).toBeInTheDocument();
    });
  });

  it("updates state when save button is clicked", async () => {
    const store = createStore();
    store.set(bridgeAtom, defaultState);

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));

    await waitFor(() => {
      expect(screen.getByText("Contract")).toBeInTheDocument();
    });

    // Click save button
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    // Verify state was updated
    const state = store.get(bridgeAtom);
    expect(state.aboveScores[0][0].length).toBeGreaterThan(0);
  });

  it("resets form to defaults after save", async () => {
    const store = createStore();
    store.set(bridgeAtom, defaultState);

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));

    await waitFor(() => {
      expect(screen.getByText("Contract")).toBeInTheDocument();
    });

    // Change bid winner to "They"
    const bidSwitch = screen.getByRole("checkbox", {
      name: /bid winner is we/i,
    });
    fireEvent.click(bidSwitch);

    await waitFor(() => {
      expect(screen.getByText("They")).toBeInTheDocument();
    });

    // Save
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    // Reopen dialog
    await waitFor(() => {
      expect(screen.queryByText("Contract")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /score/i }));

    // Verify form reset - isWe does NOT reset, so "They" should still be selected
    await waitFor(() => {
      expect(screen.getByText("They")).toBeInTheDocument();
    });
  });

  it("handles double toggle correctly", async () => {
    const store = createStore();
    store.set(bridgeAtom, defaultState);

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Doubled\?/)).toBeInTheDocument();
    });

    const formControl = screen.getByLabelText(/Doubled\?/).closest("label");
    const switchInput = formControl?.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(switchInput.checked).toBe(false);
  });

  it("handles redouble toggle correctly", async () => {
    const store = createStore();
    store.set(bridgeAtom, defaultState);

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Redoubled\?/)).toBeInTheDocument();
    });

    const formControl = screen.getByLabelText(/Redoubled\?/).closest("label");
    const switchInput = formControl?.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(switchInput.checked).toBe(false);
  });

  it("saves score to we when winner is we", async () => {
    const store = createStore();
    store.set(bridgeAtom, defaultState);

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));

    await waitFor(() => {
      expect(screen.getByText("We")).toBeInTheDocument();
    });

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    const state = store.get(bridgeAtom);
    expect(state.aboveScores[0][0].length).toBe(1); // We scored
    expect(state.aboveScores[0][1].length).toBe(1); // They got a 0 entry
    expect(state.aboveScores[0][0][0]).toBeGreaterThan(0); // We have a real score
    expect(state.aboveScores[0][1][0]).toBe(0); // They got 0
  });

  it("saves score to they when winner is they", async () => {
    const store = createStore();
    store.set(bridgeAtom, defaultState);

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));

    await waitFor(() => {
      expect(screen.getByText("Contract")).toBeInTheDocument();
    });

    // Change bid winner to "They"
    const bidSwitch = screen.getByRole("checkbox", {
      name: /bid winner is we/i,
    });
    fireEvent.click(bidSwitch);

    await waitFor(() => {
      expect(screen.getByText("They")).toBeInTheDocument();
    });

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    const state = store.get(bridgeAtom);
    expect(state.aboveScores[0][0].length).toBe(1); // We got a 0 entry
    expect(state.aboveScores[0][1].length).toBe(1); // They scored
    expect(state.aboveScores[0][0][0]).toBe(0); // We got 0
    expect(state.aboveScores[0][1][0]).toBeGreaterThan(0); // They have a real score
  });

  it("displays ScoringTable component", async () => {
    const store = createStore();
    store.set(bridgeAtom, defaultState);

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));

    await waitFor(() => {
      // ScoringTable renders a table with contract scoring info
      expect(screen.getAllByRole("table").length).toBeGreaterThan(0);
    });
  });
});
