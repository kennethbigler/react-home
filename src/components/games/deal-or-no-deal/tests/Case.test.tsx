import * as React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Case from "../Case";

describe("games | deal-or-no-deal | Case", () => {
  it("displays location when on", () => {
    render(
      <Case
        briefcase={{ on: true, loc: 1, val: 1000 }}
        isOver={false}
        onClick={vi.fn()}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.queryByText("$1,000")).toBeNull();
  });

  it("displays value when off", () => {
    render(
      <Case
        briefcase={{ on: false, loc: 1, val: 1000 }}
        isOver={false}
        onClick={vi.fn()}
      />
    );

    expect(screen.queryByText("1")).toBeNull();
    expect(screen.getByText("$1,000")).toBeInTheDocument();
  });

  it("displays value when isOver", () => {
    render(
      <Case
        briefcase={{ on: true, loc: 1, val: 1000 }}
        isOver
        onClick={vi.fn()}
      />
    );

    expect(screen.queryByText("1")).toBeNull();
    expect(screen.getByText("$1,000")).toBeInTheDocument();
  });
});
