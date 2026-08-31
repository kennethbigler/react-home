import { useMemo } from "react";
import { useAtom } from "jotai";
import {
  type NetWorthCalcEntry,
  type NetWorthEntry,
  mergeNetWorthCategoryAmounts,
  netWorthAtom,
  netWorthCategoriesAtom,
  netWorthRead,
  syncNetWorthEntryAmounts,
} from "@/jotai/net-worth-atom";
import useFinanceEntries, {
  type FinanceEntriesState,
} from "../shared/useFinanceEntries";
import type { CategoryMerge } from "./resolveCategoryMerges";
import { sortCategoriesByFinalEntry } from "./sortCategories";

interface NetWorthEntriesState extends FinanceEntriesState<
  NetWorthEntry,
  NetWorthCalcEntry
> {
  /** Categories sorted by the latest entry's amounts (largest first). */
  categories: string[];
  /** Persists renamed/merged categories and re-syncs entry amounts. */
  saveCategories: (
    nextCategories: string[],
    mappings: { name: string; previousName?: string }[],
    merges: CategoryMerge[],
  ) => void;
}

/** Net worth entries, categories, and CRUD actions. */
const useNetWorthEntries = (): NetWorthEntriesState => {
  const financeEntries = useFinanceEntries(netWorthAtom, netWorthRead);
  const { entries, persistEntries } = financeEntries;
  const [rawCategories, setCategories] = useAtom(netWorthCategoriesAtom);

  const categories = useMemo(
    () => sortCategoriesByFinalEntry(rawCategories, entries),
    [rawCategories, entries],
  );

  const saveCategories = (
    nextCategories: string[],
    mappings: { name: string; previousName?: string }[],
    merges: CategoryMerge[],
  ) => {
    const merged = mergeNetWorthCategoryAmounts(entries, merges);
    setCategories(nextCategories);
    persistEntries(syncNetWorthEntryAmounts(merged, mappings));
  };

  return { ...financeEntries, categories, saveCategories };
};

export default useNetWorthEntries;
