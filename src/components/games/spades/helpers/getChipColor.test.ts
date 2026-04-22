import { getChipColor } from "./getChipColor";

describe("helpers | getChipColor", () => {
  it('returns "default" when both values are equal', () => {
    expect(getChipColor(2, 2)).toEqual("default");
  });

  it('returns "success" when first value is greater', () => {
    expect(getChipColor(2, 1)).toEqual("success");
  });

  it('returns "error" when first value is less', () => {
    expect(getChipColor(1, 2)).toEqual("error");
  });
});
