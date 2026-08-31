import type { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";
import { Provider, atom, createStore } from "jotai";
import { describe, expect, it } from "vitest";
import useFinanceEntries from "./useFinanceEntries";

interface TestEntry {
  entryDate: string;
  value: number;
}

const entriesAtom = atom<TestEntry[]>([]);
const readAtom = atom((get) =>
  get(entriesAtom).map(({ value }) => ({ doubled: value * 2 })),
);

const renderFinanceEntries = (initialEntries: TestEntry[]) => {
  const store = createStore();
  store.set(entriesAtom, initialEntries);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    store,
    ...renderHook(() => useFinanceEntries(entriesAtom, readAtom), { wrapper }),
  };
};

describe("resume | finances | shared | useFinanceEntries", () => {
  it("returns entries chronologically with aligned calc entries", () => {
    const { result, store } = renderFinanceEntries([
      { entryDate: "2022-01", value: 3 },
      { entryDate: "2020-01", value: 1 },
    ]);

    expect(result.current.entries.map(({ entryDate }) => entryDate)).toEqual([
      "2020-01",
      "2022-01",
    ]);
    // Drifted storage order is re-persisted chronologically.
    expect(store.get(entriesAtom).map(({ entryDate }) => entryDate)).toEqual([
      "2020-01",
      "2022-01",
    ]);
    expect(result.current.calcEntries).toEqual([
      { doubled: 2 },
      { doubled: 6 },
    ]);
    expect(result.current.entryDialog.open).toBe(false);
  });

  it("saves a new entry in date order and closes the dialog", () => {
    const { result, store } = renderFinanceEntries([
      { entryDate: "2020-01", value: 1 },
      { entryDate: "2022-01", value: 3 },
    ]);

    act(() => result.current.entryDialog.openNew());
    expect(result.current.entryDialog.open).toBe(true);

    act(() => result.current.saveEntry({ entryDate: "2021-01", value: 2 }));

    expect(store.get(entriesAtom).map(({ value }) => value)).toEqual([1, 2, 3]);
    expect(result.current.entryDialog.open).toBe(false);
  });

  it("updates the edited entry", () => {
    const { result, store } = renderFinanceEntries([
      { entryDate: "2020-01", value: 1 },
      { entryDate: "2022-01", value: 3 },
    ]);

    act(() => result.current.entryDialog.openEdit(1)());
    act(() => result.current.saveEntry({ entryDate: "2022-01", value: 30 }));

    expect(store.get(entriesAtom)).toEqual([
      { entryDate: "2020-01", value: 1 },
      { entryDate: "2022-01", value: 30 },
    ]);
  });

  it("removes the edited entry and closes the dialog", () => {
    const { result, store } = renderFinanceEntries([
      { entryDate: "2020-01", value: 1 },
      { entryDate: "2022-01", value: 3 },
    ]);

    act(() => result.current.entryDialog.openEdit(0)());
    act(() => result.current.removeEntry());

    expect(store.get(entriesAtom)).toEqual([
      { entryDate: "2022-01", value: 3 },
    ]);
    expect(result.current.entryDialog.open).toBe(false);
  });
});
