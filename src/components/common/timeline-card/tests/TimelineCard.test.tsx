import { render, screen } from "@testing-library/react";
import TimelineCard from "../TimelineCard";

import dateObj from "../../../../apis/DateHelper";

const start = dateObj("2019-05");
const end = dateObj("2020-02");
const selector = "body";
const data = [
  {
    color: "red",
    title: "Title 1",
    [selector]: "Body 1",
    start: dateObj("2019-06"),
    end: dateObj("2019-09"),
  },
  {
    color: "blue",
    title: "Title 2",
    [selector]: "Body 2",
    start: dateObj("2019-07"),
    end: dateObj("2020-02"),
    inverted: true,
  },
  {
    color: "blue",
    title: "Title 3",
    [selector]: "Body 3",
    start: dateObj("2019-08"),
    end: dateObj("2020-02"),
    short: "Short",
  },
  {
    color: "blue",
    title: "Title 4",
    [selector]: "Body 4",
    start: dateObj("2019-09"),
    end: dateObj("2020-02"),
    inverted: true,
    short: "Short",
  },
];

describe("common | timeline-card | TimelineCard", () => {
  it("renders as expected", () => {
    render(
      <TimelineCard
        start={start}
        end={end}
        selector={selector}
        data={data}
        title="Title"
        backgroundColor="red"
      />
    );

    // verify ExpandableCard
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("May 2019 - February 2020")).toBeInTheDocument();
    expect(screen.getByText("Title").parentNode?.parentNode).toHaveStyle({
      backgroundColor: "red",
    });

    // verify Timeline
    expect(screen.getByTitle("year")).toBeInTheDocument();
    expect(screen.getByTitle("year-marker")).toBeInTheDocument();
    expect(screen.getByTitle("'20")).toBeInTheDocument();
    expect(screen.getByText("'20")).toBeInTheDocument();
    expect(screen.getByTitle("Title 1")).toBeInTheDocument();
    expect(screen.getByText("Body 1")).toBeInTheDocument();
  });
});
