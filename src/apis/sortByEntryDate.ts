/** Ascending by entryDate (YYYY-MM); insertion order is ignored. */
const sortByEntryDate = <T extends { entryDate: string }>(entries: T[]): T[] =>
  entries.toSorted((a, b) => a.entryDate.localeCompare(b.entryDate));

export default sortByEntryDate;
