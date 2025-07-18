import { render, screen } from "@testing-library/react";
import TimelineCard from "../TimelineCard";

import dateObj from "../../../../../apis/DateHelper";
import { CarEntry } from "../../../../../constants/cars";

const carReqs = {
  src: "somewhere",
  transmission: "Manual",
  horsepower: 1,
  MPG: 2,
  torque: 3,
  weight: 4,
  zTo60: 5,
};

const data: CarEntry[] = [
  {
    ...carReqs,
    color: "red",
    title: "Title 1",
    car: "Body 1",
    start: dateObj("2019-06"),
    end: dateObj("2019-09"),
  },
  {
    ...carReqs,
    color: "blue",
    title: "Title 2",
    car: "Body 2",
    start: dateObj("2019-07"),
    end: dateObj("2020-02"),
    inverted: true,
  },
  {
    ...carReqs,
    color: "blue",
    title: "Title 3",
    car: "Body 3",
    start: dateObj("2019-08"),
    end: dateObj("2020-02"),
  },
  {
    ...carReqs,
    color: "blue",
    title: "Title 4",
    car: "Body 4",
    start: dateObj("2019-09"),
    end: dateObj("2020-02"),
    inverted: true,
  },
];

describe("common | timeline-card | TimelineCard", () => {
  it("renders as expected", () => {
    render(
      <TimelineCard
        data={data}
        useFStart={false}
        useKStart={false}
        onClick={() => () => {}}
      />,
    );

    // verify ExpandableCard
    expect(screen.getByText("Ken's Cars")).toBeInTheDocument();
    expect(
      screen.getByText(`March 2008 - ${dateObj().format("MMMM Y")}`),
    ).toBeInTheDocument();

    // verify Timeline
    expect(screen.getAllByTitle("year")).not.toBeNull();
    expect(screen.getAllByTitle("year-marker")).not.toBeNull();
    expect(screen.getByTitle("Title 1")).toBeInTheDocument();
    expect(screen.getAllByText("B")).not.toBeNull();
  });
});
