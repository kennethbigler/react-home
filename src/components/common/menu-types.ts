import type { ComponentType, LazyExoticComponent } from "react";

export interface RouteComponentProps {
  onItemClick?: (loc: string) => void;
}

export type LazyRouteComponent = LazyExoticComponent<
  ComponentType<RouteComponentProps>
>;

/** Visual separator in a navigation menu. */
export type MenuDivider = { divider: true };

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
export type MenuLink = {
  link: true;
  name: string;
  route: string;
};

export type NavMenuItem = RouteMenuItem | MenuLink;

export type MenuItem = MenuDivider | NavMenuItem;

export const isNavMenuItem = (item: MenuItem): item is NavMenuItem =>
  !("divider" in item);

export const isRouteMenuItem = (item: MenuItem): item is RouteMenuItem =>
  isNavMenuItem(item) && !("link" in item);
