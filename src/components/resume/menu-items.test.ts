import menuItems, { resumeRouteLabels, resumeRoutes } from "./menu-items";

describe("resume | menu-items", () => {
  it("flattens route groups into resumeRoutes", () => {
    expect(resumeRoutes).toHaveLength(7);
    expect(resumeRoutes.every((route) => route.Component)).toBe(true);
  });

  it("interleaves dividers and appends the games and sudoku links", () => {
    expect(menuItems.filter((item) => "divider" in item)).toHaveLength(2);
    expect(menuItems.at(-2)).toEqual({
      link: true,
      name: "Games",
      route: "games",
    });
    expect(menuItems.at(-1)).toEqual({
      link: true,
      name: "Sudoku",
      route: "sudoku",
    });
  });

  it("maps route segments to labels for page titles", () => {
    expect(resumeRouteLabels.get("")).toBe("Summary");
    expect(resumeRouteLabels.get("games")).toBe("Games");
    expect(resumeRouteLabels.get("sudoku")).toBe("Sudoku");
    expect(resumeRoutes.some((route) => route.route === "a11y")).toBe(false);
    expect(resumeRouteLabels.has("a11y")).toBe(false);
    expect(resumeRoutes.some((route) => route.route === "education")).toBe(
      false,
    );
    expect(resumeRouteLabels.has("education")).toBe(false);
    expect(resumeRoutes.some((route) => route.route === "presentations")).toBe(
      false,
    );
    expect(resumeRouteLabels.has("presentations")).toBe(false);
    expect(resumeRouteLabels.get("experience")).toBe("Experience");
  });
});
