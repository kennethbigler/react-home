import asyncForEach from "./asyncForEach";

describe("helpers | asyncForEach", () => {
  it("works as expected", async () => {
    let x = 1;
    // eslint-disable-next-line @typescript-eslint/require-await
    await asyncForEach([1, 2, 3], async (num) => {
      x += num;
    });
    expect(x).toEqual(7);
  });
});
