import { vi } from "vitest";
import DateHelper from "../DateHelper";

const sampleDateObj = DateHelper("2020-01-02");
const dateStr = "2019-03-04";

describe("apis | DateHelper", () => {
  test("year", () => {
    expect(sampleDateObj.year).toStrictEqual(2020);
    expect(DateHelper(sampleDateObj).year).toStrictEqual(2020);
    expect(DateHelper(dateStr).year).toStrictEqual(2019);
  });

  test("month", () => {
    expect(sampleDateObj.month).toStrictEqual(0);
    expect(DateHelper(sampleDateObj).month).toStrictEqual(0);
    expect(DateHelper(dateStr).month).toStrictEqual(2);
  });

  test("day", () => {
    expect(sampleDateObj.day).toStrictEqual(2);
    expect(DateHelper(sampleDateObj).day).toStrictEqual(2);
    expect(DateHelper(dateStr).day).toStrictEqual(4);
  });

  test("diff", () => {
    expect(sampleDateObj.diff(DateHelper(dateStr), "month")).toStrictEqual(10);
    expect(sampleDateObj.diff(DateHelper(dateStr), "months")).toStrictEqual(10);
    expect(DateHelper(dateStr).diff(sampleDateObj, "month")).toStrictEqual(-10);

    expect(sampleDateObj.diff(DateHelper(dateStr), "year")).toStrictEqual(1);
    expect(sampleDateObj.diff(DateHelper(dateStr), "years")).toStrictEqual(1);
    expect(DateHelper(dateStr).diff(sampleDateObj, "year")).toStrictEqual(-1);

    expect(sampleDateObj.diff(DateHelper(dateStr), "days")).toStrictEqual(303);
    expect(DateHelper(dateStr).diff(sampleDateObj, "days")).toStrictEqual(-303);
  });

  test("format", () => {
    expect(sampleDateObj.format("YYYY")).toStrictEqual("2020");
    expect(DateHelper(sampleDateObj).format("YYYY")).toStrictEqual("2020");
    expect(DateHelper(dateStr).format("YYYY")).toStrictEqual("2019");

    expect(sampleDateObj.format("MMMM Y")).toStrictEqual("January 2020");
    expect(DateHelper(sampleDateObj).format("MMMM Y")).toStrictEqual(
      "January 2020",
    );
    expect(DateHelper(dateStr).format("MMMM Y")).toStrictEqual("March 2019");

    expect(sampleDateObj.format("'YY")).toStrictEqual("'20");
    expect(DateHelper(sampleDateObj).format("'YY")).toStrictEqual("'20");
    expect(DateHelper(dateStr).format("'YY")).toStrictEqual("'19");

    // eslint-disable-next-line no-console
    const oldConsole = console.error;
    // eslint-disable-next-line no-console
    console.error = vi.fn();

    // @ts-expect-error: disabling TS for specific test case
    expect(DateHelper(dateStr).format("")).toStrictEqual("");
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith("unknown date format: ", "");

    // eslint-disable-next-line no-console
    console.error = oldConsole;
  });
});
