import { lazy } from "react";

export interface MenuItem {
  name?: string;
  route?: string;
  divider?: boolean;
  icon?: string;
}

export const gameHomeRoute = {
  name: "Home - Games",
  route: "",
  Component: lazy(() => import("./Home")),
};

export const socialItems = [
  {
    name: "BotC",
    route: "botc",
    icon: "⏱️",
    Component: lazy(() => import("./botc")),
  },
  {
    name: "Murder Mystery",
    route: "murder",
    icon: "🔎",
    Component: lazy(() => import("./murder-mystery")),
  },
  {
    name: "Werewolf",
    route: "werewolf",
    icon: "🐺",
    Component: lazy(() => import("./werewolf")),
  },
];
export const trackerItems = [
  {
    name: "Are You The One",
    route: "are-you-the-one",
    icon: "🤷‍♂️",
    Component: lazy(() => import("./are-you-the-one")),
  },
  {
    name: "Bridge",
    route: "bridge",
    icon: "🌉",
    Component: lazy(() => import("./bridge")),
  },
  {
    name: "Imperial Assault",
    route: "imperial-assault",
    icon: "🪐",
    Component: lazy(() => import("./imperial-assault")),
  },
  {
    name: "Spades",
    route: "spades",
    icon: "♠️",
    Component: lazy(() => import("./spades")),
  },
  {
    name: "Type Checker",
    route: "types",
    icon: "🧪",
    Component: lazy(() => import("./type-checker")),
  },
];
export const casinoItems = [
  {
    name: "BlackJack",
    route: "blackjack",
    icon: "🃏",
    Component: lazy(() => import("./blackjack")),
  },
  {
    name: "Deal or No Deal",
    route: "deal",
    icon: "💼",
    Component: lazy(() => import("./deal-or-no-deal")),
  },
  {
    name: "Poker",
    route: "poker",
    icon: "🍀",
    Component: lazy(() => import("./poker")),
  },
  {
    name: "Slot Machine",
    route: "slots",
    icon: "🎰",
    Component: lazy(() => import("./slots")),
  },
  {
    name: "Yahtzee",
    route: "yahtzee",
    icon: "🎲",
    Component: lazy(() => import("./yahtzee")),
  },
];
export const gameItems = [
  {
    name: "Connect4",
    route: "connect4",
    icon: "🔴",
    Component: lazy(() => import("./connect4")),
  },
  {
    name: "Family Feud",
    route: "family-feud",
    icon: "👨‍👩‍👧‍👦",
    Component: lazy(() => import("./family-feud")),
  },
  {
    name: "Tic-Tac-Toe",
    route: "tictactoe",
    icon: "❌",
    Component: lazy(() => import("./tictactoe")),
  },
];

const menuItems: MenuItem[] = [
  gameHomeRoute,
  { divider: true },
  ...socialItems,
  { divider: true },
  ...trackerItems,
  { divider: true },
  ...casinoItems,
  { divider: true },
  ...gameItems,
];

export const gameRoutes = [
  gameHomeRoute,
  ...socialItems,
  ...trackerItems,
  ...casinoItems,
  ...gameItems,
];

export const gameRouteLabels = new Map(
  menuItems
    .filter((item): item is Required<Pick<MenuItem, "name" | "route">> =>
      Boolean(item.name && item.route !== undefined),
    )
    .map(({ name, route }) => [route, name]),
);

export default menuItems;
