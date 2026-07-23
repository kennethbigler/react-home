import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  netWorthAtom,
  netWorthCategoriesAtom,
} from "../../../../jotai/finances-atom";
import NetWorth from "./NetWorth";

vi.mock("../../../common/highcharts/coreHighcharts", () => ({
  default: {},
}));

vi.mock("highcharts/highcharts.src", () => ({
  default: {},
}));

vi.mock("@highcharts/react", () => ({
  Chart: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="highcharts-chart">{children}</div>
  ),
  Credits: () => null,
  Legend: () => null,
  PlotOptions: () => null,
  Series: () => null,
  Title: ({ children }: { children?: React.ReactNode }) => (
    <span>{children}</span>
  ),
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
  setHighcharts: vi.fn(),
}));

vi.mock("@highcharts/react/modules/Accessibility", () => ({
  Accessibility: () => null,
}));

const renderNetWorth = (
  categories: string[] = [],
  entries: { entryDate: string; amounts: Record<string, number> }[] = [],
) => {
  const store = createStore();
  store.set(netWorthCategoriesAtom, categories);
  store.set(netWorthAtom, entries);

  return render(
    <Provider store={store}>
      <NetWorth />
    </Provider>,
  );
};

describe("resume | finances | net-worth | NetWorth", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("disables + Entry until categories exist", () => {
    renderNetWorth();

    expect(screen.getByRole("button", { name: "+ Entry" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Set Categories" }),
    ).toBeInTheDocument();
  });

  it("creates, edits, and deletes an entry after categories are set", async () => {
    renderNetWorth();

    fireEvent.click(screen.getByRole("button", { name: "Set Categories" }));
    fireEvent.change(screen.getByLabelText("Category 1"), {
      target: { value: "Cash" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Category" }));
    fireEvent.change(screen.getByLabelText("Category 2"), {
      target: { value: "Investments" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(
      await screen.findByRole("button", { name: "+ Entry" }),
    ).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "+ Entry" }));
    expect(screen.getByText("New Net Worth Entry")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByLabelText("Year"));
    fireEvent.click(screen.getByRole("option", { name: "2020" }));
    fireEvent.change(screen.getByLabelText("Cash"), {
      target: { value: 10000 },
    });
    fireEvent.change(screen.getByLabelText("Investments"), {
      target: { value: 40000 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(await screen.findByText("Cash: $10,000.00")).toBeInTheDocument();
    expect(screen.getByText("January 2020")).toBeInTheDocument();
    expect(screen.getByText("Investments: $40,000.00")).toBeInTheDocument();
    expect(screen.getByText("$50,000.00")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cash: $10,000.00"));
    expect(screen.getByText("Edit Net Worth Entry")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Cash"), {
      target: { value: 12000 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    expect(await screen.findByText("Cash: $12,000.00")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cash: $12,000.00"));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() =>
      expect(screen.queryByText("Cash: $12,000.00")).toBeNull(),
    );
  });

  it("shows graphs when entries exist", () => {
    renderNetWorth(
      ["Cash", "Investments"],
      [
        {
          entryDate: "2020-01",
          amounts: { Cash: 10000, Investments: 40000 },
        },
      ],
    );

    expect(screen.getByText("Total Net Worth")).toBeInTheDocument();
    expect(screen.getByText("Net Worth Breakdown")).toBeInTheDocument();
  });

  it("orders categories by latest entry amounts on cards and dialogs", async () => {
    renderNetWorth(
      ["Cash", "Home", "Investments"],
      [
        {
          entryDate: "2020-01",
          amounts: { Cash: 1000, Home: 5000, Investments: 20000 },
        },
      ],
    );

    const card = screen.getByText("January 2020").closest(".MuiCard-root");
    expect(card?.textContent).toMatch(
      /January 2020.*Investments: \$20,000\.00.*Home: \$5,000\.00.*Cash: \$1,000\.00/,
    );

    fireEvent.click(screen.getByRole("button", { name: "Set Categories" }));
    expect(screen.getByLabelText("Category 1")).toHaveValue("Investments");
    expect(screen.getByLabelText("Category 2")).toHaveValue("Home");
    expect(screen.getByLabelText("Category 3")).toHaveValue("Cash");
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    fireEvent.click(screen.getByRole("button", { name: "+ Entry" }));
    const dialog = screen.getByRole("dialog", {
      name: "New Net Worth Entry",
    });
    const amountFields = dialog.querySelectorAll('input[type="number"]');
    expect(amountFields[0]).toHaveAttribute("id");
    expect(
      screen
        .getByLabelText("Investments")
        .compareDocumentPosition(screen.getByLabelText("Home")) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      screen
        .getByLabelText("Home")
        .compareDocumentPosition(screen.getByLabelText("Cash")) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("displays entries by date, not insertion order", async () => {
    renderNetWorth(
      ["Cash"],
      [
        { entryDate: "2022-01", amounts: { Cash: 3000 } },
        { entryDate: "2020-01", amounts: { Cash: 1000 } },
        { entryDate: "2021-01", amounts: { Cash: 2000 } },
      ],
    );

    expect(await screen.findByText("January 2022")).toBeInTheDocument();

    const dates = screen
      .getAllByText(/January 202\d/)
      .map((node) => node.textContent);
    expect(dates).toEqual(["January 2022", "January 2021", "January 2020"]);
  });
});
