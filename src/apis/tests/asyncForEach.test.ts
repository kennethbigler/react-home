import { describe, it, expect } from "vitest";
import { asyncForEach } from "../asyncForEach";

describe("apis | asyncForEach", () => {
  it("runs callback for each item in order", async () => {
    let x = 1;
    await asyncForEach([1, 2, 3], (num) => {
      x += num;
      return Promise.resolve();
    });
    expect(x).toEqual(7);
  });

  it("passes index and array to callback", async () => {
    const indices: number[] = [];
    const lengths: number[] = [];
    await asyncForEach(["a", "b", "c"], (_item, index, array) => {
      indices.push(index);
      lengths.push(array.length);
      return Promise.resolve();
    });
    expect(indices).toEqual([0, 1, 2]);
    expect(lengths).toEqual([3, 3, 3]);
  });

  it("handles empty array", async () => {
    let called = 0;
    await asyncForEach([], () => {
      called += 1;
      return Promise.resolve();
    });
    expect(called).toBe(0);
  });
});
