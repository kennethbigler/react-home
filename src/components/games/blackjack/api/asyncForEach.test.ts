import asyncForEach from "./asyncForEach";

describe("helpers | asyncForEach", () => {
  it("works as expected", async () => {
    let x = 1;

    // @ts-expect-error: just testing
    await asyncForEach([1, 2, 3], (num) => {
      x += num;
    });
    expect(x).toEqual(7);
  });
});
