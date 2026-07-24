import { lazy } from "react";
import {
  type MenuItem,
  type RouteMenuItem,
  interleaveDividers,
  isNavMenuItem,
} from "../common/menu-types";

const resumeRouteGroups = [
  [
    {
      name: "Summary",
      route: "",
      Component: lazy(() => import("./summary")),
    },
    {
      name: "Work",
      route: "work",
      Component: lazy(() => import("./work")),
    },
    {
      name: "Resume",
      route: "resume",
      Component: lazy(() => import("./resume")),
    },
    {
      name: "Education",
      route: "education",
      Component: lazy(() => import("./education")),
    },
    {
      name: "Presentations",
      route: "presentations",
      Component: lazy(() => import("./presentations")),
    },
  ],
  [
    {
      name: "A11y",
      route: "a11y",
      Component: lazy(() => import("./a11y-practice")),
    },
    {
      name: "Finances",
      route: "finances",
      Component: lazy(() => import("./finances")),
    },
  ],
  [
    {
      name: "F1",
      route: "f1",
      Component: lazy(() => import("./f1")),
    },
    {
      name: "Cars",
      route: "cars",
      Component: lazy(() => import("./cars")),
    },
    {
      name: "Travel Map",
      route: "travel",
      Component: lazy(() => import("./travel-map")),
    },
  ],
] satisfies RouteMenuItem[][];

/** Links to /games, which is handled by the root games router (GamesHome). */
const gamesLink = {
  link: true,
  name: "Games",
  route: "games",
} as const;

export const resumeRoutes = resumeRouteGroups.flat();

const menuItems: MenuItem[] = [
  ...interleaveDividers(resumeRouteGroups),
  { divider: true },
  gamesLink,
];

export const resumeRouteLabels = new Map(
  menuItems.filter(isNavMenuItem).map(({ name, route }) => [route, name]),
);

export default menuItems;
