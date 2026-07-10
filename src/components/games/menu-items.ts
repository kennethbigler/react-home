import { lazy } from "react";
import {
  type MenuItem,
  type RouteMenuItem,
  interleaveDividers,
  isNavMenuItem,
} from "../common/menu-types";

const gameRouteGroups = {
  home: [
    {
      name: "Home - Games",
      route: "",
      Component: lazy(() => import("./Home")),
    },
  ],
  social: [
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
  ],
  tracker: [
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
  ],
  casino: [
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
  ],
  games: [
    {
      name: "Connect4",
      route: "connect4",
      icon: "🔴",
      Component: lazy(() => import("./connect4")),
    },
    {
      name: "Tic-Tac-Toe",
      route: "tictactoe",
      icon: "❌",
      Component: lazy(() => import("./tictactoe")),
    },
  ],
} satisfies Record<string, RouteMenuItem[]>;

export const socialItems = gameRouteGroups.social;
export const trackerItems = gameRouteGroups.tracker;
export const casinoItems = gameRouteGroups.casino;
export const gameItems = gameRouteGroups.games;

export const gameRoutes = Object.values(gameRouteGroups).flat();

const menuItems: MenuItem[] = interleaveDividers(
  Object.values(gameRouteGroups),
);

export const gameRouteLabels = new Map(
  menuItems.filter(isNavMenuItem).map(({ name, route }) => [route, name]),
);

export default menuItems;
