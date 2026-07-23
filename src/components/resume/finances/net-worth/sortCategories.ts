import { NetWorthEntry } from "../../../../jotai/finances-atom";

/** Largest final-entry amounts first (zeros / new categories sink to the bottom). */
export const sortCategoriesByFinalEntry = (
  categories: string[],
  entries: NetWorthEntry[],
): string[] => {
  if (entries.length === 0) {
    return [...categories];
  }

  const { amounts } = entries[entries.length - 1];
  return [...categories].sort((a, b) => (amounts[b] ?? 0) - (amounts[a] ?? 0));
};
