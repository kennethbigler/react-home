import { useAtom, useAtomValue } from "jotai";
import {
  budgetAtom,
  budgetCategoryColorsAtom,
  budgetFlowRead,
  ExpenseEntry,
  ExpenseEntryColor,
} from "../../../../../jotai/finances-atom";
import {
  buildCategoryTotals,
  getLatestBudgetIncome,
  normalizeCategoryKey,
} from "../../../../../apis/budget";

const useBudgetEntries = () => {
  const [expenseEntries, setExpenseEntries] = useAtom(budgetAtom);
  const [categoryColors, setCategoryColors] = useAtom(budgetCategoryColorsAtom);
  const { flow, hasCompData } = useAtomValue(budgetFlowRead);

  const fallbackCategories =
    !flow && expenseEntries.length > 0
      ? buildCategoryTotals(
          expenseEntries,
          getLatestBudgetIncome(0, 0, 0, 0),
          categoryColors,
        )
      : [];
  const categories = flow?.categories ?? fallbackCategories;

  const addExpenseEntry = (
    expenseEntry: ExpenseEntry,
    editEntryIdx: number,
  ) => {
    const newExpenseEntries = [...expenseEntries];
    const previousCategoryKey = normalizeCategoryKey(
      expenseEntries[editEntryIdx]?.category ?? "",
    );
    const nextCategoryKey = normalizeCategoryKey(expenseEntry.category);
    if (editEntryIdx === -1) {
      newExpenseEntries.push(expenseEntry);
    } else {
      newExpenseEntries[editEntryIdx] = expenseEntry;
    }
    setExpenseEntries(newExpenseEntries);

    if (
      editEntryIdx !== -1 &&
      previousCategoryKey &&
      previousCategoryKey !== nextCategoryKey
    ) {
      const previousCategoryStillExists = newExpenseEntries.some(
        (entry) => normalizeCategoryKey(entry.category) === previousCategoryKey,
      );
      setCategoryColors((currentColors) => {
        const nextColors = { ...currentColors };
        const previousColor = currentColors[previousCategoryKey];
        if (previousColor && !nextColors[nextCategoryKey]) {
          nextColors[nextCategoryKey] = previousColor;
        }
        if (!previousCategoryStillExists) {
          delete nextColors[previousCategoryKey];
        }
        return nextColors;
      });
    }
  };

  const removeExpenseEntry = (editEntryIdx: number) => {
    const deletedCategoryKey = normalizeCategoryKey(
      expenseEntries[editEntryIdx]?.category ?? "",
    );
    const newExpenseEntries = expenseEntries.filter(
      (_, index) => index !== editEntryIdx,
    );
    const categoryStillExists = newExpenseEntries.some(
      (entry) => normalizeCategoryKey(entry.category) === deletedCategoryKey,
    );

    setExpenseEntries(newExpenseEntries);

    if (!categoryStillExists) {
      setCategoryColors((currentColors) => {
        const { [deletedCategoryKey]: _removedColor, ...remainingColors } =
          currentColors;
        return remainingColors;
      });
    }
  };

  const handleCategoryColorChange = (
    categoryKey: string,
    color?: ExpenseEntryColor,
  ) => {
    setCategoryColors((currentColors) => {
      if (!color) {
        const { [categoryKey]: _removedColor, ...remainingColors } =
          currentColors;
        return remainingColors;
      }

      return { ...currentColors, [categoryKey]: color };
    });
  };

  return {
    expenseEntries,
    hasCompData,
    categories,
    categoryColors,
    addExpenseEntry,
    removeExpenseEntry,
    handleCategoryColorChange,
  };
};

export default useBudgetEntries;
