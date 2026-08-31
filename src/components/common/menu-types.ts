import type { ComponentType, LazyExoticComponent } from "react";

/** Visual separator in a navigation menu. */
type MenuDivider = { divider: true };

type MenuRouteFields = {
  name: string;
  route: string;
};

/** A menu entry that registers a lazy-loaded route in this section's router. */
export type RouteMenuItem = MenuRouteFields & {
  icon?: string;
  Component: LazyExoticComponent<ComponentType>;
};

/**
 * A menu link to another section (e.g. resume menu → /games).
 * Routed by a different router; no Component registered here.
 */
type MenuLink = MenuRouteFields & {
  link: true;
};

type NavMenuItem = RouteMenuItem | MenuLink;

export type MenuItem = MenuDivider | NavMenuItem;

export const interleaveDividers = (groups: RouteMenuItem[][]): MenuItem[] => {
  const nonEmptyGroups = groups.filter((group) => group.length > 0);

  return nonEmptyGroups.flatMap((group, index) =>
    index === 0 ? group : [{ divider: true }, ...group],
  );
};

export const isNavMenuItem = (item: MenuItem): item is NavMenuItem =>
  !("divider" in item);
