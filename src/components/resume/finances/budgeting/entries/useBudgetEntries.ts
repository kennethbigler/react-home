import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  budgetAtom,
  budgetCategoriesAtom,
  budgetCategoryColorsAtom,
  budgetCategoryListRead,
  budgetDisplayFlowRead,
} from "@/jotai/budget-atom";
import type {
  BudgetCategory,
  CategoryTotal,
  ExpenseEntry,
  ExpenseEntryColor,
} from "@/apis/budget";
import {
  buildCategoryTotals,
  formatCategoryName,
  getLatestBudgetIncome,
  normalizeCategoryKey,
} from "@/apis/budget";

const withoutKey = <T>(record: Partial<Record<string, T>>, key: string) => {
  const { [key]: _removed, ...rest } = record;
  return rest;
};

const useBudgetEntries = () => {
  const [expenseEntries, setExpenseEntries] = useAtom(budgetAtom);
  const [categoryColors, setCategoryColors] = useAtom(budgetCategoryColorsAtom);
  const setBudgetCategories = useSetAtom(budgetCategoriesAtom);
  const categoryList = useAtomValue(budgetCategoryListRead);
  const { flow, hasCompData, recommended } = useAtomValue(
    budgetDisplayFlowRead,
  );

  const fallbackCategories =
    !flow && expenseEntries.length > 0
      ? buildCategoryTotals(
          expenseEntries,
          getLatestBudgetIncome(0, 0, 0, 0),
          categoryColors,
        )
      : [];
  const expenseCategories = flow?.categories ?? fallbackCategories;
  // Defined categories without expenses still get a (zero) card so they can be edited.
  const expenseCategoryKeys = new Set(
    expenseCategories.map(({ categoryKey }) => categoryKey),
  );
  const emptyCategories: CategoryTotal[] = recommended
    ? []
    : categoryList
        .map(({ name }) => normalizeCategoryKey(name))
        .filter((categoryKey) => !expenseCategoryKeys.has(categoryKey))
        .map((categoryKey) => ({
          categoryKey,
          heading: formatCategoryName(categoryKey),
          total: 0,
          color: categoryColors[categoryKey],
          items: [],
        }));
  const categories = [...expenseCategories, ...emptyCategories];

  const addExpenseEntry = (
    expenseEntry: ExpenseEntry,
    editEntryIdx: number,
  ) => {
    const newExpenseEntries = [...expenseEntries];
    if (editEntryIdx === -1) {
      newExpenseEntries.push(expenseEntry);
    } else {
      newExpenseEntries[editEntryIdx] = expenseEntry;
    }
    setExpenseEntries(newExpenseEntries);
  };

  const removeExpenseEntry = (editEntryIdx: number) =>
    setExpenseEntries(
      expenseEntries.filter((_, index) => index !== editEntryIdx),
    );

  /** Add or update a category; a rename moves its expenses and color. */
  const saveCategory = (
    category: BudgetCategory,
    color?: ExpenseEntryColor,
    previousName?: string,
  ) => {
    const nextKey = normalizeCategoryKey(category.name);
    const previousKey = normalizeCategoryKey(previousName ?? category.name);

    setBudgetCategories([
      ...categoryList.filter(
        ({ name }) => normalizeCategoryKey(name) !== previousKey,
      ),
      category,
    ]);
    if (previousKey !== nextKey) {
      setExpenseEntries(
        expenseEntries.map((entry) =>
          normalizeCategoryKey(entry.category) === previousKey
            ? { ...entry, category: category.name }
            : entry,
        ),
      );
    }
    setCategoryColors((currentColors) => {
      const remaining = withoutKey(currentColors, previousKey);
      return color ? { ...remaining, [nextKey]: color } : remaining;
    });
  };

  const removeCategory = (name: string) => {
    const key = normalizeCategoryKey(name);
    setBudgetCategories(
      categoryList.filter(
        (category) => normalizeCategoryKey(category.name) !== key,
      ),
    );
    setCategoryColors((currentColors) => withoutKey(currentColors, key));
  };

  const isCategoryInUse = (name: string) =>
    expenseEntries.some(
      ({ category }) =>
        normalizeCategoryKey(category) === normalizeCategoryKey(name),
    );

  return {
    expenseEntries,
    hasCompData,
    recommended,
    categories,
    categoryList,
    categoryColors,
    addExpenseEntry,
    removeExpenseEntry,
    saveCategory,
    removeCategory,
    isCategoryInUse,
  };
};

export default useBudgetEntries;
