import { vi } from "vitest";
import { getStart, getEnd } from "../classes";
import dateObj from "../../apis/DateHelper";

describe("constants classes", () => {
  let oldConsole: Console["error"];

  beforeAll(() => {
    // eslint-disable-next-line no-console
    oldConsole = console.error;
    // eslint-disable-next-line no-console
    console.error = vi.fn();
  });

  afterAll(() => {
    // eslint-disable-next-line no-console
    console.error = oldConsole;
  });

  test("getStart", () => {
    // @ts-expect-error: testing default for getStart
    expect(getStart(null, 0).year).toEqual(dateObj().year);
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith(
      "Start Error: quarter given does not exist: ",
      null,
    );
  });

  test("getEnd", () => {
    // @ts-expect-error: testing default for getEnd
    expect(getEnd(null, 0).year).toEqual(dateObj().year);
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith(
      "End Error: quarter given does not exist: ",
      null,
    );
  });
});
