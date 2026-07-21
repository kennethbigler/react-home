import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TabGroup from "./TabGroup";

const tabs = [
  { label: "First", content: <p>First panel</p> },
  { label: "Second", content: <p>Second panel</p> },
];

describe("common | tab-group | TabGroup", () => {
  it("renders tab labels and shows the first panel by default", () => {
    render(<TabGroup label="Example tabs" tabs={tabs} />);

    expect(screen.getByRole("tab", { name: "First" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Second" })).toBeInTheDocument();
    expect(screen.getByText("First panel")).toBeVisible();
    expect(screen.queryByText("Second panel")).not.toBeInTheDocument();
  });

  it("switches panels when a tab is selected", () => {
    render(<TabGroup label="Example tabs" tabs={tabs} />);

    fireEvent.click(screen.getByRole("tab", { name: "Second" }));

    expect(screen.getByText("Second panel")).toBeVisible();
    expect(screen.queryByText("First panel")).not.toBeInTheDocument();
  });

  it("sets aria-label on the tablist from label", () => {
    render(<TabGroup label="Example tabs" tabs={tabs} />);

    expect(screen.getByRole("tablist")).toHaveAttribute(
      "aria-label",
      "Example tabs",
    );
  });

  it("derives slug-based tab and panel ids from label plus a unique useId", () => {
    render(<TabGroup label="Example tabs" tabs={tabs} />);

    const tab = screen.getByRole("tab", { name: "First" });
    const panel = screen.getByRole("tabpanel");
    const tabId = tab.getAttribute("id");

    expect(tabId).toMatch(/^example-tabs-.+-0$/);
    expect(panel).toHaveAttribute(
      "id",
      expect.stringMatching(/^example-tabs-.+panel-0$/),
    );
    expect(panel).toHaveAttribute("aria-labelledby", tabId);
  });

  it("renders endAdornment beside the tabs", () => {
    render(
      <TabGroup
        label="Example tabs"
        tabs={tabs}
        endAdornment={<button type="button">New Game</button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "New Game" }),
    ).toBeInTheDocument();
  });

  it("accepts tabBarSx as an object", () => {
    render(
      <TabGroup
        label="Example tabs"
        tabs={tabs}
        tabBarSx={{ position: "sticky", top: 0 }}
      />,
    );

    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("accepts tabBarSx as an array", () => {
    render(
      <TabGroup
        label="Example tabs"
        tabs={tabs}
        tabBarSx={[{ position: "sticky" }, { top: 0 }]}
      />,
    );

    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("honors defaultIndex for the initially selected panel", () => {
    render(<TabGroup label="Example tabs" tabs={tabs} defaultIndex={1} />);

    expect(screen.getByText("Second panel")).toBeVisible();
    expect(screen.queryByText("First panel")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
