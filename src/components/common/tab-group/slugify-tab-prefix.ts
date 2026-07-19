/** Turn a human-readable label into a safe HTML id prefix. */
const slugifyTabPrefix = (label: string): string =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default slugifyTabPrefix;
