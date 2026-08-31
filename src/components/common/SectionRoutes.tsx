import { Suspense, type ComponentType, type ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router";
import type { RouteMenuItem } from "./menu-types";
import Header, { type NavProps } from "./header/Header";
import LoadingSpinner from "./loading-spinner";

interface SectionRoutesProps {
  /** navigation menu rendered inside the header drawer */
  Menu: ComponentType<NavProps>;
  routes: RouteMenuItem[];
  /** where the catch-all route redirects */
  fallbackTo: string;
}

/** Header + lazy-loaded routes for one section of the site (resume, games). */
const SectionRoutes = ({ Menu, routes, fallbackTo }: SectionRoutesProps) => (
  <>
    <Header>
      {(onItemClick): ReactElement<NavProps> => (
        <Menu onItemClick={onItemClick} />
      )}
    </Header>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {routes.map(({ Component, route }) => (
          <Route key={route || "home"} path={route} element={<Component />} />
        ))}
        <Route path="*" element={<Navigate to={fallbackTo} replace />} />
      </Routes>
    </Suspense>
  </>
);

export default SectionRoutes;
