import React from "react";
import { render, screen } from "@testing-library/react";
import Case from "../Case";

describe("games | deal-or-no-deal | Case", () => {
  it("displays location when on", () => {
    render(
      <Case briefcase={{ on: true, loc: 1, val: 1000 }} onClick={jest.fn()} />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.queryByText("$1,000")).toBeNull();
  });

  it("displays value when off", () => {
    render(
      <Case briefcase={{ on: false, loc: 1, val: 1000 }} onClick={jest.fn()} />
    );

    expect(screen.queryByText("1")).toBeNull();
    expect(screen.getByText("$1,000")).toBeInTheDocument();
  });
});
