import * as React from "react";
import Chip from "@mui/material/Chip";
import { getCSV, showRange } from "../Job";
import dateObj from "../../../../apis/DateHelper";

describe("resume | work | Job", () => {
  test("getCSV", () => {
    expect(getCSV(["hello", "world"])).toEqual([
      <Chip
        key="hello"
        label="hello"
        style={{ marginRight: 5, marginBottom: 5 }}
      />,
      <Chip
        key="world"
        label="world"
        style={{ marginRight: 5, marginBottom: 5 }}
      />,
    ]);
  });
  test("showRange", () => {
    expect(
      showRange(dateObj("2020-3-3"), dateObj("2021-2-1"), "hello world")
    ).toEqual("March 2020 - February 2021 (2 years) hello world");
    expect(
      showRange(dateObj("2020-3-3"), dateObj("2020-4-1"), "hello world")
    ).toEqual("March 2020 - April 2020 (2 months) hello world");
    expect(
      showRange(dateObj("2020-3-3"), dateObj("2020-3-7"), "hello world")
    ).toEqual("March 2020 - March 2020 (1 month) hello world");
  });
});
