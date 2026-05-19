/** async forEach function */
type ForEachCallback<T> = (item: T, index: number, array: T[]) => Promise<void>;

export async function asyncForEach<T>(
  array: T[],
  callback: ForEachCallback<T>,
): Promise<void> {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array);
  }
}
