import usDollar from "../usdFormatter";

describe("apis | usdFormatter", () => {
  it("formats a dollar value", () => {
    expect(usDollar.format(27)).toEqual("$27.00");
  });

  it("adds commas", () => {
    expect(usDollar.format(1000)).toEqual("$1,000.00");
  });

  it("truncates long values", () => {
    expect(usDollar.format(1000.1234)).toEqual("$1,000.12");
  });
});
