import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NetWorthEntryCard from "./NetWorthEntryCard";

describe("resume | finances | net-worth | NetWorthEntryCard", () => {
  it("renders amounts, total, and positive net change", () => {
    const onClick = vi.fn();

    render(
      <NetWorthEntryCard
        entry={{
          entryDate: "2021-06",
          amounts: { Cash: 1000, Investments: 5000 },
        }}
        calcEntry={{ total: 6000, netDiff: 1500 }}
        categories={["Cash", "Investments", "Home"]}
        onClick={onClick}
      />,
    );

    expect(screen.getByText("June 2021")).toBeInTheDocument();
    expect(screen.getByText("Cash: $1,000.00")).toBeInTheDocument();
    expect(screen.getByText("Investments: $5,000.00")).toBeInTheDocument();
    expect(screen.getByText("Home: $0.00")).toBeInTheDocument();
    expect(screen.getByText("Total:")).toBeInTheDocument();
    expect(screen.getByText("$6,000.00")).toBeInTheDocument();
    expect(screen.getByText("Net:")).toBeInTheDocument();
    expect(screen.getByText("$1,500.00")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit net worth entry for June 2021",
      }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders negative net change in the error color path", () => {
    render(
      <NetWorthEntryCard
        entry={{ entryDate: "2020-01", amounts: { Cash: 800 } }}
        calcEntry={{ total: 800, netDiff: -200 }}
        categories={["Cash"]}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText("Net:")).toBeInTheDocument();
    expect(screen.getByText("-$200.00")).toBeInTheDocument();
  });

  it("omits the net row when netDiff is zero", () => {
    render(
      <NetWorthEntryCard
        entry={{ entryDate: "2020-01", amounts: { Cash: 100 } }}
        calcEntry={{ total: 100, netDiff: 0 }}
        categories={["Cash"]}
        onClick={vi.fn()}
      />,
    );

    expect(screen.queryByText("Net:")).not.toBeInTheDocument();
  });
});
