import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CustomTabPanel from "./CustomTabPanel";

describe("resume | a11y-practice | CustomTabPanel", () => {
  it("renders children when value matches index", () => {
    render(
      <CustomTabPanel value={0} index={0}>
        <p>Panel content</p>
      </CustomTabPanel>,
    );

    expect(screen.getByText("Panel content")).toBeVisible();
    expect(screen.getByRole("tabpanel")).not.toHaveAttribute("hidden");
  });

  it("hides panel and omits children when value does not match index", () => {
    render(
      <CustomTabPanel value={0} index={1}>
        <p>Hidden panel</p>
      </CustomTabPanel>,
    );

    const panel = screen.getByRole("tabpanel", { hidden: true });
    expect(panel).toHaveAttribute("hidden");
    expect(screen.queryByText("Hidden panel")).not.toBeInTheDocument();
  });

  it("sets tabpanel id and aria-labelledby from index", () => {
    render(
      <CustomTabPanel value={2} index={2}>
        <p>Third panel</p>
      </CustomTabPanel>,
    );

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("id", "simple-tabpanel-2");
    expect(panel).toHaveAttribute("aria-labelledby", "simple-tab-2");
  });
});
