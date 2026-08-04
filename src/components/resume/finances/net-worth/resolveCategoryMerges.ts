export interface CategoryMerge {
  from: string;
  into: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  previousName?: string;
}

export interface PendingMerge {
  from: string;
  intoRowId: string;
}

/** Resolve pending merges; skip any whose destination row no longer exists. */
export const resolveCategoryMerges = (
  merges: PendingMerge[],
  trimmed: CategoryRow[],
): CategoryMerge[] => {
  const resolved: CategoryMerge[] = [];
  merges.forEach(({ from, intoRowId }) => {
    const target = trimmed.find((row) => row.id === intoRowId);
    if (!target) {
      return;
    }
    resolved.push({ from, into: target.previousName ?? target.name });
  });
  return resolved;
};
