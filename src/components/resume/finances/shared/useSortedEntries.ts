import { useEffect, useMemo } from "react";

interface DatedEntry {
  entryDate: string;
}

/**
 * Chronologically sorted view of persisted entries. Re-persists once when the
 * stored order drifts from chronological (legacy insertion-ordered storage).
 */
const useSortedEntries = <T extends DatedEntry>(
  entries: T[],
  setEntries: (next: T[]) => void,
  sortByDate: (entries: T[]) => T[],
): T[] => {
  useEffect(() => {
    const sorted = sortByDate(entries);
    if (sorted.some((entry, i) => entry.entryDate !== entries[i]?.entryDate)) {
      setEntries(sorted);
    }
  }, [entries, setEntries, sortByDate]);

  return useMemo(() => sortByDate(entries), [entries, sortByDate]);
};

export default useSortedEntries;
