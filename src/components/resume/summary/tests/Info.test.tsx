import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Info, { getJob } from "../Info";
import { Job } from "../../../../constants/work";
import dateHelper from "../../../../apis/DateHelper";

const exp: Job = {
  color: "red",
  end: dateHelper("2020-02"),
  location: "loc",
  start: dateHelper("2020-01"),
  short: "org",
  type: "work",
  website: "co",
  company: "corporation",
  title: "accountant",
};

describe("resume | summary | Info", () => {
  it("take you to LinkedIn on Photo Click", () => {
    window.open = vi.fn();
    render(<Info />);

    fireEvent.click(screen.getByAltText("Kenneth Bigler"));
    expect(window.open).toHaveBeenCalled();
  });

  test("getJob", () => {
    const job1 = getJob(exp);
    expect(job1).toStrictEqual("accountant, corporation");
    exp.parent = "parent";
    const job2 = getJob(exp);
    expect(job2).toStrictEqual("accountant, corporation (parent)");
  });
});
