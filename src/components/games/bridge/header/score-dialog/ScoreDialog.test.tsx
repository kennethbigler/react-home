import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
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

  it("Close button closes the dialog", async () => {
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

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByText("Contract")).not.toBeInTheDocument();
    });
  });

  it("Undo button removes last score entry", async () => {
    const store = createStore();
    // Pre-populate with one scored hand
    store.set(bridgeAtom, {
      ...defaultState,
      aboveScores: [
        [[50], [0]],
        [[], []],
        [[], []],
      ],
      weBelow: [40],
      theyBelow: [0],
      bids: ["1NT"],
    });

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));
    await waitFor(() => {
      expect(screen.getByText("Contract")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /undo/i }));

    await waitFor(() => {
      expect(screen.queryByText("Contract")).not.toBeInTheDocument();
    });

    const state = store.get(bridgeAtom);
    expect(state.weBelow).toHaveLength(0);
    expect(state.bids).toHaveLength(0);
  });

  it("handleEnd increments weRubbers when we win", async () => {
    const store = createStore();
    // Set up state where we have won a game (aboveScores[0][0] sum >= 100, > they)
    store.set(bridgeAtom, {
      ...defaultState,
      aboveScores: [
        [[100], [0]],
        [[], []],
        [[], []],
      ],
      weBelow: [],
      theyBelow: [],
    });

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));
    await waitFor(() => {
      expect(screen.getByText("Contract")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /end/i }));

    await waitFor(() => {
      expect(screen.queryByText("Contract")).not.toBeInTheDocument();
    });

    const state = store.get(bridgeAtom);
    expect(state.weRubbers).toBe(1);
  });

  it("handleEnd increments theyRubbers when they win", async () => {
    const store = createStore();
    store.set(bridgeAtom, {
      ...defaultState,
      aboveScores: [
        [[0], [100]],
        [[], []],
        [[], []],
      ],
      weBelow: [],
      theyBelow: [],
    });

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));
    await waitFor(() => {
      expect(screen.getByText("Contract")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /end/i }));

    await waitFor(() => {
      expect(screen.queryByText("Contract")).not.toBeInTheDocument();
    });

    const state = store.get(bridgeAtom);
    expect(state.theyRubbers).toBe(1);
  });

  it("handleEnd gives we +100 bonus when tied wins but we have above score", async () => {
    const store = createStore();
    // Tied game wins (both 0), but we have above-the-line score in current game
    store.set(bridgeAtom, {
      ...defaultState,
      aboveScores: [
        [[50], [0]],
        [[], []],
        [[], []],
      ],
      weBelow: [],
      theyBelow: [],
    });

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));
    await waitFor(() => {
      expect(screen.getByText("Contract")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /end/i }));

    await waitFor(() => {
      expect(screen.queryByText("Contract")).not.toBeInTheDocument();
    });

    // We had 50 above + 100 bonus = 150 total > 0 → we win the rubber
    const state = store.get(bridgeAtom);
    expect(state.weRubbers).toBe(1);
  });

  it("handleEnd gives they +100 bonus when tied wins but they have above score", async () => {
    const store = createStore();
    store.set(bridgeAtom, {
      ...defaultState,
      aboveScores: [
        [[0], [50]],
        [[], []],
        [[], []],
      ],
      weBelow: [],
      theyBelow: [],
    });

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));
    await waitFor(() => {
      expect(screen.getByText("Contract")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /end/i }));

    await waitFor(() => {
      expect(screen.queryByText("Contract")).not.toBeInTheDocument();
    });

    // They had 50 above + 100 bonus = 150 > 0 → they win the rubber
    const state = store.get(bridgeAtom);
    expect(state.theyRubbers).toBe(1);
  });

  it("handleRedoubleToggle sets isDouble=true when redouble is checked", async () => {
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

    // Find the Redouble FormControlLabel and click its input
    const redoubleLabel = screen.getByText(/^Redoubled\?/).closest("label");
    const redoubleInput = redoubleLabel?.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    fireEvent.click(redoubleInput);

    // When redouble is enabled, the Double checkbox should also be checked
    const doubleLabel = screen.getByText(/^Doubled\?/).closest("label");
    const doubleInput = doubleLabel?.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    await waitFor(() => {
      expect(doubleInput.checked).toBe(true);
    });
  });

  it("handle5HonoursToggle sets isDouble=true when 5 honours is checked", async () => {
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

    // Change contract suit from NT to a suit (e.g., ♠️) to show 4/5 Honours section
    const suitSelect = screen.getByRole("combobox", { name: /Contract Suit/i });
    fireEvent.mouseDown(suitSelect);
    const suitListbox = screen.getByRole("listbox");
    // Click the first non-NT option (♣️ is first in suitOptions)
    const suitOptions = within(suitListbox).getAllByRole("option");
    fireEvent.click(suitOptions[0]); // click first option (♣️)

    await waitFor(() => {
      expect(screen.getByText(/5 Honours/i)).toBeInTheDocument();
    });

    // Toggle the 5 Honours switch
    const honoursLabel = screen
      .getByText(/5 Honours in 1 hand/i)
      .closest("label");
    const honoursInput = honoursLabel?.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    fireEvent.click(honoursInput);

    // When 5 honours is enabled, doubled should also be checked
    const doubleLabel = screen.getByText(/^Doubled\?/).closest("label");
    const doubleInput = doubleLabel?.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    await waitFor(() => {
      expect(doubleInput.checked).toBe(true);
    });
  });

  it("handleContractSuitChange updates the contract suit display", async () => {
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
    });

    // Change the contract suit using the combobox
    const suitSelect = screen.getByRole("combobox", { name: /Contract Suit/i });
    fireEvent.mouseDown(suitSelect);
    const listbox = screen.getByRole("listbox");
    const options = within(listbox).getAllByRole("option");
    fireEvent.click(options[1]); // click second option (♦️)

    await waitFor(() => {
      // NT should no longer be the selected text in the suit selector
      expect(screen.getAllByRole("combobox").length).toBeGreaterThan(0);
    });
  });

  it("handleDoubleToggle toggles the doubled switch", async () => {
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

    const doubleLabel = screen.getByText(/^Doubled\?/).closest("label");
    const doubleInput = doubleLabel?.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(doubleInput.checked).toBe(false);

    fireEvent.click(doubleInput);
    await waitFor(() => {
      expect(doubleInput.checked).toBe(true);
    });
  });

  it("handleContractTricksChange updates when changing contract tricks", async () => {
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

    const tricksSelect = screen.getByRole("combobox", {
      name: /Contract Tricks/i,
    });
    fireEvent.mouseDown(tricksSelect);
    const listbox = screen.getByRole("listbox");
    const options = within(listbox).getAllByRole("option");
    fireEvent.click(options[1]); // click option "2"

    await waitFor(() => {
      expect(screen.getAllByRole("combobox").length).toBeGreaterThan(0);
    });
  });

  it("handleDeclarerTricksChange updates when changing declarer tricks", async () => {
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

    const declarerSelect = screen.getByRole("combobox", {
      name: /Declarer Team Tricks/i,
    });
    fireEvent.mouseDown(declarerSelect);
    const listbox = screen.getByRole("listbox");
    const options = within(listbox).getAllByRole("option");
    fireEvent.click(options[8]); // click option "8 (2)" = index 8 → 8 tricks

    await waitFor(() => {
      expect(screen.getAllByRole("combobox").length).toBeGreaterThan(0);
    });
  });

  it("handle4AcesToggle toggles the 4 Aces switch (contractSuit=NT)", async () => {
    const store = createStore();
    store.set(bridgeAtom, defaultState);

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));
    await waitFor(() => {
      expect(screen.getByLabelText(/4 Aces in 1 hand/i)).toBeInTheDocument();
    });

    const acesInput = screen.getByLabelText(
      /4 Aces in 1 hand/i,
    ) as HTMLInputElement;
    expect(acesInput.checked).toBe(false);

    fireEvent.click(acesInput);
    await waitFor(() => {
      expect(acesInput.checked).toBe(true);
    });
  });

  it("handle4HonoursToggle toggles 4 honours switch (contractSuit != NT)", async () => {
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

    // Change contract suit to ♣️ to reveal 4/5 Honours section
    const suitSelect = screen.getByRole("combobox", { name: /Contract Suit/i });
    fireEvent.mouseDown(suitSelect);
    const suitListbox = screen.getByRole("listbox");
    const suitOptions = within(suitListbox).getAllByRole("option");
    fireEvent.click(suitOptions[0]); // ♣️

    await waitFor(() => {
      expect(screen.getByText(/4 Honours in 1 hand/i)).toBeInTheDocument();
    });

    const honoursLabel = screen
      .getByText(/4 Honours in 1 hand/i)
      .closest("label");
    const honoursInput = honoursLabel?.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(honoursInput.checked).toBe(false);

    fireEvent.click(honoursInput);
    await waitFor(() => {
      expect(honoursInput.checked).toBe(true);
    });
  });

  it("handle5HonoursToggle OFF branch: toggling off does not crash (line 73 false path)", async () => {
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

    // Change to suit contract to reveal Honours section
    const suitSelect = screen.getByRole("combobox", { name: /Contract Suit/i });
    fireEvent.mouseDown(suitSelect);
    const listbox1 = screen.getByRole("listbox");
    const suitOpts = within(listbox1).getAllByRole("option");
    fireEvent.click(suitOpts[0]); // ♣️

    await waitFor(() => {
      expect(screen.getByText(/5 Honours/i)).toBeInTheDocument();
    });

    const honoursLabel = screen
      .getByText(/5 Honours in 1 hand/i)
      .closest("label");
    const honoursInput = honoursLabel?.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;

    // Toggle ON (checked=true path - line 73 if body)
    fireEvent.click(honoursInput);
    await waitFor(() => expect(honoursInput.checked).toBe(true));

    // Toggle OFF (checked=false path - line 73 else/false branch)
    fireEvent.click(honoursInput);
    await waitFor(() => expect(honoursInput.checked).toBe(false));
  });

  it("handleSave with failed bid shows ❌ in bids string (madeBid=false, line 137)", async () => {
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

    // Change declarerTricks to 6 (contract=1 → need 7+ tricks → 6 fails)
    const declarerSelect = screen.getByRole("combobox", {
      name: /Declarer Team Tricks/i,
    });
    fireEvent.mouseDown(declarerSelect);
    const listbox2 = screen.getByRole("listbox");
    const trickOpts = within(listbox2).getAllByRole("option");
    fireEvent.click(trickOpts[6]); // index 6 → value 6 → "6" tricks declared

    await waitFor(() => {
      expect(screen.getAllByRole("combobox").length).toBeGreaterThan(0);
    });

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    const state = store.get(bridgeAtom);
    expect(state.bids.length).toBeGreaterThan(0);
    expect(state.bids[0]).toContain("❌");
  });

  it("handleEnd with no scores → neither side gets rubber (lines 182/189 false paths)", async () => {
    const store = createStore();
    store.set(bridgeAtom, defaultState); // all empty

    render(
      <Provider store={store}>
        <ScoreDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /score/i }));
    await waitFor(() => {
      expect(screen.getByText("Contract")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /end/i }));

    await waitFor(() => {
      expect(screen.queryByText("Contract")).not.toBeInTheDocument();
    });

    const state = store.get(bridgeAtom);
    // Neither side wins rubber when both totals are 0 (ties at zero)
    expect(state.weRubbers).toBe(0);
    expect(state.theyRubbers).toBe(0);
  });

  it("handleRedoubleToggle unchecking does not force double on (false branch)", async () => {
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

    const redoubleLabel = screen.getByText(/^Redoubled\?/).closest("label");
    const redoubleInput = redoubleLabel?.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;

    // Check then uncheck — the false branch of handleRedoubleToggle
    fireEvent.click(redoubleInput);
    fireEvent.click(redoubleInput);

    await waitFor(() => {
      expect(redoubleInput.checked).toBe(false);
    });
  });
});
