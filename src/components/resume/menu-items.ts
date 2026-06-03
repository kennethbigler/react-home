import { lazy } from "react";

export interface MenuItem {
  divider?: boolean;
  name?: string;
  route?: string;
}

export const summaryRoute = {
  name: "Summary",
  route: "",
  Component: lazy(() => import("./summary")),
};

export const workRoute = {
  name: "Work",
  route: "work",
  Component: lazy(() => import("./work")),
};

export const resumeRoute = {
  name: "Resume",
  route: "resume",
  Component: lazy(() => import("./resume")),
};

export const educationRoute = {
  name: "Education",
  route: "education",
  Component: lazy(() => import("./education")),
};

export const presentationsRoute = {
  name: "Presentations",
  route: "presentations",
  Component: lazy(() => import("./presentations")),
};

export const compCalculatorRoute = {
  name: "Comp Calculator",
  route: "comp",
  Component: lazy(() => import("./comp-calc")),
};

export const f1Route = {
  name: "F1",
  route: "f1",
  Component: lazy(() => import("./f1")),
};

export const carsRoute = {
  name: "Cars",
  route: "cars",
  Component: lazy(() => import("./cars")),
};

export const travelMapRoute = {
  name: "Travel Map",
  route: "travel",
  Component: lazy(() => import("./travel-map")),
};

export const gamesRoute = {
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
