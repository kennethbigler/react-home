import menuItems, { resumeRouteLabels, resumeRoutes } from "./menu-items";

describe("resume | menu-items", () => {
  it("flattens route groups into resumeRoutes", () => {
    expect(resumeRoutes).toHaveLength(10);
    expect(resumeRoutes.find((route) => route.route === "a11y")).toMatchObject({
      name: "A11y Practice",
    });
    expect(resumeRoutes.every((route) => route.Component)).toBe(true);
  });

  it("interleaves dividers and appends the games link", () => {
    expect(menuItems.filter((item) => "divider" in item)).toHaveLength(3);
    expect(menuItems.at(-1)).toEqual({
      link: true,
      name: "Games",
      route: "games",
    });
  });

  it("maps route segments to labels for page titles", () => {
    expect(resumeRouteLabels.get("")).toBe("Summary");
    expect(resumeRouteLabels.get("a11y")).toBe("A11y Practice");
    expect(resumeRouteLabels.get("games")).toBe("Games");
  });
});
