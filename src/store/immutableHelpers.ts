// Immutable helper functions
export function insertItem<T>(array: T[], item: T): T[] {
  const newArr = array.slice();
  newArr.push(item);
  return newArr;
}

export function updateObjectInArray<T extends Record<string, unknown>, K extends keyof T>(array: T[], ins: T, key: K): T[] {
  return array.map(
    (item) => (item[key] !== ins[key] ? item : { ...item, ...ins }),
  );
}

export function updateArrayInArray<T>(array: T[], ins: T, idx: number): T[] {
  return array.map((item, i) => (i !== idx ? item : ins));
}

export function removeItem<T extends { id: number }>(array: T[], id: number): T[] {
  return array.filter((obj) => obj.id !== id);
}

export function removeItemInArray<T>(array: T[], idx: number): T[] {
  return [...array.slice(0, idx), ...array.slice(idx + 1)];
}
