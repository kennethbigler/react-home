import * as React from "react";
import { render, screen } from "@testing-library/react";
import Timeline from "../Timeline";

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

describe("common | timeline-card | Timeline", () => {
  it("renders as expected", () => {
    render(
      <Timeline
        start={start}
        end={end}
        selector={selector}
        data={data}
        yearMarkerFrequency={1}
      />
    );
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
    render(
      <Timeline
        start={start}
        end={end}
        selector={selector}
        data={data}
        yearMarkerFrequency={1}
      />
    );
    // verify we have year row + 3 data rows
    expect(screen.getAllByTitle("timeline-row")).toHaveLength(4);
    expect(screen.getByText("Body 1").parentNode).toEqual(
      screen.getByText("Body 4").parentNode
    );
    expect(screen.getByText("Body 1").parentNode).not.toEqual(
      screen.getByText("Body 3").parentNode
    );
    expect(screen.getByText("Body 1")).toHaveStyle({ width: "33%" });
    expect(screen.getByText("Body 4")).toHaveStyle({ width: "55%" });
  });

  describe("basic props tests", () => {
    it("renders segments", () => {
      render(
        <Timeline
          start={start}
          end={end}
          selector={selector}
          data={data}
          yearMarkerFrequency={1}
        />
      );
      expect(screen.getByTitle("Title 1")).toBeInTheDocument();
      expect(screen.getByTitle("Title 2")).toBeInTheDocument();
      expect(screen.getByTitle("Title 3")).toBeInTheDocument();
      expect(screen.getByTitle("Title 4")).toBeInTheDocument();
    });

    it("uses selector", () => {
      render(
        <Timeline
          start={start}
          end={end}
          selector={selector}
          data={data}
          yearMarkerFrequency={1}
        />
      );
      expect(screen.getByText("Body 1")).toBeInTheDocument();
      expect(screen.getByText("Body 2")).toBeInTheDocument();
      expect(screen.getByText("Body 3")).toBeInTheDocument();
      expect(screen.getByText("Body 4")).toBeInTheDocument();
    });

    it("has a year marker for each year in span", () => {
      render(
        <Timeline
          start={dateObj("2015-01")}
          end={dateObj("2018-01")}
          selector={selector}
          data={data}
          yearMarkerFrequency={1}
        />
      );

      expect(screen.getAllByTitle("year")).toHaveLength(3);
      expect(screen.getAllByTitle("year-marker")).toHaveLength(3);

      expect(screen.getByTitle("'16")).toBeInTheDocument();
      expect(screen.getByText("'16")).toBeInTheDocument();
      expect(screen.getByTitle("'17")).toBeInTheDocument();
      expect(screen.getByText("'17")).toBeInTheDocument();
      expect(screen.getByTitle("'18")).toBeInTheDocument();
      expect(screen.getByText("'18")).toBeInTheDocument();
    });

    it("can change the year marker frequency", () => {
      render(
        <Timeline
          start={dateObj("2015-01")}
          end={dateObj("2018-01")}
          selector={selector}
          data={data}
          yearMarkerFrequency={2}
        />
      );

      expect(screen.getAllByTitle("year")).toHaveLength(2);
      expect(screen.getAllByTitle("year-marker")).toHaveLength(2);

      expect(screen.getByTitle("'16")).toBeInTheDocument();
      expect(screen.getByText("'16")).toBeInTheDocument();
      expect(screen.queryByTitle("'17")).not.toBeInTheDocument();
      expect(screen.queryByText("'17")).not.toBeInTheDocument();
      expect(screen.getByTitle("'18")).toBeInTheDocument();
      expect(screen.getByText("'18")).toBeInTheDocument();
    });
  });
});
