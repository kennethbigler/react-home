import asyncForEach from "../asyncForEach";

describe("helpers | asyncForEach", () => {
  it("works as expected", async () => {
    const fn = vi.fn(() => "delayed");
    let x = 1;

    await asyncForEach([1, 2, 3], async (num) => {
      await fn();
      x += num;
    });
    expect(x).toEqual(7);
  });
});
