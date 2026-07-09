import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TabPanel from "./TabPanel";

const tabPrefix = "test-tab";

describe("common | tab-panel | TabPanel", () => {
  it("renders children when value matches index", () => {
    render(
      <TabPanel value={0} index={0} tabPrefix={tabPrefix}>
        <p>Panel content</p>
      </TabPanel>,
    );

    expect(screen.getByText("Panel content")).toBeVisible();
    expect(screen.getByRole("tabpanel")).not.toHaveAttribute("hidden");
  });

  it("hides panel and omits children when value does not match index", () => {
    render(
      <TabPanel value={0} index={1} tabPrefix={tabPrefix}>
        <p>Hidden panel</p>
      </TabPanel>,
    );

    const panel = screen.getByRole("tabpanel", { hidden: true });
    expect(panel).toHaveAttribute("hidden");
    expect(screen.queryByText("Hidden panel")).not.toBeInTheDocument();
  });

  it("sets tabpanel id and aria-labelledby from tabPrefix and index", () => {
    render(
      <TabPanel value={2} index={2} tabPrefix={tabPrefix}>
        <p>Third panel</p>
      </TabPanel>,
    );

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("id", "test-tabpanel-2");
    expect(panel).toHaveAttribute("aria-labelledby", "test-tab-2");
  });
});
