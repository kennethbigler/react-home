import { lazy } from "react";

export interface MenuItem {
  divider?: boolean;
  name?: string;
  route?: string;
}

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

const gamesRoute = {
  name: "Games",
  route: "games",
};

export const resumeRoutes = [
  summaryRoute,
  workRoute,
  resumeRoute,
  educationRoute,
  presentationsRoute,
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
  compCalculatorRoute,
  { divider: true },
  f1Route,
  carsRoute,
  travelMapRoute,
  { divider: true },
  gamesRoute,
];

export const resumeRouteLabels = new Map(
  menuItems
    .filter((item): item is Required<Pick<MenuItem, "name" | "route">> =>
      Boolean(item.name && item.route !== undefined),
    )
    .map(({ name, route }) => [route, name]),
);

export default menuItems;
