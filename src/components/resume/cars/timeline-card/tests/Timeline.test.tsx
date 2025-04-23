import { render, screen } from "@testing-library/react";
import Timeline from "../Timeline";

import dateObj from "../../../../../apis/DateHelper";

const start = dateObj("2019-05");
const end = dateObj("2020-02");
const data = [
  {
    color: "red",
    title: "Title 1",
    car: "Body 1",
    start: dateObj("2019-06"),
    end: dateObj("2019-09"),
  },
  {
    color: "blue",
    title: "Title 2",
    car: "Body 2",
    start: dateObj("2019-07"),
    end: dateObj("2020-02"),
    inverted: true,
  },
  {
    color: "blue",
    title: "Title 3",
    car: "Body 3",
    start: dateObj("2019-08"),
    end: dateObj("2020-02"),
    short: "Short",
  },
  {
    color: "blue",
    title: "Title 4",
    car: "Body 4",
    start: dateObj("2019-09"),
    end: dateObj("2020-02"),
    inverted: true,
    short: "Short",
  },
];

describe("common | timeline-card | Timeline", () => {
  it("renders as expected", () => {
    render(<Timeline start={start} end={end} data={data} />);
    // verify year marker is on the screen
    expect(screen.getByTitle("year")).toBeInTheDocument();
    expect(screen.getByTitle("year-marker")).toBeInTheDocument();
    expect(screen.getByTitle("'20")).toBeInTheDocument();
    expect(screen.getByText("'20")).toBeInTheDocument();
    // verify we have a data segment
    expect(screen.getByTitle("Title 1")).toBeInTheDocument();
    expect(screen.getByText("Body 1")).toBeInTheDocument();
  });

  it("stacks timelines if they can fit on the same row", () => {
    render(<Timeline start={start} end={end} data={data} />);
    // verify we have year row + 3 data rows
    expect(screen.getAllByTitle("timeline-row")).toHaveLength(4);
    expect(screen.getByText("Body 1").parentNode).toEqual(
      screen.getByText("Body 4").parentNode,
    );
    expect(screen.getByText("Body 1").parentNode).not.toEqual(
      screen.getByText("Body 3").parentNode,
    );
    expect(screen.getByText("Body 1")).toHaveStyle({ width: "33%" });
    expect(screen.getByText("Body 4")).toHaveStyle({ width: "55%" });
  });
});
