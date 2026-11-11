import { lazy } from "react";
import {
  type MenuItem,
  type RouteMenuItem,
  isNavMenuItem,
} from "../common/menu-types";

const sudokuRouteGroups = {
  home: [
    {
      name: "Sudoku",
      route: "",
      Component: lazy(() => import("./marketing")),
    },
  ],
  pages: [
    {
      name: "Support",
      route: "support",
      icon: "💬",
      Component: lazy(() => import("./support")),
    },
    {
      name: "Privacy",
      route: "privacy",
      icon: "🔒",
      Component: lazy(() => import("./privacy")),
    },
  ],
} satisfies Record<string, RouteMenuItem[]>;

export const sudokuRoutes = Object.values(sudokuRouteGroups).flat();

const menuItems: MenuItem[] = Object.values(sudokuRouteGroups).flat();

export const sudokuRouteLabels = new Map(
  menuItems.filter(isNavMenuItem).map(({ name, route }) => [route, name]),
);

export default menuItems;
