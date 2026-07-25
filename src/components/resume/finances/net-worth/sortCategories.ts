import type { NetWorthEntry } from "../../../../jotai/finances-atom";

/** Largest amounts in the latest-dated entry first (zeros sink to the bottom). */
export const sortCategoriesByFinalEntry = (
  categories: string[],
  entries: NetWorthEntry[],
): string[] => {
  if (entries.length === 0) {
    return [...categories];
  }

  const { amounts } = entries.reduce((latest, entry) =>
    entry.entryDate >= latest.entryDate ? entry : latest,
  );
  return [...categories].sort((a, b) => (amounts[b] ?? 0) - (amounts[a] ?? 0));
};
