import { Suspense, type ComponentType, type ReactElement } from "react";
import { Outlet } from "react-router";
import Header, { type NavProps } from "./header/Header";
import LoadingSpinner from "./loading-spinner";

interface SectionLayoutProps {
  /** navigation menu rendered inside the header drawer */
  Menu: ComponentType<NavProps>;
}

/** Layout route for one section of the site (resume, games): header + lazy page outlet. */
const SectionLayout = ({ Menu }: SectionLayoutProps) => (
  <>
    <Header>
      {(onItemClick): ReactElement<NavProps> => (
        <Menu onItemClick={onItemClick} />
      )}
    </Header>
    <Suspense fallback={<LoadingSpinner />}>
      <Outlet />
    </Suspense>
  </>
);

export default SectionLayout;
