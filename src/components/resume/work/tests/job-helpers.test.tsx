import Chip from "@mui/material/Chip";
import { getCSV } from "../jobHelpers";

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
});
