import { atom } from "jotai";
import persistentAtom from "./storage";
import sortByEntryDate from "../apis/sortByEntryDate";

export interface NetWorthEntry {
  entryDate: string;
  amounts: Record<string, number>;
}

export interface NetWorthCalcEntry {
  total: number;
  netDiff: number;
}

export const netWorthCategoriesAtom = persistentAtom<string[]>(
  "netWorthCategoriesAtom",
  [],
);
export const netWorthAtom = persistentAtom<NetWorthEntry[]>("netWorthAtom", []);

export const mergeNetWorthCategoryAmounts = (
  entries: NetWorthEntry[],
  merges: { from: string; into: string }[],
): NetWorthEntry[] => {
  if (merges.length === 0) {
    return entries;
  }

  return entries.map((entry) => {
    const amounts = { ...entry.amounts };
    merges.forEach(({ from, into }) => {
      if (!from || !into || from === into) {
        return;
      }
      amounts[into] = (amounts[into] ?? 0) + (amounts[from] ?? 0);
      delete amounts[from];
    });
    return { ...entry, amounts };
  });
};

export const syncNetWorthEntryAmounts = (
  entries: NetWorthEntry[],
  categoryMappings: { name: string; previousName?: string }[],
): NetWorthEntry[] =>
  entries.map((entry) => {
    const amounts: Record<string, number> = {};
    categoryMappings.forEach(({ name, previousName }) => {
      if (
        previousName !== undefined &&
        entry.amounts[previousName] !== undefined
      ) {
        amounts[name] = entry.amounts[previousName];
      } else {
        amounts[name] = entry.amounts[name] ?? 0;
      }
    });
    return { ...entry, amounts };
  });

export const netWorthRead = atom((get) => {
  const entries = sortByEntryDate(get(netWorthAtom));
  const categories = get(netWorthCategoriesAtom);

  const withTotals = entries.map((entry) => ({
    total: categories.reduce((sum, cat) => sum + (entry.amounts[cat] ?? 0), 0),
  }));

  return withTotals.map(
    ({ total }, i): NetWorthCalcEntry => ({
      total,
      netDiff: i === 0 ? 0 : total - withTotals[i - 1].total,
    }),
  );
});
netWorthRead.debugLabel = "netWorthRead";
