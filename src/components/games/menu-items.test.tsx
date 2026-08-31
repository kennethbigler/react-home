import { Suspense } from "react";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import menuItems, {
  casinoItems,
  gameItems,
  gameRouteLabels,
  gameRoutes,
  socialItems,
  trackerItems,
} from "./menu-items";

describe("games | menu-items", () => {
  it("exports grouped items for the games landing page", () => {
    expect(socialItems).toHaveLength(3);
    expect(trackerItems).toHaveLength(4);
    expect(casinoItems).toHaveLength(5);
    expect(gameItems).toHaveLength(2);

    expect(socialItems[0]).toMatchObject({ name: "BotC", route: "botc" });
    expect(trackerItems[0]).toMatchObject({ name: "Bridge", route: "bridge" });
    expect(casinoItems[0]).toMatchObject({
      name: "BlackJack",
      route: "blackjack",
    });
    expect(gameItems[0]).toMatchObject({ name: "Connect4", route: "connect4" });
  });

  it("flattens all route groups into gameRoutes", () => {
    expect(gameRoutes).toHaveLength(15);
    expect(gameRoutes[0]).toMatchObject({ name: "Home - Games", route: "" });
    expect(gameRoutes.find((route) => route.route === "yahtzee")).toMatchObject(
      {
        name: "Yahtzee",
        icon: "🎲",
      },
    );
  });

  it("interleaves dividers between groups in the default menu export", () => {
    const dividerCount = menuItems.filter((item) => "divider" in item).length;

    expect(dividerCount).toBe(4);
    expect(menuItems[0]).toMatchObject({ name: "Home - Games" });
    expect(menuItems[1]).toEqual({ divider: true });
    expect(menuItems.at(-1)).toMatchObject({ name: "Tic-Tac-Toe" });
  });

  it("maps route segments to labels for page titles", () => {
    expect(gameRouteLabels.get("")).toBe("Home - Games");
    expect(gameRouteLabels.get("botc")).toBe("BotC");
    expect(gameRouteLabels.get("imperial-assault")).toBe("Imperial Assault");
  });

  it("loads every lazy route component registered in the menu", async () => {
    for (const { Component } of gameRoutes) {
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
