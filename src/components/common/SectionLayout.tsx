import {
  Component,
  Suspense,
  type ComponentType,
  type ErrorInfo,
  type ReactElement,
  type ReactNode,
} from "react";
import { Outlet } from "react-router";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, Typography } from "@mui/material";
import Header, { type NavProps } from "./header/Header";
import LoadingSpinner from "./loading-spinner";

interface SectionLayoutProps {
  /** navigation menu rendered inside the header drawer */
  Menu: ComponentType<NavProps>;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
}

/** Keeps the section header mounted if a lazy page chunk fails to load. */
class SectionErrorBoundary extends Component<
  { children: ReactNode },
  SectionErrorBoundaryState
> {
  state: SectionErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Section page failed to load:", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          role="alert"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            py: 4,
            color: "warning.main",
          }}
        >
          <WarningAmberIcon aria-hidden />
          <Typography>This page failed to load.</Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

/** Layout route for one section of the site (resume, games): header + lazy page outlet. */
const SectionLayout = ({ Menu }: SectionLayoutProps) => (
  <>
    <Header>
      {(onItemClick): ReactElement<NavProps> => (
        <Menu onItemClick={onItemClick} />
      )}
    </Header>
    <SectionErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </SectionErrorBoundary>
  </>
);

export default SectionLayout;
