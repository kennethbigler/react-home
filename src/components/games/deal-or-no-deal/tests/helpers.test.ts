import { getMoneyText } from "../helpers";

describe("games | deal-or-no-deal | helpers", () => {
  it("gets text as expected", () => {
    expect(getMoneyText(1)).toEqual("$1");
    expect(getMoneyText(1000)).toEqual("$1,000");
    expect(getMoneyText(-1)).toEqual("-$1");
    expect(getMoneyText(-1000)).toEqual("-$1,000");
  });
});
