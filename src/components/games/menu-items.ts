import { lazy } from "react";
import {
  type MenuItem,
  type RouteMenuItem,
  interleaveDividers,
  isNavMenuItem,
} from "../common/menu-types";

const gameRouteGroups = [
  [
    {
      name: "Home - Games",
      route: "",
      Component: lazy(() => import("./Home")),
    },
  ],
  [
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
  [
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
  [
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
  [
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
] satisfies RouteMenuItem[][];

export const socialItems = gameRouteGroups[1];
export const trackerItems = gameRouteGroups[2];
export const casinoItems = gameRouteGroups[3];
export const gameItems = gameRouteGroups[4];

export const gameRoutes = gameRouteGroups.flat();

const menuItems: MenuItem[] = interleaveDividers(gameRouteGroups);

export const gameRouteLabels = new Map(
  menuItems.filter(isNavMenuItem).map(({ name, route }) => [route, name]),
);

export default menuItems;
