import type { ComponentType, LazyExoticComponent } from "react";

interface RouteComponentProps {
  onItemClick?: (loc: string) => void;
}

type LazyRouteComponent = LazyExoticComponent<
  ComponentType<RouteComponentProps>
>;

/** Visual separator in a navigation menu. */
type MenuDivider = { divider: true };

/** A menu entry that registers a lazy-loaded route in this section's router. */
export type RouteMenuItem = {
  name: string;
  route: string;
  icon?: string;
  Component: LazyRouteComponent;
};

/**
 * A menu link to another section (e.g. resume menu → /games).
 * Routed by a different router; no Component registered here.
 */
type MenuLink = {
  link: true;
  name: string;
  route: string;
};

type NavMenuItem = RouteMenuItem | MenuLink;

export type MenuItem = MenuDivider | NavMenuItem;

export const interleaveDividers = (groups: RouteMenuItem[][]): MenuItem[] =>
  groups.flatMap((group, index) =>
    index === 0 ? group : [{ divider: true }, ...group],
  );

export const isNavMenuItem = (item: MenuItem): item is NavMenuItem =>
  !("divider" in item);
