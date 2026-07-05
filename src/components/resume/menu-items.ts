import { lazy } from "react";
import { type MenuItem, isNavMenuItem } from "../common/menu-types";

const summaryRoute = {
  name: "Summary",
  route: "",
  Component: lazy(() => import("./summary")),
};

const workRoute = {
  name: "Work",
  route: "work",
  Component: lazy(() => import("./work")),
};

const resumeRoute = {
  name: "Resume",
  route: "resume",
  Component: lazy(() => import("./resume")),
};

const educationRoute = {
  name: "Education",
  route: "education",
  Component: lazy(() => import("./education")),
};

const presentationsRoute = {
  name: "Presentations",
  route: "presentations",
  Component: lazy(() => import("./presentations")),
};

const a11yPracticeRoute = {
  name: "A11y Practice",
  route: "a11y",
  Component: lazy(() => import("./a11y-practice")),
};

const compCalculatorRoute = {
  name: "Comp Calculator",
  route: "comp",
  Component: lazy(() => import("./comp-calc")),
};

const f1Route = {
  name: "F1",
  route: "f1",
  Component: lazy(() => import("./f1")),
};

const carsRoute = {
  name: "Cars",
  route: "cars",
  Component: lazy(() => import("./cars")),
};

const travelMapRoute = {
  name: "Travel Map",
  route: "travel",
  Component: lazy(() => import("./travel-map")),
};

/** Links to /games, which is handled by the root games router (GamesHome). */
const gamesLink = {
  link: true,
  name: "Games",
  route: "games",
} as const;

export const resumeRoutes = [
  summaryRoute,
  workRoute,
  resumeRoute,
  educationRoute,
  presentationsRoute,
  a11yPracticeRoute,
  compCalculatorRoute,
  f1Route,
  carsRoute,
  travelMapRoute,
];

const menuItems: MenuItem[] = [
  summaryRoute,
  workRoute,
  resumeRoute,
  educationRoute,
  presentationsRoute,
  { divider: true },
  a11yPracticeRoute,
  compCalculatorRoute,
  { divider: true },
  f1Route,
  carsRoute,
  travelMapRoute,
  { divider: true },
  gamesLink,
];

export const resumeRouteLabels = new Map(
  menuItems.filter(isNavMenuItem).map(({ name, route }) => [route, name]),
);

export default menuItems;
