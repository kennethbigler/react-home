import { Suspense } from "react";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import menuItems, { sudokuRouteLabels, sudokuRoutes } from "./menu-items";

describe("sudoku | menu-items", () => {
  it("flattens all route groups into sudokuRoutes", () => {
    expect(sudokuRoutes).toHaveLength(3);
    expect(sudokuRoutes[0]).toMatchObject({ name: "Sudoku", route: "" });
    expect(
      sudokuRoutes.find((route) => route.route === "privacy"),
    ).toMatchObject({
      name: "Privacy",
      icon: "🔒",
    });
  });

  it("has no dividers in the default menu export", () => {
    const dividerCount = menuItems.filter((item) => "divider" in item).length;

    expect(dividerCount).toBe(0);
    expect(menuItems[0]).toMatchObject({ name: "Sudoku" });
    expect(menuItems.at(-1)).toMatchObject({ name: "Privacy" });
  });

  it("maps route segments to labels for page titles", () => {
    expect(sudokuRouteLabels.get("")).toBe("Sudoku");
    expect(sudokuRouteLabels.get("support")).toBe("Support");
    expect(sudokuRouteLabels.get("privacy")).toBe("Privacy");
  });

  it("loads every lazy route component registered in the menu", async () => {
    for (const { Component } of sudokuRoutes) {
      const { unmount } = render(
        <MemoryRouter>
          <Suspense fallback={null}>
            <Component />
          </Suspense>
        </MemoryRouter>,
      );

      await waitFor(
        () => {
          expect(document.body.innerHTML.length).toBeGreaterThan(0);
        },
        { timeout: 10000 },
      );

      unmount();
    }
  }, 120000);
});
