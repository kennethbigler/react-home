export const getChipColor = (a: number, b: number) => {
  if (a === b) {
    return "default";
  }
  return a > b ? "success" : "error";
};
